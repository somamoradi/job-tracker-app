# Job Application Tracker 📋

A **mobile-first, privacy-focused** web application for tracking job applications with comprehensive management and reporting capabilities. Built with vanilla HTML/CSS/JavaScript, it works completely offline and stores all data locally on your device.

![Job Tracker App](assets/images/job-tracker.png)

## ✨ Features

### 🎯 **Job Management**
- **Add Jobs**: Create new job applications with detailed information
- **Edit Jobs**: Update existing job records with new information  
- **Delete Jobs**: Remove job applications with confirmation
- **Archive Jobs**: Move completed applications to archive
- **Search & Filter**: Find jobs by company name, position, or location
- **Multiple Views**: List, Grid, and Card view modes

### 📊 **Reports & Analytics**
- **Status Filtering**: Filter jobs by application status
- **Time-based Filtering**: View jobs by date ranges (Today, Week, Month, Quarter, Year)
- **Statistics Dashboard**: 
  - Total jobs tracked
  - Number of applications submitted
  - Interview count and success rate
  - Salary statistics
- **Visual Charts**: Bar chart showing job distribution by status

### 📱 **Mobile-First Design**
- **Responsive Layout**: Optimized for mobile devices and desktop
- **Touch-Friendly**: Large buttons and intuitive navigation
- **PWA Ready**: Can be installed as a mobile app
- **Offline Capable**: Works without internet connection
- **Dark/Light Themes**: Multiple theme options

### 🌍 **Internationalization**
- **Multi-language Support**: English, Spanish, French, German, Italian, Portuguese, Arabic, Chinese, Japanese, Korean, Persian, Kurdish
- **RTL Support**: Right-to-left language support for Arabic and Persian
- **Localized UI**: All interface elements translated

### 💾 **Data Management**
- **Local Storage**: All data stored locally on your device
- **No Account Required**: Privacy-focused, no registration needed
- **Data Persistence**: Information saved automatically
- **Export/Import**: Backup and restore your data
- **Privacy First**: No cloud storage, no tracking

## 🚀 Quick Start

### **Option 1: GitHub Pages (Recommended)**
1. Visit the live demo: [Your GitHub Pages URL]
2. Start adding your job applications immediately
3. Add to home screen for app-like experience

### **Option 2: Local Development**
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/job-tracker-app.git
   cd job-tracker-app
   ```
2. Open `index.html` in your web browser
3. Start tracking your job applications!

### **Option 3: Mobile Setup**
1. Open the app in your mobile browser
2. Tap the share button (📤)
3. Select "Add to Home Screen"
4. Access your job tracker anytime, anywhere

## 📋 Job Information Tracked

| Field | Description | Required |
|-------|-------------|----------|
| **Company Name** | Name of the company | ✅ Yes |
| **Position Title** | Job title/role | ✅ Yes |
| **Application Date** | When you applied | ✅ Yes |
| **Status** | Current application status | ✅ Yes |
| **Salary** | Salary range or amount | ❌ No |
| **Location** | Job location (city, remote, etc.) | ❌ No |
| **Contact Person** | Hiring manager or recruiter | ❌ No |
| **Job URL** | Link to job posting | ❌ No |
| **Notes** | Additional information | ❌ No |

### **Application Statuses**
- 🆕 **To Apply** - Job saved for future application
- 📝 **Applied** - Application submitted
- 📅 **Interview Scheduled** - Interview arranged
- 🎯 **Interview Completed** - Interview finished
- ✅ **Accepted** - Job offer received
- ❌ **Rejected** - Application rejected

## 🎮 Usage Guide

### **Adding a Job**
1. Click the "Add Job" button (+)
2. Fill in the required fields (Company Name, Position Title, Application Date)
3. Select the appropriate status
4. Add additional information as needed
5. Click "Save Job"

### **Managing Jobs**
- **Edit**: Click the "Edit" button (✏️) on any job card
- **Delete**: Click the "Delete" button (🗑️) and confirm
- **Archive**: Move completed applications to archive
- **Search**: Use the search bar to find specific jobs
- **Sort**: Use the dropdown to sort by different criteria

### **Viewing Reports**
1. Click the "Reports" tab (📊)
2. Use filters to narrow down your data:
   - **Status filter**: View jobs by specific status
   - **Date filter**: View jobs from specific time periods
3. Review statistics and visual charts

### **Customizing the App**
1. Click the "Settings" tab (⚙️)
2. Choose your preferred:
   - **Language**: Select from 12 supported languages
   - **Theme**: Light, Dark, or custom color themes
   - **Data Management**: Export/Import your data

## 🛠️ Technical Details

### **Technology Stack**
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: LocalStorage API
- **Charts**: Canvas API for data visualization
- **PWA**: Web App Manifest for mobile installation
- **Styling**: Custom CSS with responsive design
- **Icons**: SVG icons for crisp display

### **Browser Compatibility**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **Performance Features**
- **Offline First**: Works without internet connection
- **Fast Loading**: Optimized assets and minimal dependencies
- **Responsive**: Adapts to any screen size
- **Accessible**: Keyboard navigation and screen reader support

## 🔒 Privacy & Security

### **Data Protection**
- **No Cloud Storage**: All data stays on your device
- **No Tracking**: No analytics or user tracking
- **No Registration**: No personal information required
- **Local Only**: Works completely offline
- **Privacy First**: Your data never leaves your device

### **Data Backup**
To backup your data:
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Find localStorage
4. Copy the `jobTracker_jobs` value
5. Save it as a text file

## 🌟 Key Benefits

### **For Job Seekers**
- 📱 **Mobile-First**: Perfect for tracking applications on the go
- 🔒 **Privacy-Focused**: Your data stays private and local
- 📊 **Comprehensive Tracking**: All job details in one place
- 🎯 **Stay Organized**: Never lose track of applications
- 📈 **Track Progress**: Visual reports and statistics

### **For Developers**
- 🚀 **No Build Process**: Pure HTML/CSS/JS
- 📦 **Self-Contained**: No external dependencies
- 🔧 **Easy to Customize**: Well-documented code
- 📱 **PWA Ready**: Progressive Web App features
- 🌍 **International**: Multi-language support

## 🔮 Future Enhancements

### **Planned Features**
- [ ] Email reminders for follow-ups
- [ ] Integration with job boards
- [ ] Advanced analytics and insights
- [ ] Multiple user support
- [ ] Cloud synchronization (optional)
- [ ] Resume/CV integration
- [ ] Interview preparation tools
- [ ] Salary negotiation tracker

### **Community Requests**
- [ ] Calendar integration
- [ ] Email templates
- [ ] Networking contact tracker
- [ ] Skill assessment tools
- [ ] Job market insights

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

### **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### **What We Welcome**
- 🐛 Bug reports and fixes
- 💡 Feature suggestions
- 🌍 Translation improvements
- 🎨 UI/UX enhancements
- 📚 Documentation updates

## 📄 License

This project is proprietary software. All rights reserved.

### **Copyright Notice**

Copyright (c) 2025 Soma Moradi. All rights reserved.

**Developer:** Soma Moradi  
**Project:** Job Application Tracker  
**Version:** 1.0.0  
**Created:** 2025

### **Terms of Use**

**✅ Permitted Uses:**
- Personal use of the application
- Suggestions for improvements or bug reports
- Feedback and feature requests

**❌ Prohibited Uses:**
- Commercial use of any kind
- Selling or redistributing the software
- Using the software for commercial purposes
- Modifying and redistributing the code
- Creating derivative works for commercial purposes

### **Commercial Restrictions**

This software is provided for personal use only. Commercial use, including but not limited to:
- Selling the software
- Using it in commercial applications
- Incorporating it into commercial products
- Using it for business purposes

is strictly prohibited without explicit written permission from the copyright holder.

---

## 📞 Support

If you have questions, suggestions, or need help:
- 📧 **Email**: moradi68soma@gmail.com

---

**Built with ❤️ for job seekers everywhere**

*"The best way to predict the future is to create it." - Peter Drucker* 