// src/utils/appFunctions.js
// Import all necessary Firebase instances and functions from firebaseConfig.js
import {
    db, auth, app_id, // Initialized instances and app_id
    doc, setDoc, deleteDoc, collection, query, where, getDoc, getDocs,
    addDoc, writeBatch, signOut as firebaseSignOut // Firebase functions, signOut aliased
} from '../firebaseConfig';


/**
 * Adds a new subject to the user's data.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {object} testData - Current test data for validation.
 * @param {string} subjectName - The name of the subject to add.
 * @returns {Promise<void>}
 */
export const addSubject = async (userId, showNotification, testData, subjectName) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    if (!subjectName) { showNotification('Subject name is required.', 'error'); return; }
    if (testData.hasOwnProperty(subjectName)) { showNotification(`Subject "${subjectName}" already exists.`, 'error'); return; }

    try {
        const subjectDocRef = doc(db, "artifacts", app_id, "users", userId, "subjects", subjectName);
        await setDoc(subjectDocRef, { tests: [] });
        showNotification(`Subject "${subjectName}" added successfully.`, 'success');
    } catch (error) {
        console.error("Error adding subject:", error);
        showNotification(`Failed to add subject "${subjectName}".`, 'error');
    }
};

/**
 * Adds a new test to a specified subject.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {object} testData - Current test data for validation.
 * @param {string} subjectName - The subject to add the test to.
 * @param {string} title - The title of the test.
 * @param {number} mcqs - The number of MCQs in the test.
 * @param {string} date - The completion date of the test.
 * @param {string} [link=''] - Optional link for the test.
 * @returns {Promise<void>}
 */
export const addTest = async (userId, showNotification, testData, subjectName, title, mcqs, date, link = '') => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    if (!title || !mcqs || !date) { showNotification('All test fields (except link) are required.', 'error'); return; }
    if (!testData.hasOwnProperty(subjectName)) { showNotification('Subject does not exist. Please create the subject first.', 'error'); return; }
    if (testData[subjectName].some(test => test.title === title)) { showNotification(`A test with the title "${title}" already exists in ${subjectName}.`, 'error'); return; }

    try {
        const newTest = { title, mcqs: parseInt(mcqs), date, link, completed: false };
        const subjectDocRef = doc(db, "artifacts", app_id, "users", userId, "subjects", subjectName);
        const subjectDoc = await getDoc(subjectDocRef);
        if (subjectDoc.exists()) {
            const currentTests = subjectDoc.data().tests || [];
            const updatedTests = [...currentTests, newTest];
            await setDoc(subjectDocRef, { tests: updatedTests }, { merge: true });
            showNotification(`Test "${title}" added to "${subjectName}".`, 'success');
        } else {
            showNotification('Subject document not found. This might be a sync issue. Please try refreshing.', 'error');
        }
    } catch (error) {
        console.error("Error adding test:", error);
        showNotification(`Failed to add test "${title}".`, 'error');
    }
};

/**
 * Deletes a subject and its associated focus items and timetable entries.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {object} testData - Current test data for validation (used for checking existence).
 * @param {function} setTodayFocusItems - State setter for todayFocusItems (to update UI).
 * @param {function} setTimetableEntries - State setter for timetableEntries (to update UI).
 * @param {function} setCurrentSelectedSubject - State setter for currentSelectedSubject.
 * @param {function} setCurrentTimetableSubject - State setter for currentTimetableSubject.
 * @param {string} subjectName - The name of the subject to delete.
 * @returns {Promise<void>}
 */
export const deleteSubject = async (
    userId, showNotification, testData, setTodayFocusItems, setTimetableEntries,
    setCurrentSelectedSubject, setCurrentTimetableSubject, subjectName // Ensure subjectName is a parameter
) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    if (!testData.hasOwnProperty(subjectName)) { showNotification(`Subject "${subjectName}" not found.`, 'error'); return; }

    try {
        const subjectDocRef = doc(db, "artifacts", app_id, "users", userId, "subjects", subjectName);
        await deleteDoc(subjectDocRef);

        // Also remove associated focus items and timetable entries
        // Note: These state updates are for immediate UI feedback. Firestore listeners will re-sync as well.
        setTodayFocusItems(prevItems => prevItems.filter(item => item.subject !== subjectName));
        const todayFocusCollectionRef = collection(db, "artifacts", app_id, "users", userId, "todayFocus");
        const qFocus = query(todayFocusCollectionRef, where("subject", "==", subjectName));
        const snapshotFocus = await getDocs(qFocus);
        const focusBatch = writeBatch(db); // Use a batch for multiple deletes
        snapshotFocus.forEach((docSnap) => {
            focusBatch.delete(doc(todayFocusCollectionRef, docSnap.id));
        });
        await focusBatch.commit();

        setTimetableEntries(prevEntries => prevEntries.filter(entry => entry.subject !== subjectName));
        const timetableCollectionRef = collection(db, "artifacts", app_id, "users", userId, "timetable");
        const qTimetable = query(timetableCollectionRef, where("subject", "==", subjectName));
        const snapshotTimetable = await getDocs(qTimetable);
        const timetableBatch = writeBatch(db); // Use a batch for multiple deletes
        snapshotTimetable.forEach((docSnap) => {
            timetableBatch.delete(doc(timetableCollectionRef, docSnap.id));
        });
        await timetableBatch.commit();

        const remainingSubjects = Object.keys(testData).filter(sub => sub !== subjectName);
        if (remainingSubjects.length === 0) {
            setCurrentSelectedSubject('');
            setCurrentTimetableSubject('');
        }

        showNotification(`Subject "${subjectName}" deleted.`, 'success');
    } catch (error) {
        console.error("Error deleting subject:", error);
        showNotification(`Failed to delete subject "${subjectName}".`, 'error');
    }
};

/**
 * Deletes a specific test from a subject and removes it from Today's Focus.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {object} testData - Current test data for validation.
 * @param {function} setTodayFocusItems - State setter for todayFocusItems (to update UI).
 * @param {string} subjectName - The subject the test belongs to.
 * @param {string} testTitle - The title of the test to delete.
 * @returns {Promise<void>}
 */
export const deleteTest = async (userId, showNotification, testData, setTodayFocusItems, subjectName, testTitle) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    if (!testData.hasOwnProperty(subjectName) || !testData[subjectName].some(test => test.title === testTitle)) {
        showNotification(`Test "${testTitle}" not found in ${subjectName}.`, 'error'); return;
    }

    try {
        const subjectDocRef = doc(db, "artifacts", app_id, "users", userId, "subjects", subjectName);
        const subjectDoc = await getDoc(subjectDocRef);
        if (subjectDoc.exists()) {
            const currentTests = subjectDoc.data().tests || [];
            const updatedTests = currentTests.filter(test => test.title !== testTitle);
            await setDoc(subjectDocRef, { tests: updatedTests }, { merge: true });

            // Also remove from Today's Focus collection
            const todayFocusCollectionRef = collection(db, "artifacts", app_id, "users", userId, "todayFocus");
            const qFocus = query(todayFocusCollectionRef,
                where("subject", "==", subjectName),
                where("title", "==", testTitle)
            );
            const snapshotFocus = await getDocs(qFocus);
            const focusBatch = writeBatch(db);
            snapshotFocus.forEach((docSnap) => {
                focusBatch.delete(doc(todayFocusCollectionRef, docSnap.id));
            });
            await focusBatch.commit();

            setTodayFocusItems(prevItems => prevItems.filter(item => !(item.subject === subjectName && item.title === testTitle)));
            showNotification(`Test "${testTitle}" deleted from "${subjectName}".`, 'success');
        } else {
            showNotification('Subject document not found. This might be a sync issue. Please try refreshing.', 'error');
        }
    } catch (error) {
        console.error("Error deleting test:", error);
        showNotification(`Failed to delete test "${testTitle}".`, 'error');
    }
};

/**
 * Toggles the completion status of a test.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {string} subjectName - The subject the test belongs to.
 * @param {string} testTitle - The title of the test to update.
 * @param {boolean} completedStatus - The new completion status.
 * @returns {Promise<void>}
 */
export const handleToggleTestCompletion = async (userId, showNotification, subjectName, testTitle, completedStatus) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    try {
        const subjectDocRef = doc(db, "artifacts", app_id, "users", userId, "subjects", subjectName);
        const subjectDoc = await getDoc(subjectDocRef);

        if (subjectDoc.exists()) {
            const currentTests = subjectDoc.data().tests || [];
            const updatedTests = currentTests.map(test =>
                test.title === testTitle ? { ...test, completed: completedStatus } : test
            );
            await setDoc(subjectDocRef, { tests: updatedTests }, { merge: true });

            // Update completion status in Today's Focus if the item exists there
            const todayFocusCollectionRef = collection(db, "artifacts", app_id, "users", userId, "todayFocus");
            const q = query(todayFocusCollectionRef,
                where("subject", "==", subjectName),
                where("title", "==", testTitle)
            );
            const snapshot = await getDocs(q);
            const focusUpdateBatch = writeBatch(db);
            snapshot.forEach((docSnap) => {
                focusUpdateBatch.update(doc(todayFocusCollectionRef, docSnap.id), { completed: completedStatus });
            });
            await focusUpdateBatch.commit();

            showNotification(`Test "${testTitle}" marked as ${completedStatus ? 'completed' : 'incomplete'}.`, 'success');
        }
    } catch (error) {
        console.error("Error toggling test completion:", error);
        showNotification("Failed to update test completion status.", 'error');
    }
};

/**
 * Adds a test to Today's Focus.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {Array<object>} todayFocusItems - Current list of focus items for validation.
 * @param {object} testToAdd - The test object to add.
 * @param {string} subjectName - The subject the test belongs to.
 * @returns {Promise<void>}
 */
export const addFocusItem = async (userId, showNotification, todayFocusItems, testToAdd, subjectName) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    // Ensure `testToAdd.id` is available or create a unique ID if needed for client-side filtering.
    // The Firestore `addDoc` will generate a unique ID.
    const existingItem = todayFocusItems.find(item =>
        (item.subject === subjectName && item.title === testToAdd.title)
    );

    if (existingItem) {
        showNotification(`"${testToAdd.title}" is already in Today's Focus.`, 'info');
        return;
    }

    try {
        const iconPath = "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75";
        const focusItemData = {
            title: testToAdd.title,
            mcqs: testToAdd.mcqs,
            date: testToAdd.date,
            link: testToAdd.link || '',
            subject: subjectName,
            iconPath: testToAdd.iconPath || iconPath,
            completed: testToAdd.completed || false,
            order: todayFocusItems.length // Assign initial order based on current list length
        };

        const todayFocusCollectionRef = collection(db, "artifacts", app_id, "users", userId, "todayFocus");
        await addDoc(todayFocusCollectionRef, focusItemData); // Firestore generates ID automatically
        showNotification(`Added "${testToAdd.title}" to Today's Focus.`, 'success');
    } catch (error) {
        console.error("Error adding focus item:", error);
        showNotification(`Failed to add "${testToAdd.title}" to Today's Focus.`, 'error');
    }
};

/**
 * Removes a focus item from Today's Focus.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {string} itemId - The ID of the focus item document to remove.
 * @returns {Promise<void>}
 */
export const removeFocusItem = async (userId, showNotification, itemId) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    try {
        const todayFocusItemDocRef = doc(db, "artifacts", app_id, "users", userId, "todayFocus", itemId);
        await deleteDoc(todayFocusItemDocRef);
        showNotification('Focus item removed.', 'success');
    } catch (error) {
        console.error("Error removing focus item:", error);
        showNotification("Failed to remove focus item.", 'error');
    }
};

/**
 * Reorders focus items by updating their 'order' field in Firestore.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {Array<object>} newOrder - The new ordered array of focus items with their Firestore IDs.
 * @returns {Promise<void>}
 */
export const reorderFocusItems = async (userId, showNotification, newOrder) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    try {
        const batch = writeBatch(db);
        const todayFocusCollectionRef = collection(db, "artifacts", app_id, "users", userId, "todayFocus");

        newOrder.forEach((item, index) => {
            const docRef = doc(todayFocusCollectionRef, item.id);
            batch.update(docRef, { order: index });
        });

        await batch.commit();
        showNotification('Focus items reordered.', 'success');
    } catch (error) {
        console.error("Error reordering focus items:", error);
        showNotification("Failed to reorder focus items.", 'error');
    }
};

/**
 * Adds a new timetable entry.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {string} notificationPermission - Current notification permission status.
 * @param {string} subject - The subject of the event.
 * @param {string} topic - The topic of the event.
 * @param {string} date - The date of the event (YYYY-MM-DD).
 * @param {string} time - The time of the event (HH:MM).
 * @returns {Promise<void>}
 */
export const addTimetableEntry = async (userId, showNotification, notificationPermission, subject, topic, date, time) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    if (!subject || !topic || !date || !time) { showNotification('All fields for the timetable event are required.', 'error'); return; }
    try {
        const timetableCollectionRef = collection(db, "artifacts", app_id, "users", userId, "timetable");
        const newEntryRef = doc(timetableCollectionRef); // Firestore generates ID
        await setDoc(newEntryRef, { subject, topic, date, time, checked: false }); // Added checked: false
        showNotification('Study event added successfully!', 'success');

        if (notificationPermission === 'granted') {
            const eventDateTime = new Date(`${date}T${time}`);
            const now = new Date();
            const timeUntilEvent = eventDateTime.getTime() - now.getTime();
            const reminderTime = timeUntilEvent - (5 * 60 * 1000); // 5 minutes before

            if (reminderTime > 0) {
                setTimeout(() => {
                    new Notification('Upcoming Study Event', {
                        body: `${topic} for ${subject} is starting soon at ${time}!`,
                        icon: 'https://placehold.co/48x48/007bff/ffffff?text=🔔'
                    });
                }, reminderTime);
            } else {
                console.warn('Event is in the past or too soon for a reminder. No notification scheduled.');
            }
        } else {
            console.warn('Notification permission not granted. Cannot schedule local notification.');
        }
    } catch (error) {
        console.error("Error adding timetable entry:", error);
        showNotification("Failed to add study event.", 'error');
    }
};

/**
 * Deletes a timetable entry.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {string} idToDelete - The ID of the timetable entry document to delete.
 * @returns {Promise<void>}
 */
export const deleteTimetableEntry = async (userId, showNotification, idToDelete) => {
    if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
    try {
        const timetableEntryDocRef = doc(db, "artifacts", app_id, "users", userId, "timetable", idToDelete);
        await deleteDoc(timetableEntryDocRef);
        showNotification('Timetable entry deleted.', 'success');
    } catch (error) {
        console.error("Error deleting timetable entry:", error);
        showNotification("Failed to delete timetable entry.", 'error');
    }
};

/**
 * Handles user login.
 * This is a placeholder for actual authentication.
 * @param {function} showNotification - Function to display notifications.
 * @param {function} setIsLoggedIn - State setter for isLoggedIn.
 * @param {function} setUserId - State setter for userId.
 * @param {function} setUserName - State setter for userName.
 * @param {function} setUserEmail - State setter for userEmail.
 * @param {string} enteredUsername - The username entered by the user.
 * @param {string} enteredPassword - The password entered by the user.
 * @returns {void}
 */
export const handleLogin = (showNotification, setIsLoggedIn, setUserId, setUserName, setUserEmail, enteredUsername, enteredPassword) => {
    const correctUsername = "nikhil";
    const correctPassword = "password123";
    const fixedUserId = "nikhil_user_id";

    if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', fixedUserId);
        localStorage.setItem('userName', enteredUsername);
        localStorage.setItem('userEmail', 'nikhil@example.com');
        setUserId(fixedUserId);
        setUserName(enteredUsername);
        setUserEmail('nikhil@example.com');
        setIsLoggedIn(true);
        showNotification("Logged in successfully!", "success");
    } else {
        showNotification("Invalid username or password.", "error");
    }
};

/**
 * Handles user logout.
 * Uses Firebase signOut.
 * @param {function} showNotification - Function to display notifications.
 * @param {function} setIsLoggedIn - State setter for isLoggedIn.
 * @param {function} setUserId - State setter for userId.
 * @param {function} setUserName - State setter for userName.
 * @param {function} setUserEmail - State setter for userEmail.
 * @returns {Promise<void>}
 */
export const handleLogout = async (showNotification, setIsLoggedIn, setUserId, setUserName, setUserEmail) => {
    try {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentTimetableSubject');

        if (auth) {
            await firebaseSignOut(auth); // Use the aliased signOut from Firebase Auth
        }

        setUserId(null);
        setUserName(null);
        setUserEmail(null);
        setIsLoggedIn(false);
        showNotification("Logged out successfully.", "info");
    } catch (error) {
        console.error("Error during signOut or localStorage clear:", error);
        showNotification("Failed to log out.", 'error');
    }
};

/**
 * Resets all local application data (localStorage and forces a page reload).
 * @returns {void}
 */
export const handleResetLocalData = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('currentTimetableSubject');
    window.location.reload(); // Full reload to clear all states and re-initialize
};

/**
 * Utility function to display notifications.
 * @param {function} setNotification - State setter for notification.
 * @returns {function(string, string): void} - A function that takes message and type, and sets notification state.
 */
export const showNotification = (setNotification) => (message, type = 'info') => {
    setNotification({ message, type, visible: true });
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
};

/**
 * Fetches all user-specific data from Firestore and creates a downloadable JSON file.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {string} userName - The current user's name for file naming.
 * @returns {Promise<void>}
 */
export const exportUserData = async (userId, showNotification, userName) => {
    if (!userId) {
        showNotification('Authentication not ready. Please log in.', 'error');
        return;
    }

    try {
        const userData = {};

        // 1. Fetch Subjects and Tests
        const subjectsCollectionRef = collection(db, "artifacts", app_id, "users", userId, "subjects");
        const subjectsSnapshot = await getDocs(subjectsCollectionRef);
        const subjectsData = {};
        for (const docSnap of subjectsSnapshot.docs) {
            subjectsData[docSnap.id] = docSnap.data().tests || [];
        }
        userData.subjects = subjectsData;

        // 2. Fetch Today's Focus Items
        const todayFocusCollectionRef = collection(db, "artifacts", app_id, "users", userId, "todayFocus");
        const focusSnapshot = await getDocs(todayFocusCollectionRef);
        userData.todayFocus = focusSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Fetch Timetable Entries
        const timetableCollectionRef = collection(db, "artifacts", app_id, "users", userId, "timetable");
        const timetableSnapshot = await getDocs(timetableCollectionRef);
        userData.timetable = timetableSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Convert to JSON string
        const jsonString = JSON.stringify(userData, null, 2);

        // Create a Blob and trigger download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userName || 'user'}_data_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('User data exported successfully!', 'success');
    } catch (error) {
        console.error("Error exporting data:", error);
        showNotification('Failed to export data.', 'error');
    }
};

/**
 * Imports user data from a JSON file and overwrites/updates Firestore.
 * @param {string} userId - The current user's ID.
 * @param {function} showNotification - Function to display notifications.
 * @param {object} importData - The parsed JSON data to import.
 * @returns {Promise<void>}
 */
export const importUserData = async (userId, showNotification, importData) => {
    if (!userId) {
        showNotification('Authentication not ready. Please log in.', 'error');
        return;
    }

    try {
        const batch = writeBatch(db);

        // --- Handle Subjects and Tests ---
        const subjectsCollectionRef = collection(db, "artifacts", app_id, "users", userId, "subjects");
        // Delete all existing subjects first to ensure a clean overwrite
        const existingSubjectsSnapshot = await getDocs(subjectsCollectionRef);
        existingSubjectsSnapshot.forEach((docSnap) => {
            batch.delete(doc(subjectsCollectionRef, docSnap.id));
        });

        if (importData.subjects && typeof importData.subjects === 'object') {
            for (const subjectName in importData.subjects) {
                if (Object.hasOwnProperty.call(importData.subjects, subjectName)) {
                    const tests = importData.subjects[subjectName];
                    if (Array.isArray(tests)) {
                        const subjectDocRef = doc(subjectsCollectionRef, subjectName);
                        batch.set(subjectDocRef, { tests: tests });
                    }
                }
            }
        }

        // --- Handle Today's Focus Items ---
        const todayFocusCollectionRef = collection(db, "artifacts", app_id, "users", userId, "todayFocus");
        // Delete all existing focus items
        const existingFocusSnapshot = await getDocs(todayFocusCollectionRef);
        existingFocusSnapshot.forEach((docSnap) => {
            batch.delete(doc(todayFocusCollectionRef, docSnap.id));
        });

        if (importData.todayFocus && Array.isArray(importData.todayFocus)) {
            importData.todayFocus.forEach(item => {
                // Ensure unique IDs for new docs, if original IDs are not preserved
                const newDocRef = doc(todayFocusCollectionRef);
                batch.set(newDocRef, {
                    title: item.title,
                    mcqs: item.mcqs,
                    date: item.date,
                    link: item.link || '',
                    subject: item.subject,
                    iconPath: item.iconPath || "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", // Default if missing
                    completed: item.completed || false,
                    order: item.order || 0
                });
            });
        }

        // --- Handle Timetable Entries ---
        const timetableCollectionRef = collection(db, "artifacts", app_id, "users", userId, "timetable");
        // Delete all existing timetable entries
        const existingTimetableSnapshot = await getDocs(timetableCollectionRef);
        existingTimetableSnapshot.forEach((docSnap) => {
            batch.delete(doc(timetableCollectionRef, docSnap.id));
        });

        if (importData.timetable && Array.isArray(importData.timetable)) {
            importData.timetable.forEach(entry => {
                const newDocRef = doc(timetableCollectionRef);
                batch.set(newDocRef, {
                    subject: entry.subject,
                    topic: entry.topic,
                    date: entry.date,
                    time: entry.time,
                    checked: entry.checked || false // Default if missing
                });
            });
        }

        await batch.commit();
        showNotification('Data imported successfully! Your app will now reload to reflect changes.', 'success');
        // Force a reload to ensure all states dependent on fetched data are re-initialized
        window.location.reload();
    } catch (error) {
        console.error("Error importing data:", error);
        showNotification('Failed to import data. Please check the file and try again.', 'error');
    }
};