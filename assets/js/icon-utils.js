// Icon Utilities for Job Application Tracker

class IconUtils {
    /**
     * Create an SVG icon element
     * @param {string} iconName - The name of the icon (without 'icon-' prefix)
     * @param {string} size - Size class: 'small', 'medium', 'large'
     * @param {string} colorClass - Optional color class
     * @returns {HTMLElement} SVG element
     */
    static createIcon(iconName, size = 'medium', colorClass = '') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        
        svg.classList.add('svg-icon', `icon-${size}`);
        if (colorClass) {
            svg.classList.add(colorClass);
        }
        
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `assets/images/icons.svg#icon-${iconName}`);
        svg.appendChild(use);
        
        return svg;
    }

    /**
     * Create a status icon
     * @param {string} status - Job status
     * @param {string} size - Icon size
     * @returns {HTMLElement} SVG element
     */
    static createStatusIcon(status, size = 'medium') {
        const statusMap = {
            'to-apply': 'to-apply',
            'applied': 'applied',
            'interview-scheduled': 'interview-scheduled',
            'interview-completed': 'interview-completed',
            'rejected': 'rejected',
            'accepted': 'accepted'
        };

        const iconName = statusMap[status] || 'to-apply';
        const colorClass = `icon-status-${status}`;
        
        return this.createIcon(iconName, size, colorClass);
    }

    /**
     * Create an action icon
     * @param {string} action - Action type
     * @param {string} size - Icon size
     * @returns {HTMLElement} SVG element
     */
    static createActionIcon(action, size = 'medium') {
        const actionMap = {
            'add': 'add',
            'edit': 'edit',
            'delete': 'delete',
            'archive': 'archive',
            'unarchive': 'unarchive'
        };

        const iconName = actionMap[action] || 'add';
        const colorClass = `icon-action-${action}`;
        
        return this.createIcon(iconName, size, colorClass);
    }

    /**
     * Create a navigation icon
     * @param {string} nav - Navigation type
     * @param {string} size - Icon size
     * @returns {HTMLElement} SVG element
     */
    static createNavIcon(nav, size = 'medium') {
        const navMap = {
            'jobs': 'jobs',
            'reports': 'reports',
            'settings': 'settings',
            'archive': 'archive-nav'
        };

        const iconName = navMap[nav] || 'jobs';
        return this.createIcon(iconName, size);
    }

    /**
     * Create a view icon
     * @param {string} view - View type
     * @param {string} size - Icon size
     * @returns {HTMLElement} SVG element
     */
    static createViewIcon(view, size = 'medium') {
        const viewMap = {
            'list': 'list',
            'grid': 'grid',
            'cards': 'cards'
        };

        const iconName = viewMap[view] || 'list';
        return this.createIcon(iconName, size);
    }

    /**
     * Replace text with icon in an element
     * @param {HTMLElement} element - The element to add icon to
     * @param {string} iconName - Icon name
     * @param {string} size - Icon size
     * @param {string} colorClass - Optional color class
     */
    static addIconToElement(element, iconName, size = 'medium', colorClass = '') {
        const icon = this.createIcon(iconName, size, colorClass);
        element.appendChild(icon);
    }

    /**
     * Create a button with icon
     * @param {string} iconName - Icon name
     * @param {string} text - Button text
     * @param {string} className - CSS classes
     * @param {string} size - Icon size
     * @returns {HTMLElement} Button element
     */
    static createIconButton(iconName, text, className = '', size = 'medium') {
        const button = document.createElement('button');
        button.className = `btn ${className}`;
        
        const icon = this.createIcon(iconName, size);
        button.appendChild(icon);
        
        if (text) {
            const span = document.createElement('span');
            span.textContent = text;
            button.appendChild(span);
        }
        
        return button;
    }

    /**
     * Update all icons in the application
     */
    static updateAllIcons() {
        // Update navigation icons
        const navIcons = document.querySelectorAll('[data-nav-icon]');
        navIcons.forEach(element => {
            const navType = element.getAttribute('data-nav-icon');
            const icon = this.createNavIcon(navType);
            element.innerHTML = '';
            element.appendChild(icon);
        });

        // Update status icons
        const statusIcons = document.querySelectorAll('[data-status-icon]');
        statusIcons.forEach(element => {
            const status = element.getAttribute('data-status-icon');
            const icon = this.createStatusIcon(status);
            element.innerHTML = '';
            element.appendChild(icon);
        });

        // Update action icons
        const actionIcons = document.querySelectorAll('[data-action-icon]');
        actionIcons.forEach(element => {
            const action = element.getAttribute('data-action-icon');
            const icon = this.createActionIcon(action);
            element.innerHTML = '';
            element.appendChild(icon);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconUtils;
} else {
    window.IconUtils = IconUtils;
} 