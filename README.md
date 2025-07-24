# Job Application Tracker

A mobile-friendly web application for tracking job applications with comprehensive management and reporting capabilities.

## Features

### 🎯 Job Management
- **Add Jobs**: Create new job applications with detailed information
- **Edit Jobs**: Update existing job records with new information
- **Delete Jobs**: Remove job applications with confirmation
- **Search**: Find jobs by company name, position, or location

### 📊 Reports & Analytics
- **Status Filtering**: Filter jobs by application status
- **Time-based Filtering**: View jobs by date ranges (Today, Week, Month, Quarter, Year)
- **Statistics Dashboard**: 
  - Total jobs tracked
  - Number of applications submitted
  - Interview count
  - Success rate calculation
- **Visual Charts**: Bar chart showing job distribution by status

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices and desktop
- **Touch-Friendly**: Large buttons and intuitive navigation
- **PWA Ready**: Can be installed as a mobile app
- **Offline Capable**: Works without internet connection

### 💾 Data Storage
- **Local Storage**: All data stored locally on your device
- **No Account Required**: Privacy-focused, no registration needed
- **Data Persistence**: Information saved automatically

## Job Information Tracked

- Company name
- Position title
- Application date
- Job status (To Apply, Applied, Interview Scheduled, Interview Completed, Rejected, Accepted)
- Salary information
- Location
- Contact person
- Job URL
- Notes and additional information

## Getting Started

### Quick Start
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start adding your job applications!

### For Mobile Use
1. Open the app in your mobile browser
2. Add to home screen for app-like experience
3. Access your job tracker anytime, anywhere

## Usage Guide

### Adding a Job
1. Click the "Add Job" button
2. Fill in the job details (company name and position are required)
3. Select the appropriate status
4. Add additional information as needed
5. Click "Save Job"

### Managing Jobs
- **Edit**: Click the "Edit" button on any job card
- **Delete**: Click the "Delete" button and confirm
- **Search**: Use the search bar to find specific jobs

### Viewing Reports
1. Click the "Reports" tab
2. Use filters to narrow down your data:
   - Status filter: View jobs by specific status
   - Date filter: View jobs from specific time periods
3. Review statistics and charts

## Technical Details

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: LocalStorage API
- **Charts**: Canvas API for data visualization
- **PWA**: Web App Manifest for mobile installation

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### Data Export
Currently, data is stored locally in your browser's localStorage. To backup your data:
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Find localStorage
4. Copy the `jobTracker_jobs` value

## Privacy & Security

- **No Cloud Storage**: All data stays on your device
- **No Tracking**: No analytics or user tracking
- **No Registration**: No personal information required
- **Local Only**: Works completely offline

## Future Enhancements

Potential features for future versions:
- Data export/import functionality
- Email reminders for follow-ups
- Integration with job boards
- Advanced analytics and insights
- Multiple user support
- Cloud synchronization (optional)

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

This project is open source and available under the MIT License.

---

**Built with ❤️ for job seekers everywhere** 
