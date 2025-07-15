# Timetable App

A modern React application for managing study timetables with a beautiful, responsive interface.

## Features

- **Interactive Timetable**: View and manage your study schedule
- **Event Management**: Add, edit, and delete study events
- **Status Tracking**: Real-time event status (Live, Pending, Completed, Missed)
- **Search & Filter**: Search events by subject, topic, or time
- **Responsive Design**: Works perfectly on all devices
- **Beautiful UI**: Modern interface with smooth animations
- **Admin Mode**: Toggle between admin and user modes

## Button Customization

The edit and delete buttons in the TimetableEventCard component now have custom background colors that match the card status:

- **Completed events**: Green background colors
- **Missed events**: Red background colors  
- **Normal events**: Gray background colors

The buttons are distinct from the card background while maintaining visual harmony.

## Technologies Used

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Beautiful icon library
- **Context API**: State management

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or extract the files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── TimetableEventCard.js    # Individual event card component
│   ├── EditTimetableModal.js    # Modal for editing events
│   └── AddModal.js              # Modal for adding new events
├── pages/
│   └── TimetablePage.js         # Main timetable page
├── context/
│   ├── HandlerContext.js        # Context for event handlers
│   └── AdminContext.js          # Context for admin functionality
├── App.js                       # Main app component
├── index.js                     # App entry point
├── App.css                      # App-specific styles
└── index.css                    # Global styles with Tailwind
```

## Key Components

### TimetableEventCard
- Displays individual study events
- Shows event status with color-coded backgrounds
- Includes edit/delete buttons in admin mode
- Responsive design with smooth animations

### TimetablePage
- Main page component
- Handles event filtering and searching
- Manages edit/add modals
- Provides date navigation

### Context Providers
- **HandlerContext**: Provides event management functions
- **AdminContext**: Manages admin mode state

## Customization

### Button Colors
The edit and delete button colors can be customized in `src/components/TimetableEventCard.js`:
- Look for the `className` props in the motion.button components
- Modify the Tailwind classes for different background colors

### Event Status Colors
Event status indicators can be customized in the `getEventStatus` function in `TimetableEventCard.js`.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (one-way operation)

## Sample Data

The app includes sample timetable entries for demonstration purposes. In a real application, this would be connected to a backend API.

## License

This project is for educational purposes.