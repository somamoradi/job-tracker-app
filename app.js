// Job Application Tracker - Main Application
class JobTracker {
    constructor() {
        this.jobs = [];
        this.archivedJobs = [];
        this.currentJobId = null;
        this.settings = this.loadSettings();
        this.translations = this.getTranslations();
        this.currentLanguage = this.settings.language || 'en';
        this.currentTheme = this.settings.theme || 'blue';
        this.currentView = this.settings.view || 'list';
        this.currentSort = this.settings.sort || 'date-applied-desc';
        this.interviewCounter = 1;
        this.init();
    }

    init() {
        this.loadJobs();
        this.loadArchivedJobs();
        this.setupEventListeners();
        this.applyTheme();
        this.applyViewStyle();
        this.applySort();
        this.translateUI();
        this.renderJobs();
        this.renderArchivedJobs();
        this.updateReports();
    }

    // Settings Management
    loadSettings() {
        const stored = localStorage.getItem('jobTracker_settings');
        return stored ? JSON.parse(stored) : {
            language: 'en',
            theme: 'blue',
            view: 'list',
            sort: 'date-applied-desc'
        };
    }

    saveSettings() {
        localStorage.setItem('jobTracker_settings', JSON.stringify(this.settings));
    }

    // Local Storage Management
    loadJobs() {
        const stored = localStorage.getItem('jobTracker_jobs');
        this.jobs = stored ? JSON.parse(stored) : [];
    }

    saveJobs() {
        localStorage.setItem('jobTracker_jobs', JSON.stringify(this.jobs));
    }

    loadArchivedJobs() {
        const stored = localStorage.getItem('jobTracker_archived_jobs');
        this.archivedJobs = stored ? JSON.parse(stored) : [];
    }

    saveArchivedJobs() {
        localStorage.setItem('jobTracker_archived_jobs', JSON.stringify(this.archivedJobs));
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Tab Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.closest('.nav-tab').dataset.tab));
        });

        // Add Job Button
        document.getElementById('add-job-btn').addEventListener('click', () => this.openJobModal());

        // Search
        document.getElementById('search-jobs').addEventListener('input', (e) => this.filterJobs(e.target.value));
        document.getElementById('search-archive').addEventListener('input', (e) => this.filterArchivedJobs(e.target.value));

        // Sort
        document.getElementById('sort-jobs').addEventListener('change', (e) => this.changeSort(e.target.value));
        document.getElementById('sort-archive').addEventListener('change', (e) => this.changeArchiveSort(e.target.value));

        // View Toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeView(e.target.closest('.view-btn').dataset.view));
        });

        // Job Modal
        document.getElementById('job-form').addEventListener('submit', (e) => this.saveJob(e));
        document.getElementById('close-modal').addEventListener('click', () => this.closeJobModal());
        document.getElementById('cancel-btn').addEventListener('click', () => this.closeJobModal());

        // Interview Results
        document.getElementById('add-interview-btn').addEventListener('click', () => this.addInterviewField());

        // Contract Type Change
        document.getElementById('contract-type').addEventListener('change', (e) => this.handleContractTypeChange(e.target.value));

        // Delete Modal
        document.getElementById('close-delete-modal').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('cancel-delete').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirm-delete').addEventListener('click', () => this.deleteJob());

        // Clear Data Modal
        document.getElementById('close-clear-modal').addEventListener('click', () => this.closeClearModal());
        document.getElementById('cancel-clear').addEventListener('click', () => this.closeClearModal());
        document.getElementById('confirm-clear').addEventListener('click', () => this.clearAllData());

        // Report Filters
        document.getElementById('status-filter').addEventListener('change', () => this.updateReports());
        document.getElementById('contract-filter').addEventListener('change', () => this.updateReports());
        document.getElementById('date-filter').addEventListener('change', () => this.updateReports());

        // Settings
        document.getElementById('language-select').addEventListener('change', (e) => this.changeLanguage(e.target.value));
        document.getElementById('theme-select').addEventListener('change', (e) => this.changeTheme(e.target.value));
        document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
        document.getElementById('import-data-btn').addEventListener('click', () => this.importData());
        document.getElementById('clear-data-btn').addEventListener('click', () => this.openClearModal());
        document.getElementById('import-file-input').addEventListener('change', (e) => this.handleFileImport(e));

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeJobModal();
                this.closeDeleteModal();
                this.closeClearModal();
            }
        });
    }

    // Tab Management
    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        if (tabName === 'reports') {
            this.updateReports();
        } else if (tabName === 'archive') {
            this.renderArchivedJobs();
        }
    }

    // Archive Management
    archiveJob(jobId) {
        const jobIndex = this.jobs.findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
            const job = this.jobs[jobIndex];
            job.archivedAt = new Date().toISOString();
            this.archivedJobs.push(job);
            this.jobs.splice(jobIndex, 1);
            
            this.saveJobs();
            this.saveArchivedJobs();
            this.renderJobs();
            this.renderArchivedJobs();
            this.updateReports();
            
            this.showNotification(this.translations[this.currentLanguage]?.job_archived || 'Job archived successfully!');
        }
    }

    unarchiveJob(jobId) {
        const jobIndex = this.archivedJobs.findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
            const job = this.archivedJobs[jobIndex];
            delete job.archivedAt;
            this.jobs.push(job);
            this.archivedJobs.splice(jobIndex, 1);
            
            this.saveJobs();
            this.saveArchivedJobs();
            this.renderJobs();
            this.renderArchivedJobs();
            this.updateReports();
            
            this.showNotification(this.translations[this.currentLanguage]?.job_unarchived || 'Job unarchived successfully!');
        }
    }

    // Sort Management
    changeSort(sortOption) {
        this.currentSort = sortOption;
        this.settings.sort = sortOption;
        this.saveSettings();
        this.applySort();
        this.renderJobs();
    }

    changeArchiveSort(sortOption) {
        this.settings.archiveSort = sortOption;
        this.saveSettings();
        this.renderArchivedJobs();
    }

    applySort() {
        document.getElementById('sort-jobs').value = this.currentSort;
        if (this.settings.archiveSort) {
            document.getElementById('sort-archive').value = this.settings.archiveSort;
        }
    }

    sortJobs(jobs) {
        const sortedJobs = [...jobs];
        const sortOption = jobs === this.archivedJobs ? this.settings.archiveSort : this.currentSort;
        
        switch (sortOption) {
            case 'date-applied-desc':
                return sortedJobs.sort((a, b) => {
                    const dateA = new Date(a.applicationDate || a.createdAt);
                    const dateB = new Date(b.applicationDate || b.createdAt);
                    return dateB - dateA;
                });
            
            case 'date-applied-asc':
                return sortedJobs.sort((a, b) => {
                    const dateA = new Date(a.applicationDate || a.createdAt);
                    const dateB = new Date(b.applicationDate || b.createdAt);
                    return dateA - dateB;
                });
            
            case 'start-date-desc':
                return sortedJobs.sort((a, b) => {
                    const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
                    const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
                    return dateB - dateA;
                });
            
            case 'start-date-asc':
                return sortedJobs.sort((a, b) => {
                    const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
                    const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
                    return dateA - dateB;
                });
            
            case 'salary-desc':
                return sortedJobs.sort((a, b) => {
                    const salaryA = this.getSalaryValue(a.salaryAmount, a.salaryPeriod);
                    const salaryB = this.getSalaryValue(b.salaryAmount, b.salaryPeriod);
                    return salaryB - salaryA;
                });
            
            case 'salary-asc':
                return sortedJobs.sort((a, b) => {
                    const salaryA = this.getSalaryValue(a.salaryAmount, a.salaryPeriod);
                    const salaryB = this.getSalaryValue(b.salaryAmount, b.salaryPeriod);
                    return salaryA - salaryB;
                });
            
            case 'status':
                return sortedJobs.sort((a, b) => {
                    const statusOrder = ['to-apply', 'applied', 'interview-scheduled', 'interview-completed', 'rejected', 'accepted'];
                    const indexA = statusOrder.indexOf(a.status);
                    const indexB = statusOrder.indexOf(b.status);
                    return indexA - indexB;
                });
            
            case 'company':
                return sortedJobs.sort((a, b) => {
                    const companyA = (a.companyName || '').toLowerCase();
                    const companyB = (b.companyName || '').toLowerCase();
                    return companyA.localeCompare(companyB);
                });
            
            case 'position':
                return sortedJobs.sort((a, b) => {
                    const positionA = (a.positionTitle || '').toLowerCase();
                    const positionB = (b.positionTitle || '').toLowerCase();
                    return positionA.localeCompare(positionB);
                });
            
            default:
                return sortedJobs;
        }
    }

    getSalaryValue(amount, period) {
        if (!amount || !period) return 0;
        
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return 0;
        
        // Convert all salaries to yearly equivalent for comparison
        switch (period) {
            case 'hour':
                return numAmount * 40 * 52; // 40 hours/week * 52 weeks
            case 'day':
                return numAmount * 5 * 52; // 5 days/week * 52 weeks
            case 'month':
                return numAmount * 12;
            case 'year':
                return numAmount;
            default:
                return numAmount;
        }
    }

    // View Style Management
    changeView(viewStyle) {
        this.currentView = viewStyle;
        this.settings.view = viewStyle;
        this.saveSettings();
        this.applyViewStyle();
    }

    applyViewStyle() {
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.currentView);
        });

        // Update jobs list container
        const jobsList = document.getElementById('jobs-list');
        jobsList.className = `jobs-list view-${this.currentView}`;
    }

    // Language Management
    changeLanguage(language) {
        this.currentLanguage = language;
        this.settings.language = language;
        this.saveSettings();
        this.translateUI();
        this.updateReports();
    }

    translateUI() {
        const elements = {
            'app-title': 'app_title',
            'add-job-text': 'add_job',
            'add-job-btn': 'add_job',
            'search-jobs': 'search_jobs',
            'sort-label': 'sort_by',
            'sort-date-applied-desc': 'sort_date_applied_desc',
            'sort-date-applied-asc': 'sort_date_applied_asc',
            'sort-start-date-desc': 'sort_start_date_desc',
            'sort-start-date-asc': 'sort_start_date_asc',
            'sort-salary-desc': 'sort_salary_desc',
            'sort-salary-asc': 'sort_salary_asc',
            'sort-status': 'sort_status',
            'sort-company': 'sort_company',
            'sort-position': 'sort_position',
            'archive-title': 'archived_jobs',
            'search-archive': 'search_archived_jobs',
            'sort-archive-label': 'sort_by',
            'sort-archive-date-applied-desc': 'sort_date_applied_desc',
            'sort-archive-date-applied-asc': 'sort_date_applied_asc',
            'sort-archive-start-date-desc': 'sort_start_date_desc',
            'sort-archive-start-date-asc': 'sort_start_date_asc',
            'sort-archive-salary-desc': 'sort_salary_desc',
            'sort-archive-salary-asc': 'sort_salary_asc',
            'sort-archive-status': 'sort_status',
            'sort-archive-company': 'sort_company',
            'sort-archive-position': 'sort_position',
            'chart-title': 'chart_title',
            'legend-to-apply': 'status_to_apply',
            'legend-applied': 'status_applied',
            'legend-interview-scheduled': 'status_interview_scheduled',
            'legend-interview-completed': 'status_interview_completed',
            'legend-rejected': 'status_rejected',
            'legend-accepted': 'status_accepted',
            'reports-title': 'reports',
            'status-filter-label': 'filter_by_status',
            'contract-filter-label': 'filter_by_contract',
            'date-filter-label': 'filter_by_date',
            'select-status': 'select_status',
            'select-contract': 'select_contract',
            'select-date': 'select_date',
            'all-statuses': 'all_statuses',
            'all-contracts': 'all_contracts',
            'all-dates': 'all_dates',
            'total-jobs': 'total_jobs',
            'active-jobs': 'active_jobs',
            'completed-jobs': 'completed_jobs',
            'settings-title': 'settings',
            'language-label': 'language',
            'theme-label': 'theme',
            'export-data-btn': 'export_data',
            'import-data-btn': 'import_data',
            'clear-data-btn': 'clear_data',
            'export-description': 'export_description',
            'import-description': 'import_description',
            'clear-description': 'clear_description',
            'modal-title-add': 'add_job',
            'modal-title-edit': 'edit_job',
            'company-name-label': 'company_name',
            'position-title-label': 'position_title',
            'job-url-label': 'job_url',
            'contact-person-label': 'contact_person',
            'location-label': 'location',
            'status-label': 'status',
            'application-date-label': 'application_date',
            'contract-type-label': 'contract_type',
            'contract-duration-label': 'contract_duration',
            'start-date-label': 'start_date',
            'salary-amount-label': 'salary_amount',
            'salary-period-label': 'salary_period',
            'notes-label': 'notes',
            'interview-results-label': 'interview_results',
            'interview-date-label': 'interview_date',
            'interview-type-label': 'interview_type',
            'interview-result-label': 'interview_result',
            'interview-notes-label': 'interview_notes',
            'add-interview-text': 'add_interview',
            'select-contract': 'select_contract',
            'cdi-contract': 'cdi_contract',
            'cdd-contract': 'cdd_contract',
            'freelance-contract': 'freelance_contract',
            'internship-contract': 'internship_contract',
            'part-time-contract': 'part_time_contract',
            'temporary-contract': 'temporary_contract',
            'other-contract': 'other_contract',
            'select-period': 'select_period',
            'hour-period': 'hour_period',
            'day-period': 'day_period',
            'month-period': 'month_period',
            'year-period': 'year_period',
            'select-interview-type': 'select_interview_type',
            'phone-interview': 'phone_interview',
            'video-interview': 'video_interview',
            'onsite-interview': 'onsite_interview',
            'technical-test': 'technical_test',
            'assessment-test': 'assessment_test',
            'other-interview': 'other_interview',
            'select-result': 'select_result',
            'passed-result': 'passed_result',
            'failed-result': 'failed_result',
            'pending-result': 'pending_result',
            'cancelled-result': 'cancelled_result',
            'save-btn': 'save',
            'cancel-btn': 'cancel',
            'delete-modal-title': 'delete_job',
            'delete-modal-message': 'delete_job_message',
            'confirm-delete': 'confirm_delete',
            'cancel-delete': 'cancel',
            'clear-modal-title': 'clear_data',
            'clear-modal-message': 'clear_data_message',
            'confirm-clear': 'confirm_clear',
            'cancel-clear': 'cancel',
            'archive': 'Archive',
            'unarchive': 'Unarchive',
            'no_archived_jobs_yet': 'No archived jobs yet',
            'no_archived_jobs_found': 'No archived jobs found',
            'chart_title': 'Job Application Status Distribution',
            'try_search': 'Try adjusting your search terms',
            'add_first_job': 'Add your first job application to get started!',
            'add_first_job_btn': 'Add Your First Job'
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const translationKey = elements[id];
                const translation = this.translations[this.currentLanguage]?.[translationKey];
                if (translation) {
                    if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                        element.placeholder = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
            }
        });

        // Set RTL for Arabic
        if (this.currentLanguage === 'ar') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.setAttribute('dir', 'ltr');
        }
    }

    // Theme Management
    changeTheme(theme) {
        this.currentTheme = theme;
        this.settings.theme = theme;
        this.saveSettings();
        this.applyTheme();
    }

    applyTheme() {
        document.body.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-dark');
        
        if (this.currentTheme !== 'blue') {
            document.body.classList.add(`theme-${this.currentTheme}`);
        }

        document.getElementById('theme-select').value = this.currentTheme;
        document.getElementById('language-select').value = this.currentLanguage;
    }

    // Interview Results Management
    addInterviewField() {
        this.interviewCounter++;
        const container = document.getElementById('interview-results-container');
        const newInterview = document.createElement('div');
        newInterview.className = 'interview-result-item';
        newInterview.innerHTML = `
            <button type="button" class="remove-interview-btn" onclick="this.parentElement.remove()">&times;</button>
            <div class="form-row">
                <div class="form-group">
                    <label for="interview-date-${this.interviewCounter}">Date</label>
                    <input type="date" class="interview-date" id="interview-date-${this.interviewCounter}">
                </div>
                <div class="form-group">
                    <label for="interview-type-${this.interviewCounter}">Type</label>
                    <select class="interview-type" id="interview-type-${this.interviewCounter}">
                        <option value="">Select Type</option>
                        <option value="phone">Phone Interview</option>
                        <option value="video">Video Interview</option>
                        <option value="onsite">On-site Interview</option>
                        <option value="technical">Technical Test</option>
                        <option value="assessment">Assessment Test</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="interview-result-${this.interviewCounter}">Result</label>
                <select class="interview-result" id="interview-result-${this.interviewCounter}">
                    <option value="">Select Result</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <div class="form-group">
                <label for="interview-notes-${this.interviewCounter}">Details</label>
                <textarea class="interview-notes" id="interview-notes-${this.interviewCounter}" rows="2" placeholder="Interview details, feedback, next steps..."></textarea>
            </div>
        `;
        container.appendChild(newInterview);
    }

    // Contract Type Management
    handleContractTypeChange(contractType) {
        const durationInput = document.getElementById('contract-duration');
        
        if (contractType === 'cdi') {
            durationInput.value = 'indeterminate';
            durationInput.disabled = true;
            durationInput.style.opacity = '0.6';
            durationInput.style.cursor = 'not-allowed';
        } else {
            durationInput.disabled = false;
            durationInput.style.opacity = '1';
            durationInput.style.cursor = 'text';
            // Clear the value if it was "indeterminate" and user changes to non-CDI
            if (durationInput.value === 'indeterminate') {
                durationInput.value = '';
            }
        }
    }

    // Job Management
    openJobModal(jobId = null) {
        this.currentJobId = jobId;
        const modal = document.getElementById('job-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('job-form');

        if (jobId) {
            const job = this.jobs.find(j => j.id === jobId);
            if (job) {
                title.textContent = this.translations[this.currentLanguage]?.modal_title_edit || 'Edit Job';
                this.populateForm(job);
            }
        } else {
            title.textContent = this.translations[this.currentLanguage]?.modal_title_add || 'Add New Job';
            form.reset();
            document.getElementById('application-date').value = new Date().toISOString().split('T')[0];
            this.resetInterviewFields();
        }

        modal.classList.add('active');
    }

    closeJobModal() {
        document.getElementById('job-modal').classList.remove('active');
        this.currentJobId = null;
    }

    resetInterviewFields() {
        const container = document.getElementById('interview-results-container');
        container.innerHTML = `
            <div class="interview-result-item">
                <div class="form-row">
                    <div class="form-group">
                        <label for="interview-date-1">Date</label>
                        <input type="date" class="interview-date" id="interview-date-1">
                    </div>
                    <div class="form-group">
                        <label for="interview-type-1">Type</label>
                        <select class="interview-type" id="interview-type-1">
                            <option value="">Select Type</option>
                            <option value="phone">Phone Interview</option>
                            <option value="video">Video Interview</option>
                            <option value="onsite">On-site Interview</option>
                            <option value="technical">Technical Test</option>
                            <option value="assessment">Assessment Test</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="interview-result-1">Result</label>
                    <select class="interview-result" id="interview-result-1">
                        <option value="">Select Result</option>
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="interview-notes-1">Details</label>
                    <textarea class="interview-notes" id="interview-notes-1" rows="2" placeholder="Interview details, feedback, next steps..."></textarea>
                </div>
            </div>
        `;
        this.interviewCounter = 1;
    }

    populateForm(job) {
        // Reset interview fields first
        this.resetInterviewFields();
        
        // Populate basic form fields
        document.getElementById('company-name').value = job.companyName || '';
        document.getElementById('position-title').value = job.positionTitle || '';
        document.getElementById('job-url').value = job.jobUrl || '';
        document.getElementById('contact-person').value = job.contactPerson || '';
        document.getElementById('location').value = job.location || '';
        document.getElementById('status').value = job.status || 'to-apply';
        document.getElementById('application-date').value = job.applicationDate || '';
        document.getElementById('contract-type').value = job.contractType || '';
        document.getElementById('contract-duration').value = job.contractDuration || '';
        document.getElementById('start-date').value = job.startDate || '';
        document.getElementById('salary-amount').value = job.salaryAmount || '';
        document.getElementById('salary-period').value = job.salaryPeriod || '';
        document.getElementById('notes').value = job.notes || '';

        // Handle contract duration field based on contract type
        this.handleContractTypeChange(job.contractType || '');

        // Populate interview results after resetting fields
        if (job.interviewResults && job.interviewResults.length > 0) {
            job.interviewResults.forEach((interview, index) => {
                if (index > 0) {
                    this.addInterviewField();
                }
                const interviewItem = document.querySelectorAll('.interview-result-item')[index];
                if (interviewItem) {
                    interviewItem.querySelector('.interview-date').value = interview.date || '';
                    interviewItem.querySelector('.interview-type').value = interview.type || '';
                    interviewItem.querySelector('.interview-result').value = interview.result || '';
                    interviewItem.querySelector('.interview-notes').value = interview.notes || '';
                }
            });
        }
    }

    populateInterviewResults(interviewResults) {
        const container = document.getElementById('interview-results-container');
        container.innerHTML = '';
        
        if (interviewResults.length === 0) {
            this.resetInterviewFields();
            return;
        }

        interviewResults.forEach((interview, index) => {
            const interviewId = index + 1;
            const removeBtn = index > 0 ? `<button type="button" class="remove-interview-btn" onclick="this.parentElement.remove()">&times;</button>` : '';
            
            const interviewHtml = `
                <div class="interview-result-item">
                    ${removeBtn}
                    <div class="form-row">
                        <div class="form-group">
                            <label for="interview-date-${interviewId}">Date</label>
                            <input type="date" class="interview-date" id="interview-date-${interviewId}" value="${interview.date || ''}">
                        </div>
                        <div class="form-group">
                            <label for="interview-type-${interviewId}">Type</label>
                            <select class="interview-type" id="interview-type-${interviewId}">
                                <option value="">Select Type</option>
                                <option value="phone" ${interview.type === 'phone' ? 'selected' : ''}>Phone Interview</option>
                                <option value="video" ${interview.type === 'video' ? 'selected' : ''}>Video Interview</option>
                                <option value="onsite" ${interview.type === 'onsite' ? 'selected' : ''}>On-site Interview</option>
                                <option value="technical" ${interview.type === 'technical' ? 'selected' : ''}>Technical Test</option>
                                <option value="assessment" ${interview.type === 'assessment' ? 'selected' : ''}>Assessment Test</option>
                                <option value="other" ${interview.type === 'other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="interview-result-${interviewId}">Result</label>
                        <select class="interview-result" id="interview-result-${interviewId}">
                            <option value="">Select Result</option>
                            <option value="passed" ${interview.result === 'passed' ? 'selected' : ''}>Passed</option>
                            <option value="failed" ${interview.result === 'failed' ? 'selected' : ''}>Failed</option>
                            <option value="pending" ${interview.result === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="cancelled" ${interview.result === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="interview-notes-${interviewId}">Details</label>
                        <textarea class="interview-notes" id="interview-notes-${interviewId}" rows="2" placeholder="Interview details, feedback, next steps...">${interview.notes || ''}</textarea>
                    </div>
                </div>
            `;
            container.innerHTML += interviewHtml;
        });
        
        this.interviewCounter = interviewResults.length + 1;
    }

    saveJob(e) {
        e.preventDefault();
        
        // Collect interview results
        const interviewResults = [];
        const interviewItems = document.querySelectorAll('.interview-result-item');
        
        interviewItems.forEach((item, index) => {
            const interviewId = index + 1;
            const date = document.getElementById(`interview-date-${interviewId}`)?.value;
            const type = document.getElementById(`interview-type-${interviewId}`)?.value;
            const result = document.getElementById(`interview-result-${interviewId}`)?.value;
            const notes = document.getElementById(`interview-notes-${interviewId}`)?.value;
            
            if (date || type || result || notes) {
                interviewResults.push({
                    date,
                    type,
                    result,
                    notes
                });
            }
        });

        const jobData = {
            companyName: document.getElementById('company-name').value,
            positionTitle: document.getElementById('position-title').value,
            contractType: document.getElementById('contract-type').value,
            contractDuration: document.getElementById('contract-duration').value,
            applicationDate: document.getElementById('application-date').value,
            startDate: document.getElementById('start-date').value,
            status: document.getElementById('status').value,
            location: document.getElementById('location').value,
            salaryAmount: document.getElementById('salary-amount').value,
            salaryPeriod: document.getElementById('salary-period').value,
            contactPerson: document.getElementById('contact-person').value,
            jobUrl: document.getElementById('job-url').value,
            notes: document.getElementById('notes').value,
            interviewResults: interviewResults
        };

        if (this.currentJobId) {
            const index = this.jobs.findIndex(j => j.id === this.currentJobId);
            if (index !== -1) {
                jobData.id = this.currentJobId;
                jobData.createdAt = this.jobs[index].createdAt; // Preserve original creation date
                jobData.updatedAt = new Date().toISOString();
                this.jobs[index] = { ...this.jobs[index], ...jobData };
            }
        } else {
            jobData.id = this.generateId();
            jobData.createdAt = new Date().toISOString();
            this.jobs.push(jobData);
        }

        this.saveJobs();
        this.renderJobs();
        this.updateReports();
        this.closeJobModal();
        this.showNotification(this.translations[this.currentLanguage]?.job_saved || 'Job saved successfully!');
    }

    deleteJob() {
        if (this.currentJobId) {
            this.jobs = this.jobs.filter(j => j.id !== this.currentJobId);
            this.saveJobs();
            this.renderJobs();
            this.closeDeleteModal();
            this.showNotification(this.translations[this.currentLanguage]?.job_deleted || 'Job deleted successfully!');
        }
    }

    openDeleteModal(jobId) {
        this.currentJobId = jobId;
        document.getElementById('delete-modal').classList.add('active');
    }

    closeDeleteModal() {
        document.getElementById('delete-modal').classList.remove('active');
        this.currentJobId = null;
    }

    // Data Management
    exportData() {
        const data = {
            jobs: this.jobs,
            archivedJobs: this.archivedJobs,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `job-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(this.translations[this.currentLanguage]?.data_exported || 'Data exported successfully!');
    }

    importData() {
        document.getElementById('import-file-input').click();
    }

    handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.jobs) {
                    this.jobs = data.jobs;
                    this.saveJobs();
                }
                
                if (data.archivedJobs) {
                    this.archivedJobs = data.archivedJobs;
                    this.saveArchivedJobs();
                }

                if (data.settings) {
                    this.settings = { ...this.settings, ...data.settings };
                    this.saveSettings();
                    this.currentLanguage = this.settings.language;
                    this.currentTheme = this.settings.theme;
                    this.applyTheme();
                    this.translateUI();
                }
                
                this.renderJobs();
                this.renderArchivedJobs();
                this.updateReports();
                this.showNotification(this.translations[this.currentLanguage]?.data_imported || 'Data imported successfully!');
            } catch (error) {
                this.showNotification(this.translations[this.currentLanguage]?.import_error || 'Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    openClearModal() {
        document.getElementById('clear-data-modal').classList.add('active');
    }

    closeClearModal() {
        document.getElementById('clear-data-modal').classList.remove('active');
    }

    clearAllData() {
        this.jobs = [];
        this.saveJobs();
        this.renderJobs();
        this.updateReports();
        this.closeClearModal();
        this.showNotification(this.translations[this.currentLanguage]?.data_cleared || 'All data cleared successfully!');
    }

    // Rendering
    renderJobs() {
        const jobsList = document.getElementById('jobs-list');
        const searchTerm = document.getElementById('search-jobs').value.toLowerCase();
        
        let filteredJobs = this.jobs;
        if (searchTerm) {
            filteredJobs = this.jobs.filter(job => 
                job.companyName?.toLowerCase().includes(searchTerm) ||
                job.positionTitle?.toLowerCase().includes(searchTerm) ||
                job.location?.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredJobs.length === 0) {
            const noJobsText = searchTerm ? 
                (this.translations[this.currentLanguage]?.no_jobs_found || 'No jobs found') :
                (this.translations[this.currentLanguage]?.no_jobs_yet || 'No jobs yet');
            
            const trySearchText = this.translations[this.currentLanguage]?.try_search || 'Try adjusting your search terms';
            const addFirstText = this.translations[this.currentLanguage]?.add_first_job || 'Add your first job application to get started!';
            
            jobsList.innerHTML = `
                <div class="empty-state">
                    <h3>${noJobsText}</h3>
                    <p>${searchTerm ? trySearchText : addFirstText}</p>
                    ${!searchTerm ? `<button class="btn btn-primary" onclick="jobTracker.openJobModal()">${this.translations[this.currentLanguage]?.add_first_job_btn || 'Add Your First Job'}</button>` : ''}
                </div>
            `;
            return;
        }

        filteredJobs = this.sortJobs(filteredJobs);
        jobsList.innerHTML = filteredJobs.map(job => this.createJobCard(job)).join('');
    }

    renderArchivedJobs() {
        const archivedJobsList = document.getElementById('archive-list');
        const searchTerm = document.getElementById('search-archive').value.toLowerCase();
        
        let filteredArchivedJobs = this.archivedJobs;
        if (searchTerm) {
            filteredArchivedJobs = this.archivedJobs.filter(job => 
                job.companyName?.toLowerCase().includes(searchTerm) ||
                job.positionTitle?.toLowerCase().includes(searchTerm) ||
                job.location?.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredArchivedJobs.length === 0) {
            const noArchivedJobsText = searchTerm ? 
                (this.translations[this.currentLanguage]?.no_archived_jobs_found || 'No archived jobs found') :
                (this.translations[this.currentLanguage]?.no_archived_jobs_yet || 'No archived jobs yet');
            
            const trySearchText = this.translations[this.currentLanguage]?.try_search || 'Try adjusting your search terms';
            const addFirstText = this.translations[this.currentLanguage]?.add_first_job || 'Add your first job application to get started!';
            
            archivedJobsList.innerHTML = `
                <div class="empty-state">
                    <h3>${noArchivedJobsText}</h3>
                    <p>${searchTerm ? trySearchText : addFirstText}</p>
                    ${!searchTerm ? `<button class="btn btn-primary" onclick="jobTracker.openJobModal()">${this.translations[this.currentLanguage]?.add_first_job_btn || 'Add Your First Job'}</button>` : ''}
                </div>
            `;
            return;
        }

        filteredArchivedJobs = this.sortJobs(filteredArchivedJobs);
        archivedJobsList.innerHTML = filteredArchivedJobs.map(job => this.createArchivedJobCard(job)).join('');
    }

    createJobCard(job) {
        const statusClass = `status-${job.status}`;
        const statusText = this.getStatusText(job.status);
        const applicationDate = job.applicationDate ? new Date(job.applicationDate).toLocaleDateString() : 'Not set';
        const contractBadge = job.contractType ? `<span class="contract-badge contract-${job.contractType}">${this.getContractText(job.contractType)}</span>` : '';
        const salaryText = this.formatSalary(job.salaryAmount, job.salaryPeriod);
        
        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <div>
                        <div class="job-title">${this.escapeHtml(job.positionTitle)}${contractBadge}</div>
                        <div class="job-company">${this.escapeHtml(job.companyName)}</div>
                    </div>
                    <div class="job-actions">
                        <button class="btn btn-small btn-secondary" onclick="jobTracker.openJobModal('${job.id}')">
                            ${this.translations[this.currentLanguage]?.edit || 'Edit'}
                        </button>
                        <button class="btn btn-small btn-danger" onclick="jobTracker.openDeleteModal('${job.id}')">
                            ${this.translations[this.currentLanguage]?.delete || 'Delete'}
                        </button>
                        <button class="btn btn-small btn-info" onclick="jobTracker.archiveJob('${job.id}')">
                            ${this.translations[this.currentLanguage]?.archive || 'Archive'}
                        </button>
                    </div>
                </div>
                
                <!-- Job Details -->
                <div class="job-details">
                    <div class="job-detail">
                        <strong>${this.translations[this.currentLanguage]?.status || 'Status'}:</strong>
                        <span class="job-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="job-detail">
                        <strong>${this.translations[this.currentLanguage]?.applied || 'Applied'}:</strong>
                        <span>${applicationDate}</span>
                    </div>
                    ${job.contractType ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.contract_type || 'Contract'}:</strong>
                            <span>${this.getContractText(job.contractType)}</span>
                        </div>
                    ` : ''}
                    ${job.contractDuration ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.duration || 'Duration'}:</strong>
                            <span>${this.escapeHtml(job.contractDuration)}</span>
                        </div>
                    ` : ''}
                    ${job.startDate ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.start_date || 'Start Date'}:</strong>
                            <span>${new Date(job.startDate).toLocaleDateString()}</span>
                        </div>
                    ` : ''}
                    ${job.location ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.location || 'Location'}:</strong>
                            <span>${this.escapeHtml(job.location)}</span>
                        </div>
                    ` : ''}
                    ${salaryText ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.salary || 'Salary'}:</strong>
                            <span>${salaryText}</span>
                        </div>
                    ` : ''}
                    ${job.contactPerson ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.contact || 'Contact'}:</strong>
                            <span>${this.escapeHtml(job.contactPerson)}</span>
                        </div>
                    ` : ''}
                    ${job.jobUrl ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.url || 'URL'}:</strong>
                            <a href="${job.jobUrl}" target="_blank" class="job-link">${this.translations[this.currentLanguage]?.view_job || 'View Job'}</a>
                        </div>
                    ` : ''}
                </div>

                <!-- Interview Results -->
                ${this.renderInterviewResultsPreview(job.interviewResults)}
                
                <!-- Notes -->
                ${job.notes ? `
                    <div class="job-notes">
                        <strong>${this.translations[this.currentLanguage]?.notes || 'Notes'}:</strong>
                        <p>${this.escapeHtml(job.notes)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    createArchivedJobCard(job) {
        const statusClass = `status-${job.status}`;
        const statusText = this.getStatusText(job.status);
        const applicationDate = job.applicationDate ? new Date(job.applicationDate).toLocaleDateString() : 'Not set';
        const contractBadge = job.contractType ? `<span class="contract-badge contract-${job.contractType}">${this.getContractText(job.contractType)}</span>` : '';
        const salaryText = this.formatSalary(job.salaryAmount, job.salaryPeriod);
        
        return `
            <div class="job-card archived-job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <div>
                        <div class="job-title">${this.escapeHtml(job.positionTitle)}${contractBadge}</div>
                        <div class="job-company">${this.escapeHtml(job.companyName)}</div>
                    </div>
                    <div class="job-actions">
                        <button class="btn btn-small btn-info" onclick="jobTracker.unarchiveJob('${job.id}')">
                            ${this.translations[this.currentLanguage]?.unarchive || 'Unarchive'}
                        </button>
                        <button class="btn btn-small btn-danger" onclick="jobTracker.openDeleteModal('${job.id}')">
                            ${this.translations[this.currentLanguage]?.delete || 'Delete'}
                        </button>
                    </div>
                </div>
                
                <!-- Job Details -->
                <div class="job-details">
                    <div class="job-detail">
                        <strong>${this.translations[this.currentLanguage]?.status || 'Status'}:</strong>
                        <span class="job-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="job-detail">
                        <strong>${this.translations[this.currentLanguage]?.applied || 'Applied'}:</strong>
                        <span>${applicationDate}</span>
                    </div>
                    ${job.contractType ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.contract_type || 'Contract'}:</strong>
                            <span>${this.getContractText(job.contractType)}</span>
                        </div>
                    ` : ''}
                    ${job.contractDuration ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.duration || 'Duration'}:</strong>
                            <span>${this.escapeHtml(job.contractDuration)}</span>
                        </div>
                    ` : ''}
                    ${job.startDate ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.start_date || 'Start Date'}:</strong>
                            <span>${new Date(job.startDate).toLocaleDateString()}</span>
                        </div>
                    ` : ''}
                    ${job.location ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.location || 'Location'}:</strong>
                            <span>${this.escapeHtml(job.location)}</span>
                        </div>
                    ` : ''}
                    ${salaryText ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.salary || 'Salary'}:</strong>
                            <span>${salaryText}</span>
                        </div>
                    ` : ''}
                    ${job.contactPerson ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.contact || 'Contact'}:</strong>
                            <span>${this.escapeHtml(job.contactPerson)}</span>
                        </div>
                    ` : ''}
                    ${job.jobUrl ? `
                        <div class="job-detail">
                            <strong>${this.translations[this.currentLanguage]?.url || 'URL'}:</strong>
                            <a href="${job.jobUrl}" target="_blank" class="job-link">${this.translations[this.currentLanguage]?.view_job || 'View Job'}</a>
                        </div>
                    ` : ''}
                </div>

                <!-- Interview Results -->
                ${this.renderInterviewResultsPreview(job.interviewResults)}
                
                <!-- Notes -->
                ${job.notes ? `
                    <div class="job-notes">
                        <strong>${this.translations[this.currentLanguage]?.notes || 'Notes'}:</strong>
                        <p>${this.escapeHtml(job.notes)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderInterviewResultsPreview(interviewResults) {
        if (!interviewResults || interviewResults.length === 0) return '';

        const totalInterviews = interviewResults.length;
        const passedInterviews = interviewResults.filter(i => i.result === 'passed').length;
        const failedInterviews = interviewResults.filter(i => i.result === 'failed').length;
        const pendingInterviews = interviewResults.filter(i => i.result === 'pending').length;

        return `
            <div class="interview-results-preview">
                <div class="interview-preview-header" onclick="jobTracker.toggleInterviewDetails(this)">
                    <div class="interview-preview-title">
                        <span class="interview-icon">📋</span>
                        <span>${this.translations[this.currentLanguage]?.interview_results || 'Interview Results & Tests'}</span>
                        <span class="interview-count">(${totalInterviews})</span>
                    </div>
                    <div class="interview-preview-stats">
                        ${passedInterviews > 0 ? `<span class="stat-passed">✓ ${passedInterviews}</span>` : ''}
                        ${failedInterviews > 0 ? `<span class="stat-failed">✗ ${failedInterviews}</span>` : ''}
                        ${pendingInterviews > 0 ? `<span class="stat-pending">⏳ ${pendingInterviews}</span>` : ''}
                    </div>
                    <span class="expand-icon">▼</span>
                </div>
                <div class="interview-results-details" style="display: none;">
                    ${this.renderInterviewResults(interviewResults)}
                </div>
            </div>
        `;
    }

    renderInterviewResults(interviewResults) {
        if (!interviewResults || interviewResults.length === 0) return '';

        const resultsHtml = interviewResults.map(interview => {
            const resultClass = `interview-${interview.result}`;
            const resultText = this.getInterviewResultText(interview.result);
            const typeText = this.getInterviewTypeText(interview.type);
            const dateText = interview.date ? new Date(interview.date).toLocaleDateString() : 'No date';
            
            return `
                <div class="interview-result-item">
                    <div class="interview-result-header">
                        <div>
                            <div class="interview-result-type">${typeText}</div>
                            <div class="interview-result-date">${dateText}</div>
                        </div>
                        <span class="interview-result-status ${resultClass}">${resultText}</span>
                    </div>
                    ${interview.notes ? `
                        <div class="interview-result-notes">${this.escapeHtml(interview.notes)}</div>
                    ` : ''}
                </div>
            `;
        }).join('');

        return `
            <div class="interview-results-section">
                ${resultsHtml}
            </div>
        `;
    }

    toggleInterviewDetails(headerElement) {
        const detailsElement = headerElement.nextElementSibling;
        const expandIcon = headerElement.querySelector('.expand-icon');
        
        if (detailsElement.style.display === 'none') {
            detailsElement.style.display = 'block';
            expandIcon.textContent = '▲';
            headerElement.classList.add('expanded');
        } else {
            detailsElement.style.display = 'none';
            expandIcon.textContent = '▼';
            headerElement.classList.remove('expanded');
        }
    }

    // Reports
    updateReports() {
        const statusFilter = document.getElementById('status-filter').value;
        const contractFilter = document.getElementById('contract-filter').value;
        const dateFilter = document.getElementById('date-filter').value;
        
        let filteredJobs = this.jobs;
        
        if (statusFilter) {
            filteredJobs = filteredJobs.filter(job => job.status === statusFilter);
        }
        
        if (contractFilter) {
            filteredJobs = filteredJobs.filter(job => job.contractType === contractFilter);
        }
        
        if (dateFilter) {
            const now = new Date();
            const startDate = this.getStartDate(dateFilter, now);
            filteredJobs = filteredJobs.filter(job => {
                const jobDate = new Date(job.applicationDate || job.createdAt);
                return jobDate >= startDate;
            });
        }

        this.updateStats(filteredJobs);
        this.updateChart(filteredJobs);
    }

    updateStats(jobs) {
        const totalJobs = jobs.length;
        const appliedJobs = jobs.filter(job => job.status !== 'to-apply').length;
        const interviewJobs = jobs.filter(job => 
            job.status === 'interview-scheduled' || job.status === 'interview-completed'
        ).length;
        
        const completedJobs = jobs.filter(job => 
            job.status === 'accepted' || job.status === 'rejected'
        ).length;
        const successRate = completedJobs > 0 ? 
            Math.round((jobs.filter(job => job.status === 'accepted').length / completedJobs) * 100) : 0;

        document.getElementById('total-jobs').textContent = totalJobs;
        document.getElementById('applied-jobs').textContent = appliedJobs;
        document.getElementById('interview-jobs').textContent = interviewJobs;
        document.getElementById('success-rate').textContent = `${successRate}%`;
    }

    updateChart(jobs) {
        const canvas = document.getElementById('status-chart');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size for better resolution
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const statusCounts = {};
        const statuses = ['to-apply', 'applied', 'interview-scheduled', 'interview-completed', 'rejected', 'accepted'];
        
        statuses.forEach(status => {
            statusCounts[status] = jobs.filter(job => job.status === status).length;
        });

        const maxCount = Math.max(...Object.values(statusCounts));
        const totalJobs = jobs.length;
        
        if (totalJobs === 0) {
            this.drawEmptyChart(ctx, canvas);
            return;
        }

        // Chart dimensions
        const chartWidth = rect.width;
        const chartHeight = rect.height;
        const padding = 40;
        const barSpacing = 20;
        const availableWidth = chartWidth - (padding * 2);
        const barWidth = (availableWidth - (barSpacing * (statuses.length - 1))) / statuses.length;
        const maxBarHeight = chartHeight - (padding * 3) - 60; // Space for labels and values

        // Draw chart background
        this.drawChartBackground(ctx, chartWidth, chartHeight);

        // Draw grid lines
        this.drawGridLines(ctx, chartWidth, chartHeight, padding, maxCount);

        // Draw bars
        statuses.forEach((status, index) => {
            const count = statusCounts[status];
            const percentage = totalJobs > 0 ? (count / totalJobs) * 100 : 0;
            const barHeight = maxCount > 0 ? (count / maxCount) * maxBarHeight : 0;
            const x = padding + (index * (barWidth + barSpacing));
            const y = chartHeight - padding - 60 - barHeight;

            // Draw bar with gradient
            this.drawBar(ctx, x, y, barWidth, barHeight, status, count, percentage);
        });

        // Draw chart title
        this.drawChartTitle(ctx, chartWidth, totalJobs);
    }

    drawEmptyChart(ctx, canvas) {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Draw empty state
        ctx.fillStyle = '#f5f5f5';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data to display', centerX, centerY - 20);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#999';
        ctx.fillText('Add some jobs to see statistics', centerX, centerY + 10);
    }

    drawChartBackground(ctx, width, height) {
        // Draw chart background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Draw subtle border
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, width, height);
    }

    drawGridLines(ctx, width, height, padding, maxCount) {
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        const gridLines = Math.min(5, maxCount);
        for (let i = 1; i <= gridLines; i++) {
            const y = padding + ((height - padding * 3 - 60) / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Draw grid labels
            const value = Math.round((maxCount / gridLines) * i);
            ctx.fillStyle = '#999';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(value.toString(), padding - 10, y + 4);
        }

        ctx.setLineDash([]);
    }

    drawBar(ctx, x, y, width, height, status, count, percentage) {
        // Create gradient for bar
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        const color = this.getStatusColor(status);
        gradient.addColorStop(0, this.lightenColor(color, 0.3));
        gradient.addColorStop(1, color);

        // Draw bar shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(x + 2, y + 2, width, height);

        // Draw main bar
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);

        // Draw bar border
        ctx.strokeStyle = this.darkenColor(color, 0.2);
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // Draw value on top of bar
        if (count > 0) {
            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(count.toString(), x + width / 2, y - 10);

            // Draw percentage
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.fillText(`${percentage.toFixed(1)}%`, x + width / 2, y - 25);
        }

        // Draw status label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const statusText = this.getStatusText(status);
        const words = statusText.split(' ');
        const lineHeight = 14;
        
        words.forEach((word, index) => {
            ctx.fillText(word, x + width / 2, y + height + 20 + (index * lineHeight));
        });
    }

    drawChartTitle(ctx, width, totalJobs) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Job Application Status Distribution', width / 2, 25);
        
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.fillText(`Total Jobs: ${totalJobs}`, width / 2, 45);
    }

    lightenColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    darkenColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getStatusText(status) {
        const statusMap = {
            'to-apply': this.translations[this.currentLanguage]?.status_to_apply || 'To Apply',
            'applied': this.translations[this.currentLanguage]?.status_applied || 'Applied',
            'interview-scheduled': this.translations[this.currentLanguage]?.status_interview_scheduled || 'Interview Scheduled',
            'interview-completed': this.translations[this.currentLanguage]?.status_interview_completed || 'Interview Completed',
            'rejected': this.translations[this.currentLanguage]?.status_rejected || 'Rejected',
            'accepted': this.translations[this.currentLanguage]?.status_accepted || 'Accepted'
        };
        return statusMap[status] || status;
    }

    getContractText(contractType) {
        const contractMap = {
            'cdi': 'CDI',
            'cdd': 'CDD',
            'freelance': 'Freelance',
            'internship': 'Internship',
            'part-time': 'Part-time',
            'temporary': 'Temporary',
            'other': 'Other'
        };
        return contractMap[contractType] || contractType;
    }

    getInterviewTypeText(type) {
        const typeMap = {
            'phone': 'Phone Interview',
            'video': 'Video Interview',
            'onsite': 'On-site Interview',
            'technical': 'Technical Test',
            'assessment': 'Assessment Test',
            'other': 'Other'
        };
        return typeMap[type] || type;
    }

    getInterviewResultText(result) {
        const resultMap = {
            'passed': 'Passed',
            'failed': 'Failed',
            'pending': 'Pending',
            'cancelled': 'Cancelled'
        };
        return resultMap[result] || result;
    }

    formatSalary(amount, period) {
        if (!amount || !period) return '';
        
        const periodText = {
            'hour': '/hour',
            'day': '/day',
            'month': '/month',
            'year': '/year'
        };
        
        return `${amount} ${periodText[period] || period}`;
    }

    getStatusColor(status) {
        const colorMap = {
            'to-apply': '#f57c00',
            'applied': '#1976d2',
            'interview-scheduled': '#7b1fa2',
            'interview-completed': '#388e3c',
            'rejected': '#d32f2f',
            'accepted': '#2e7d32'
        };
        return colorMap[status] || '#666';
    }

    getStartDate(filter, now) {
        switch (filter) {
            case 'today':
                return new Date(now.getFullYear(), now.getMonth(), now.getDate());
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                return new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
            case 'month':
                return new Date(now.getFullYear(), now.getMonth(), 1);
            case 'quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                return new Date(now.getFullYear(), quarter * 3, 1);
            case 'year':
                return new Date(now.getFullYear(), 0, 1);
            default:
                return new Date(0);
        }
    }

    filterJobs(searchTerm) {
        this.renderJobs();
    }

    filterArchivedJobs(searchTerm) {
        this.renderArchivedJobs();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Translations
    getTranslations() {
        return {
            en: {
                app_title: 'Job Tracker',
                add_job_text: 'Add Job',
                settings_title: 'Settings',
                language_section_title: 'Language',
                language_label: 'Select Language:',
                theme_section_title: 'Theme',
                theme_label: 'Color Theme:',
                data_section_title: 'Data Management',
                export_data_text: 'Export Data',
                import_data_text: 'Import Data',
                clear_data_text: 'Clear All Data',
                about_section_title: 'About',
                app_version: 'Version: 1.0.0',
                app_description: 'Job Application Tracker - Track your job applications with ease',
                sort_label: 'Sort by:',
                status_filter_label: 'Status:',
                contract_filter_label: 'Contract Type:',
                date_filter_label: 'Date Range:',
                all_statuses: 'All Statuses',
                all_contracts: 'All Contracts',
                all_time: 'All Time',
                total_jobs_label: 'Total Jobs',
                applied_jobs_label: 'Applied',
                interview_jobs_label: 'Interviews',
                success_rate_label: 'Success Rate',
                company_name_label: 'Company Name *',
                position_title_label: 'Position Title *',
                contract_type_label: 'Contract Type',
                contract_duration_label: 'Contract Duration',
                application_date_label: 'Application Date',
                start_date_label: 'Start Date',
                job_status_label: 'Status',
                salary_amount_label: 'Salary Amount',
                salary_period_label: 'Salary Period',
                location_label: 'Location',
                contact_person_label: 'Contact Person',
                job_url_label: 'Job URL',
                interview_results_label: 'Interview Results & Tests',
                interview_date_label: 'Date',
                interview_type_label: 'Type',
                interview_result_label: 'Result',
                interview_notes_label: 'Details',
                add_interview_text: 'Add Another Interview/Test',
                notes_label: 'General Notes',
                save_job_btn: 'Save Job',
                delete_modal_title: 'Delete Job',
                delete_confirmation_text: 'Are you sure you want to delete this job application? This action cannot be undone.',
                clear_data_title: 'Clear All Data',
                clear_data_confirmation: 'This will permanently delete all your job applications. This action cannot be undone. Are you sure?',
                status_to_apply: 'To Apply',
                status_applied: 'Applied',
                status_interview_scheduled: 'Interview Scheduled',
                status_interview_completed: 'Interview Completed',
                status_rejected: 'Rejected',
                status_accepted: 'Accepted',
                edit: 'Edit',
                delete: 'Delete',
                status: 'Status',
                applied: 'Applied',
                contract_type: 'Contract',
                duration: 'Duration',
                start_date: 'Start Date',
                location: 'Location',
                salary: 'Salary',
                contact: 'Contact',
                url: 'URL',
                notes: 'Notes',
                interview_results: 'Interview Results & Tests',
                view_job: 'View Job',
                no_jobs_yet: 'No jobs yet',
                no_jobs_found: 'No jobs found',
                try_search: 'Try adjusting your search terms',
                add_first_job: 'Add your first job application to get started!',
                add_first_job_btn: 'Add Your First Job',
                job_saved: 'Job saved successfully!',
                job_deleted: 'Job deleted successfully!',
                data_exported: 'Data exported successfully!',
                data_imported: 'Data imported successfully!',
                data_cleared: 'All data cleared successfully!',
                import_error: 'Error importing data. Please check the file format.',
                modal_title_add: 'Add New Job',
                modal_title_edit: 'Edit Job',
                full_view: 'Full View',
                compact_view: 'Compact View',
                view_rapid: 'View Rapid',
                view_complete: 'View Complete',
                hide_rapid: 'Hide Rapid',
                complete_details: 'Complete Details',
                archive: 'Archive',
                unarchive: 'Unarchive',
                no_archived_jobs_yet: 'No archived jobs yet',
                no_archived_jobs_found: 'No archived jobs found',
                chart_title: 'Job Application Status Distribution'
            },
            es: {
                app_title: 'Rastreador de Trabajos',
                add_job_text: 'Agregar Trabajo',
                settings_title: 'Configuración',
                language_section_title: 'Idioma',
                language_label: 'Seleccionar Idioma:',
                theme_section_title: 'Tema',
                theme_label: 'Tema de Color:',
                data_section_title: 'Gestión de Datos',
                export_data_text: 'Exportar Datos',
                import_data_text: 'Importar Datos',
                clear_data_text: 'Borrar Todos los Datos',
                about_section_title: 'Acerca de',
                app_version: 'Versión: 1.0.0',
                app_description: 'Rastreador de Aplicaciones de Trabajo - Rastrea tus aplicaciones de trabajo fácilmente',
                sort_label: 'Ordenar por:',
                status_filter_label: 'Estado:',
                contract_filter_label: 'Tipo de Contrato:',
                date_filter_label: 'Rango de Fecha:',
                all_statuses: 'Todos los Estados',
                all_contracts: 'Todos los Contratos',
                all_time: 'Todo el Tiempo',
                total_jobs_label: 'Total de Trabajos',
                applied_jobs_label: 'Aplicado',
                interview_jobs_label: 'Entrevistas',
                success_rate_label: 'Tasa de Éxito',
                company_name_label: 'Nombre de la Empresa *',
                position_title_label: 'Título del Puesto *',
                contract_type_label: 'Tipo de Contrato',
                contract_duration_label: 'Duración del Contrato',
                application_date_label: 'Fecha de Aplicación',
                start_date_label: 'Fecha de Inicio',
                job_status_label: 'Estado',
                salary_amount_label: 'Monto del Salario',
                salary_period_label: 'Período del Salario',
                location_label: 'Ubicación',
                contact_person_label: 'Persona de Contacto',
                job_url_label: 'URL del Trabajo',
                interview_results_label: 'Resultados de Entrevistas y Pruebas',
                interview_date_label: 'Fecha',
                interview_type_label: 'Tipo',
                interview_result_label: 'Resultado',
                interview_notes_label: 'Detalles',
                add_interview_text: 'Agregar Otra Entrevista/Prueba',
                notes_label: 'Notas Generales',
                save_job_btn: 'Guardar Trabajo',
                delete_modal_title: 'Eliminar Trabajo',
                delete_confirmation_text: '¿Estás seguro de que quieres eliminar esta aplicación de trabajo? Esta acción no se puede deshacer.',
                clear_data_title: 'Borrar Todos los Datos',
                clear_data_confirmation: 'Esto eliminará permanentemente todas tus aplicaciones de trabajo. Esta acción no se puede deshacer. ¿Estás seguro?',
                status_to_apply: 'Por Aplicar',
                status_applied: 'Aplicado',
                status_interview_scheduled: 'Entrevista Programada',
                status_interview_completed: 'Entrevista Completada',
                status_rejected: 'Rechazado',
                status_accepted: 'Aceptado',
                edit: 'Editar',
                delete: 'Eliminar',
                status: 'Estado',
                applied: 'Aplicado',
                contract_type: 'Contrato',
                duration: 'Duración',
                start_date: 'Fecha de Inicio',
                location: 'Ubicación',
                salary: 'Salario',
                contact: 'Contacto',
                url: 'URL',
                notes: 'Notas',
                interview_results: 'Resultados de Entrevistas y Pruebas',
                view_job: 'Ver Trabajo',
                no_jobs_yet: 'Aún no hay trabajos',
                no_jobs_found: 'No se encontraron trabajos',
                try_search: 'Intenta ajustar los términos de búsqueda',
                add_first_job: '¡Agrega tu primera aplicación de trabajo para comenzar!',
                add_first_job_btn: 'Agregar Tu Primer Trabajo',
                job_saved: '¡Trabajo guardado exitosamente!',
                job_deleted: '¡Trabajo eliminado exitosamente!',
                data_exported: '¡Datos exportados exitosamente!',
                data_imported: '¡Datos importados exitosamente!',
                data_cleared: '¡Todos los datos borrados exitosamente!',
                import_error: 'Error al importar datos. Por favor verifica el formato del archivo.',
                modal_title_add: 'Agregar Nuevo Trabajo',
                modal_title_edit: 'Editar Trabajo',
                full_view: 'Vista Completa',
                compact_view: 'Vista Compacta',
                view_rapid: 'Ver Rápido',
                view_complete: 'Ver Completo',
                hide_rapid: 'Ocultar Rápido',
                complete_details: 'Detalles Completos',
                archive: 'Archivar',
                unarchive: 'Desarchivar',
                no_archived_jobs_yet: 'Aún no hay trabajos archivados',
                no_archived_jobs_found: 'No se encontraron trabajos archivados',
                chart_title: 'Distribución de Estados de Solicitud de Trabajo'
            },
            fr: {
                app_title: 'Suivi des Candidatures',
                add_job_text: 'Ajouter un Emploi',
                settings_title: 'Paramètres',
                language_section_title: 'Langue',
                language_label: 'Sélectionner la Langue:',
                theme_section_title: 'Thème',
                theme_label: 'Thème de Couleur:',
                data_section_title: 'Gestion des Données',
                export_data_text: 'Exporter les Données',
                import_data_text: 'Importer les Données',
                clear_data_text: 'Effacer Toutes les Données',
                about_section_title: 'À Propos',
                app_version: 'Version: 1.0.0',
                app_description: 'Suivi des Candidatures - Suivez vos candidatures facilement',
                sort_label: 'Trier par:',
                status_filter_label: 'Statut:',
                contract_filter_label: 'Type de Contrat:',
                date_filter_label: 'Période:',
                all_statuses: 'Tous les Statuts',
                all_contracts: 'Tous les Contrats',
                all_time: 'Tout le Temps',
                total_jobs_label: 'Total des Emplois',
                applied_jobs_label: 'Candidaté',
                interview_jobs_label: 'Entretiens',
                success_rate_label: 'Taux de Réussite',
                company_name_label: 'Nom de l\'Entreprise *',
                position_title_label: 'Titre du Poste *',
                contract_type_label: 'Type de Contrat',
                contract_duration_label: 'Durée du Contrat',
                application_date_label: 'Date de Candidature',
                start_date_label: 'Date de Début',
                job_status_label: 'Statut',
                salary_amount_label: 'Montant du Salaire',
                salary_period_label: 'Période du Salaire',
                location_label: 'Localisation',
                contact_person_label: 'Personne de Contact',
                job_url_label: 'URL de l\'Emploi',
                interview_results_label: 'Résultats des Entretiens et Tests',
                interview_date_label: 'Date',
                interview_type_label: 'Type',
                interview_result_label: 'Résultat',
                interview_notes_label: 'Détails',
                add_interview_text: 'Ajouter une Autre Entretien/Test',
                notes_label: 'Notes Générales',
                save_job_btn: 'Sauvegarder',
                delete_modal_title: 'Supprimer l\'Emploi',
                delete_confirmation_text: 'Êtes-vous sûr de vouloir supprimer cette candidature? Cette action ne peut pas être annulée.',
                clear_data_title: 'Effacer Toutes les Données',
                clear_data_confirmation: 'Cela supprimera définitivement toutes vos candidatures. Cette action ne peut pas être annulée. Êtes-vous sûr?',
                status_to_apply: 'À Postuler',
                status_applied: 'Candidaté',
                status_interview_scheduled: 'Entretien Programmé',
                status_interview_completed: 'Entretien Terminé',
                status_rejected: 'Rejeté',
                status_accepted: 'Accepté',
                edit: 'Modifier',
                delete: 'Supprimer',
                status: 'Statut',
                applied: 'Candidaté',
                contract_type: 'Contrat',
                duration: 'Durée',
                start_date: 'Date de Début',
                location: 'Localisation',
                salary: 'Salaire',
                contact: 'Contact',
                url: 'URL',
                notes: 'Notes',
                interview_results: 'Résultats des Entretiens et Tests',
                view_job: 'Voir l\'Emploi',
                no_jobs_yet: 'Aucun emploi pour le moment',
                no_jobs_found: 'Aucun emploi trouvé',
                try_search: 'Essayez d\'ajuster les termes de recherche',
                add_first_job: 'Ajoutez votre première candidature pour commencer!',
                add_first_job_btn: 'Ajouter Votre Premier Emploi',
                job_saved: 'Emploi sauvegardé avec succès!',
                job_deleted: 'Emploi supprimé avec succès!',
                data_exported: 'Données exportées avec succès!',
                data_imported: 'Données importées avec succès!',
                data_cleared: 'Toutes les données effacées avec succès!',
                import_error: 'Erreur lors de l\'importation des données. Veuillez vérifier le format du fichier.',
                modal_title_add: 'Ajouter un Nouvel Emploi',
                modal_title_edit: 'Modifier l\'Emploi',
                full_view: 'Vue Complète',
                compact_view: 'Vue Compacte',
                view_rapid: 'Voir Rapide',
                view_complete: 'Voir Complet',
                hide_rapid: 'Masquer Rapide',
                complete_details: 'Détails Complets',
                archive: 'Archiver',
                unarchive: 'Désarchiver',
                no_archived_jobs_yet: 'Aucun emploi archivé pour le moment',
                no_archived_jobs_found: 'Aucun emploi archivé trouvé',
                chart_title: 'Distribution des États de Demande d\'Emploi'
            }
            // Add more languages as needed
        };
    }
}

// Initialize the application
const jobTracker = new JobTracker();

// Add some sample data for demonstration
if (jobTracker.jobs.length === 0) {
    const sampleJobs = [
        {
            id: '1',
            companyName: 'Tech Corp',
            positionTitle: 'Senior Developer',
            contractType: 'cdi',
            contractDuration: 'Permanent',
            applicationDate: '2024-01-15',
            startDate: '2024-02-01',
            status: 'applied',
            salaryAmount: '80000',
            salaryPeriod: 'year',
            location: 'San Francisco, CA',
            contactPerson: 'John Smith',
            jobUrl: 'https://example.com/job1',
            notes: 'Great opportunity with modern tech stack',
            interviewResults: [
                {
                    date: '2024-01-20',
                    type: 'phone',
                    result: 'passed',
                    notes: 'Initial phone screening went well. Technical interview scheduled.'
                },
                {
                    date: '2024-01-25',
                    type: 'technical',
                    result: 'pending',
                    notes: 'Technical test completed. Waiting for results.'
                }
            ],
            createdAt: '2024-01-15T10:00:00Z'
        },
        {
            id: '2',
            companyName: 'Startup Inc',
            positionTitle: 'Full Stack Engineer',
            contractType: 'cdd',
            contractDuration: '6 months',
            applicationDate: '2024-01-10',
            startDate: '2024-01-20',
            status: 'interview-scheduled',
            salaryAmount: '70',
            salaryPeriod: 'hour',
            location: 'Remote',
            contactPerson: 'Sarah Johnson',
            jobUrl: 'https://example.com/job2',
            notes: 'Interview scheduled for next week',
            interviewResults: [
                {
                    date: '2024-01-15',
                    type: 'video',
                    result: 'passed',
                    notes: 'First round interview completed successfully.'
                }
            ],
            createdAt: '2024-01-10T14:30:00Z'
        }
    ];
    
    jobTracker.jobs = sampleJobs;
    jobTracker.saveJobs();
    jobTracker.renderJobs();
    jobTracker.updateReports();
} 