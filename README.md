# Study Management System

A comprehensive React application for managing study activities, schedules, tests, and content with a beautiful, responsive interface.

## 🚀 Features

### 📊 Dashboard
- **Statistics Overview**: Visual charts showing study progress, test scores, and activity metrics
- **Recent Activity Feed**: Track recent study sessions, test completions, and content updates
- **Upcoming Events**: Quick view of upcoming study sessions and deadlines
- **Progress Tracking**: Visual progress bars and completion rates

### 📅 Timetable Management
- **Interactive Schedule**: View and manage your study timetable
- **Event Management**: Add, edit, and delete study events with custom button colors
- **Status Tracking**: Real-time event status (Live, Pending, Completed, Missed)
- **Search & Filter**: Search events by subject, topic, or time
- **Date Navigation**: Navigate between different dates and weeks

### 📝 Test Tracking
- **Test Results**: Comprehensive tracking of test scores and performance
- **Statistics**: Average scores, pass rates, and improvement trends
- **Search & Filter**: Filter tests by subject, grade, or date range
- **Detailed Reviews**: View question breakdowns and performance analysis
- **Add New Tests**: Easy form for adding test results with validation

### 📚 Content Management
- **Study Materials**: Organize notes, textbooks, videos, and other resources
- **Categories**: Filter content by type (Notes, Textbooks, Videos, etc.)
- **Search Functionality**: Quick search across all content
- **Study Status**: Track reading progress and completion status
- **Grid/List Views**: Toggle between different viewing modes

### 🎨 UI/UX Features
- **Responsive Design**: Works perfectly on all devices
- **Beautiful Animations**: Smooth transitions with Framer Motion
- **Modern Interface**: Clean, intuitive design
- **Admin Mode**: Toggle between admin and user modes
- **Custom Button Colors**: Status-matched button colors for better UX
- **Navigation System**: Responsive sidebar with mobile support

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **React Icons**: Comprehensive icon library
- **Context API**: State management for admin and handlers
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

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

## 📁 Project Structure

```
src/
├── components/
│   ├── Navigation.js            # Responsive navigation sidebar
│   ├── StatsCard.js            # Statistics display cards
│   ├── RecentActivity.js       # Activity feed component
│   ├── UpcomingEvents.js       # Upcoming events display
│   ├── ProgressChart.js        # SVG progress visualization
│   ├── TimetableEventCard.js   # Individual event card (custom buttons)
│   ├── EditTimetableModal.js   # Modal for editing events
│   ├── AddModal.js             # Modal for adding new events
│   ├── TestResultCard.js       # Individual test result cards
│   ├── TestDetailsModal.js     # Detailed test review modal
│   ├── AddTestModal.js         # Add new test results modal
│   ├── ContentCard.js          # Content display cards
│   ├── AddContentModal.js      # Add new content modal
│   └── EditContentModal.js     # Edit existing content modal
├── pages/
│   ├── Dashboard.js            # Main dashboard with stats and overview
│   ├── TimetablePage.js        # Study schedule management
│   ├── TestCompleted.js        # Test results tracking
│   └── ManageContent.js        # Study materials organization
├── context/
│   ├── HandlerContext.js       # Context for event handlers
│   └── AdminContext.js         # Context for admin functionality
├── App.js                      # Main app with routing and navigation
├── index.js                    # App entry point
├── App.css                     # App-specific styles
└── index.css                   # Global styles with Tailwind
```

## 🎯 Key Components

### Dashboard
- **StatsCard**: Animated statistics display with icons and trends
- **RecentActivity**: Real-time activity feed with timestamps
- **UpcomingEvents**: Next scheduled events and deadlines
- **ProgressChart**: SVG-based progress visualization

### Timetable System
- **TimetableEventCard**: Event cards with custom status-matched button colors
- **EditTimetableModal**: Full-featured event editing
- **AddModal**: Add new study sessions with validation

### Test Tracking
- **TestResultCard**: Individual test results with scores and grades
- **TestDetailsModal**: Detailed test review with question breakdown
- **AddTestModal**: Add test results with comprehensive validation

### Content Management
- **ContentCard**: Study material cards with type icons and tags
- **AddContentModal/EditContentModal**: Content CRUD operations
- **Search and Filter**: Advanced content discovery

### Navigation
- **Navigation**: Responsive sidebar with mobile hamburger menu
- **Page Routing**: Smooth navigation between all sections

## 🎨 Custom Features

### Button Color System
The edit and delete buttons in TimetableEventCard have custom colors that match card status:
- **Completed events**: `bg-green-200 hover:bg-green-300` (card: `bg-green-100`)
- **Missed events**: `bg-red-200 hover:bg-red-300` (card: `bg-red-100`)
- **Normal events**: `bg-gray-100 hover:bg-gray-200` (card: `bg-gray-50`)

### Status-Based Styling
- **Live**: Yellow/orange indicators for active sessions
- **Pending**: Blue indicators for upcoming events
- **Completed**: Green indicators for finished tasks
- **Missed**: Red indicators for missed sessions

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Tablet**: Adapted layouts for medium screens
- **Desktop**: Full-featured experience on large screens

## 📊 Sample Data

The application includes comprehensive sample data for demonstration:
- **Timetable Entries**: Various study sessions with different statuses
- **Test Results**: Sample test scores across different subjects
- **Content Items**: Study materials of different types
- **Activity Feed**: Recent user interactions and updates

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js` with:
- Extended color palette
- Custom animations
- Responsive breakpoints

### Package Dependencies
Key packages in `package.json`:
- React and React-DOM
- Tailwind CSS
- Framer Motion
- React Icons
- Development tools

## 📈 Future Enhancements

- **Backend Integration**: Connect to API for data persistence
- **User Authentication**: Login and user management
- **Calendar Integration**: Sync with external calendars
- **Notifications**: Push notifications for upcoming events
- **Advanced Analytics**: More detailed progress tracking
- **Export Features**: Export data to PDF/Excel
- **Collaboration**: Share schedules and study materials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is for educational purposes and study management.

## 🆘 Support

For questions or issues:
1. Check the project structure and component documentation
2. Review the sample data implementation
3. Examine the context providers for state management
4. Look at the responsive design patterns used throughout

---

**Note**: This is a comprehensive study management system with dashboard, timetable, test tracking, and content management features. The custom button colors in the timetable component maintain visual harmony while providing distinct, clickable interactions.