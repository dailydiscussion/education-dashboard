# Edudash - Education Dashboard

A comprehensive React-based education dashboard application designed to help students manage their study schedules, track academic progress, and maintain focus on daily tasks. Built with modern web technologies and Firebase backend.

## 🚀 Features

- **📊 Dashboard**: Visual overview of academic progress and daily focus items
- **📅 Timetable Management**: Create and manage study schedules with drag-and-drop functionality
- **📝 Test Tracking**: Monitor test completion and performance across subjects
- **🎯 Focus Management**: Daily task prioritization and completion tracking
- **👤 User Authentication**: Secure login with Firebase Auth
- **📱 Progressive Web App**: Works offline and installable on mobile devices
- **🔔 Real-time Notifications**: Instant feedback for user actions
- **📈 Progress Visualization**: Circular progress bars and statistics cards

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with Hooks and Context API
- **Styling**: Tailwind CSS with custom components
- **Backend**: Firebase (Firestore, Authentication)
- **Build Tool**: CRACO (Create React App Configuration Override)
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **PWA**: Workbox service worker
- **Testing**: React Testing Library & Jest

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Edudash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Copy your Firebase config to `src/firebaseConfig.js`

4. **Start development server**
   ```bash
   npm start
   ```

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Builds the app for production in the `build` folder |
| `npm test` | Launches the test runner in interactive watch mode |
| `npm run deploy` | Deploys the app to GitHub Pages |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run lint:fix` | Automatically fixes ESLint issues |
| `npm run format` | Formats code using Prettier |

## 📁 Project Structure

```
Edudash/
├── public/                 # Static assets and PWA files
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/           # React Context providers
│   ├── pages/             # Main application pages
│   ├── utils/             # Utility functions and helpers
│   ├── assets/            # Images, icons, and static files
│   ├── styles/            # CSS and Tailwind configuration
│   ├── App.js             # Main application component
│   ├── index.js           # Application entry point
│   └── firebaseConfig.js  # Firebase configuration
├── craco.config.js        # CRACO configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Firebase Setup
The app requires Firebase configuration for:
- **Firestore Database**: Stores user data, subjects, tests, and timetable entries
- **Authentication**: Handles user login and session management

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

The project uses:
- **React Testing Library** for component testing
- **Jest** as the test runner
- **User Event** for simulating user interactions

## 📱 Progressive Web App

This app is configured as a PWA with:
- Service worker for offline functionality
- Web app manifest for installation
- Responsive design for mobile devices

### 🔍 Indexing

The application implements several indexing strategies to ensure optimal performance and searchability:

1. **Firestore Indexing**
   - Automatic indexing of frequently queried fields
   - Composite indexes for complex queries
   - Optimized for common access patterns (e.g., fetching user's daily schedule, subject lists)

2. **Local Storage Indexing**
   - Critical user data is indexed in IndexedDB for offline access
   - Efficient querying of local data using Dexie.js
   - Automatic synchronization with remote database when online

### 📴 Offline Functionality

The application provides a seamless offline experience with:

1. **Data Persistence**
   - Automatic caching of essential data in IndexedDB
   - Background sync for pending operations
   - Conflict resolution for offline edits

2. **Offline Capabilities**
   - View and edit your schedule without internet connection
   - Track study progress and mark tasks as complete
   - All changes sync automatically when back online

3. **Service Worker**
   - Precaches critical assets for offline use
   - Implements stale-while-revalidate strategy for API calls
   - Handles push notifications for important updates

4. **Storage Management**
   - Automatic cleanup of old data
   - Configurable storage limits
   - User preferences for data retention

## 🚀 Deployment

### GitHub Pages
The app is configured for deployment to GitHub Pages:
```bash
npm run deploy
```

### Other Platforms
Build the app for production:
```bash
npm run build
```

The `build` folder contains the optimized production files ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [Issues](../../issues) page
- Review the component documentation in `src/components/README.md`
- Examine the codebase summary in `codebase summary.txt`

## 🔄 Version History

- **v0.1.0**: Initial release with core dashboard functionality
- Features: User authentication, timetable management, test tracking, focus items

---

Built with ❤️ using React and Firebase
