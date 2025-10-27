// Club Management System - JavaScript
// Author: Club Management System
// Version: 1.0

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeSidebar();
    initializeNavigation();
    loadDashboardData();
    initializeModals();
    initializeTableActions();
}

// ==================== SIDEBAR FUNCTIONALITY ====================
function initializeSidebar() {
    const mobileToggle = document.getElementById('mobileToggle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Desktop toggle - collapse/expand sidebar
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }

    // Restore sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }

    // Mobile toggle - show/hide sidebar
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            sidebar.classList.toggle('mobile-active');
            sidebarOverlay.classList.toggle('active');
        });
    }

    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            closeMobileSidebar();
        });
    }

    // Close sidebar when clicking nav items on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                closeMobileSidebar();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('mobile-active');
            sidebarOverlay.classList.remove('active');
            mobileToggle.classList.remove('active');
        } else {
            sidebar.classList.remove('collapsed');
        }
    });
}

function closeMobileSidebar() {
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (sidebar) sidebar.classList.remove('mobile-active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

// ==================== NAVIGATION ====================
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get page name from data attribute
            const pageName = this.getAttribute('data-page');
            
            // Show corresponding page
            showPage(pageName);
        });
    });
}

function showPage(pageName) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => page.style.display = 'none');
    
    // Show requested page
    const pageToShow = document.getElementById(`${pageName}-page`);
    if (pageToShow) {
        pageToShow.style.display = 'block';
        
        // Load page data
        loadPageData(pageName);
    } else {
        console.warn(`Page ${pageName} not found. Creating placeholder...`);
        createPlaceholderPage(pageName);
    }
}

function createPlaceholderPage(pageName) {
    const mainContent = document.getElementById('mainContent');
    
    // Create placeholder if page doesn't exist
    const existingPage = document.getElementById(`${pageName}-page`);
    if (!existingPage) {
        const placeholderHTML = `
            <div id="${pageName}-page" class="page-content">
                <div class="header">
                    <h1>${capitalizeFirst(pageName)} Management</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="openModal('${pageName}Modal')">
                            <i class="fas fa-plus"></i>
                            Add New ${capitalizeFirst(pageName.replace(/s$/, ''))}
                        </button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">${capitalizeFirst(pageName)} List</h3>
                    </div>
                    <div class="table-container">
                        <p style="padding: 20px; text-align: center; color: #636e72;">
                            ${capitalizeFirst(pageName)} management content will be displayed here.
                        </p>
                    </div>
                </div>
            </div>
        `;
        mainContent.insertAdjacentHTML('beforeend', placeholderHTML);
        
        // Show the newly created page
        document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
        document.getElementById(`${pageName}-page`).style.display = 'block';
    }
}

function loadPageData(pageName) {
    switch(pageName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'clubs':
            loadClubsData();
            break;
        case 'facilities':
            loadFacilitiesData();
            break;
        case 'activities':
            loadActivitiesData();
            break;
        case 'members':
            loadMembersData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'attendance':
            loadAttendanceData();
            break;
        case 'staff':
            loadStaffData();
            break;
        case 'subscriptions':
            loadSubscriptionsData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// ==================== MODAL FUNCTIONALITY ====================
function initializeModals() {
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// ==================== TABLE ACTIONS ====================
function initializeTableActions() {
    // View buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn.view')) {
            const btn = e.target.closest('.action-btn.view');
            handleView(btn);
        }
    });
    
    // Edit buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn.edit')) {
            const btn = e.target.closest('.action-btn.edit');
            handleEdit(btn);
        }
    });
    
    // Delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn.delete')) {
            const btn = e.target.closest('.action-btn.delete');
            handleDelete(btn);
        }
    });
}

function handleView(btn) {
    const row = btn.closest('tr');
    if (row) {
        showNotification('View feature will be implemented', 'info');
    }
}

function handleEdit(btn) {
    const row = btn.closest('tr');
    if (row) {
        showNotification('Edit feature will be implemented', 'info');
    }
}

function handleDelete(btn) {
    const row = btn.closest('tr');
    if (row) {
        if (confirm('Are you sure you want to delete this item?')) {
            row.remove();
            showNotification('Item deleted successfully', 'success');
        }
    }
}

// ==================== DASHBOARD DATA ====================
function loadDashboardData() {
    console.log('Dashboard data loaded');
}

// ==================== CLUBS DATA ====================
function loadClubsData() {
    console.log('Clubs data loaded');
}

function submitClubForm() {
    const form = document.getElementById('clubForm');
    if (form.checkValidity()) {
        // Here you would typically send data to server
        showNotification('Club added successfully!', 'success');
        closeModal('clubModal');
        form.reset();
    } else {
        form.reportValidity();
    }
}

// ==================== FACILITIES DATA ====================
function loadFacilitiesData() {
    const mainContent = document.getElementById('mainContent');
    const existingPage = document.getElementById('facilities-page');
    
    if (!existingPage) {
        const facilitiesHTML = `
            <div id="facilities-page" class="page-content">
                <div class="header">
                    <h1>Facilities Management</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="openModal('facilityModal')">
                            <i class="fas fa-plus"></i>
                            Add New Facility
                        </button>
                    </div>
                </div>

                <div class="search-filter-bar">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search facilities...">
                    </div>
                    <select class="filter-select">
                        <option value="">All Clubs</option>
                        <option value="1">Al-Majd Sports Club</option>
                        <option value="2">Royal Fitness Center</option>
                        <option value="3">Champion Sports Complex</option>
                    </select>
                    <select class="filter-select">
                        <option value="">All Types</option>
                        <option value="gym">Gym</option>
                        <option value="pool">Swimming Pool</option>
                        <option value="court">Sports Court</option>
                        <option value="studio">Studio</option>
                    </select>
                    <select class="filter-select">
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">All Facilities</h3>
                        <span style="color: #636e72; font-size: 14px;">Total: 48 facilities</span>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Facility Name</th>
                                    <th>Club</th>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Activities</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Olympic Pool</strong></td>
                                    <td>Al-Majd Sports Club</td>
                                    <td><span class="badge badge-info">Pool</span></td>
                                    <td>50 persons</td>
                                    <td>3 activities</td>
                                    <td><span class="badge badge-success">Available</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Main Gym</strong></td>
                                    <td>Royal Fitness Center</td>
                                    <td><span class="badge badge-info">Gym</span></td>
                                    <td>80 persons</td>
                                    <td>5 activities</td>
                                    <td><span class="badge badge-warning">Occupied</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Tennis Court #1</strong></td>
                                    <td>Al-Majd Sports Club</td>
                                    <td><span class="badge badge-info">Court</span></td>
                                    <td>4 persons</td>
                                    <td>2 activities</td>
                                    <td><span class="badge badge-success">Available</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Yoga Studio</strong></td>
                                    <td>Royal Fitness Center</td>
                                    <td><span class="badge badge-info">Studio</span></td>
                                    <td>30 persons</td>
                                    <td>4 activities</td>
                                    <td><span class="badge badge-success">Available</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Basketball Court</strong></td>
                                    <td>Champion Sports Complex</td>
                                    <td><span class="badge badge-info">Court</span></td>
                                    <td>20 persons</td>
                                    <td>2 activities</td>
                                    <td><span class="badge badge-danger">Maintenance</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Facility Modal -->
            <div class="modal" id="facilityModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Add New Facility</h2>
                        <button class="modal-close" onclick="closeModal('facilityModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="facilityForm">
                            <div class="form-group">
                                <label>Club *</label>
                                <select class="form-control" required>
                                    <option value="">Select club</option>
                                    <option value="1">Al-Majd Sports Club</option>
                                    <option value="2">Royal Fitness Center</option>
                                    <option value="3">Champion Sports Complex</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Facility Name *</label>
                                <input type="text" class="form-control" placeholder="e.g., Olympic Pool" required>
                            </div>
                            <div class="form-group">
                                <label>Facility Type *</label>
                                <select class="form-control" required>
                                    <option value="">Select type</option>
                                    <option value="gym">Gym</option>
                                    <option value="pool">Swimming Pool</option>
                                    <option value="court">Sports Court</option>
                                    <option value="studio">Studio</option>
                                    <option value="track">Running Track</option>
                                    <option value="field">Sports Field</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Capacity *</label>
                                <input type="number" class="form-control" placeholder="Maximum capacity" required>
                            </div>
                            <div class="form-group">
                                <label>Operating Hours *</label>
                                <input type="text" class="form-control" placeholder="e.g., 6:00 AM - 10:00 PM" required>
                            </div>
                            <div class="form-group">
                                <label>Status *</label>
                                <select class="form-control" required>
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Under Maintenance</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea class="form-control" placeholder="Enter facility description"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeModal('facilityModal')">Cancel</button>
                        <button class="btn btn-primary" onclick="submitFacilityForm()">
                            <i class="fas fa-save"></i>
                            Save Facility
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        mainContent.insertAdjacentHTML('beforeend', facilitiesHTML);
    }
    
    // Hide all pages and show facilities page
    document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
    document.getElementById('facilities-page').style.display = 'block';
}

function submitFacilityForm() {
    const form = document.getElementById('facilityForm');
    if (form.checkValidity()) {
        showNotification('Facility added successfully!', 'success');
        closeModal('facilityModal');
        form.reset();
    } else {
        form.reportValidity();
    }
}

// ==================== ACTIVITIES DATA ====================
function loadActivitiesData() {
    const mainContent = document.getElementById('mainContent');
    const existingPage = document.getElementById('activities-page');
    
    if (!existingPage) {
        const activitiesHTML = `
            <div id="activities-page" class="page-content">
                <div class="header">
                    <h1>Activities Management</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="openModal('activityModal')">
                            <i class="fas fa-plus"></i>
                            Add New Activity
                        </button>
                    </div>
                </div>

                <div class="search-filter-bar">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search activities...">
                    </div>
                    <select class="filter-select">
                        <option value="">All Facilities</option>
                        <option value="1">Olympic Pool</option>
                        <option value="2">Main Gym</option>
                        <option value="3">Tennis Court #1</option>
                    </select>
                    <select class="filter-select">
                        <option value="">All Categories</option>
                        <option value="fitness">Fitness</option>
                        <option value="aquatics">Aquatics</option>
                        <option value="sports">Sports</option>
                        <option value="wellness">Wellness</option>
                    </select>
                    <select class="filter-select">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">All Activities</h3>
                        <span style="color: #636e72; font-size: 14px;">Total: 156 activities</span>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Activity Name</th>
                                    <th>Facility</th>
                                    <th>Category</th>
                                    <th>Instructor</th>
                                    <th>Schedule</th>
                                    <th>Duration</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Swimming Lessons</strong></td>
                                    <td>Olympic Pool</td>
                                    <td><span class="badge badge-info">Aquatics</span></td>
                                    <td>Coach Ahmed</td>
                                    <td>Mon, Wed, Fri - 10:00 AM</td>
                                    <td>60 min</td>
                                    <td>15/20</td>
                                    <td><span class="badge badge-success">Active</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>CrossFit Training</strong></td>
                                    <td>Main Gym</td>
                                    <td><span class="badge badge-info">Fitness</span></td>
                                    <td>Coach Sarah</td>
                                    <td>Daily - 6:00 PM</td>
                                    <td>45 min</td>
                                    <td>25/30</td>
                                    <td><span class="badge badge-success">Active</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Tennis Coaching</strong></td>
                                    <td>Tennis Court #1</td>
                                    <td><span class="badge badge-info">Sports</span></td>
                                    <td>Coach Mohammed</td>
                                    <td>Tue, Thu - 2:00 PM</td>
                                    <td>90 min</td>
                                    <td>3/4</td>
                                    <td><span class="badge badge-warning">Scheduled</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Yoga Classes</strong></td>
                                    <td>Yoga Studio</td>
                                    <td><span class="badge badge-info">Wellness</span></td>
                                    <td>Coach Fatima</td>
                                    <td>Mon, Wed, Fri - 7:00 AM</td>
                                    <td>60 min</td>
                                    <td>20/30</td>
                                    <td><span class="badge badge-success">Active</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Zumba Dance</strong></td>
                                    <td>Dance Studio</td>
                                    <td><span class="badge badge-info">Fitness</span></td>
                                    <td>Coach Layla</td>
                                    <td>Tue, Thu, Sat - 5:00 PM</td>
                                    <td>50 min</td>
                                    <td>18/25</td>
                                    <td><span class="badge badge-success">Active</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn edit" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn delete" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Activity Modal -->
            <div class="modal" id="activityModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Add New Activity</h2>
                        <button class="modal-close" onclick="closeModal('activityModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="activityForm">
                            <div class="form-group">
                                <label>Facility *</label>
                                <select class="form-control" required>
                                    <option value="">Select facility</option>
                                    <option value="1">Olympic Pool</option>
                                    <option value="2">Main Gym</option>
                                    <option value="3">Tennis Court #1</option>
                                    <option value="4">Yoga Studio</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Activity Name *</label>
                                <input type="text" class="form-control" placeholder="e.g., Swimming Lessons" required>
                            </div>
                            <div class="form-group">
                                <label>Category *</label>
                                <select class="form-control" required>
                                    <option value="">Select category</option>
                                    <option value="fitness">Fitness</option>
                                    <option value="aquatics">Aquatics</option>
                                    <option value="sports">Sports</option>
                                    <option value="wellness">Wellness</option>
                                    <option value="martial-arts">Martial Arts</option>
                                    <option value="dance">Dance</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Instructor *</label>
                                <select class="form-control" required>
                                    <option value="">Select instructor</option>
                                    <option value="1">Coach Ahmed</option>
                                    <option value="2">Coach Sarah</option>
                                    <option value="3">Coach Mohammed</option>
                                    <option value="4">Coach Fatima</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Schedule Days *</label>
                                <select class="form-control" multiple style="height: 120px;" required>
                                    <option value="monday">Monday</option>
                                    <option value="tuesday">Tuesday</option>
                                    <option value="wednesday">Wednesday</option>
                                    <option value="thursday">Thursday</option>
                                    <option value="friday">Friday</option>
                                    <option value="saturday">Saturday</option>
                                    <option value="sunday">Sunday</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Time *</label>
                                <input type="time" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Duration (minutes) *</label>
                                <input type="number" class="form-control" placeholder="60" required>
                            </div>
                            <div class="form-group">
                                <label>Capacity *</label>
                                <input type="number" class="form-control" placeholder="Maximum participants" required>
                            </div>
                            <div class="form-group">
                                <label>Price (SAR)</label>
                                <input type="number" class="form-control" placeholder="0.00" step="0.01">
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea class="form-control" placeholder="Enter activity description"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeModal('activityModal')">Cancel</button>
                        <button class="btn btn-primary" onclick="submitActivityForm()">
                            <i class="fas fa-save"></i>
                            Save Activity
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        mainContent.insertAdjacentHTML('beforeend', activitiesHTML);
    }
    
    // Hide all pages and show activities page
    document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
    document.getElementById('activities-page').style.display = 'block';
}

function submitActivityForm() {
    const form = document.getElementById('activityForm');
    if (form.checkValidity()) {
        showNotification('Activity added successfully!', 'success');
        closeModal('activityModal');
        form.reset();
    } else {
        form.reportValidity();
    }
}

// ==================== MEMBERS DATA ====================
function loadMembersData() {
    console.log('Members data loaded - placeholder');
}

// ==================== BOOKINGS DATA ====================
function loadBookingsData() {
    console.log('Bookings data loaded - placeholder');
}

// ==================== ATTENDANCE DATA ====================
function loadAttendanceData() {
    console.log('Attendance data loaded - placeholder');
}

// ==================== STAFF DATA ====================
function loadStaffData() {
    console.log('Staff data loaded - placeholder');
}

// ==================== SUBSCRIPTIONS DATA ====================
function loadSubscriptionsData() {
    console.log('Subscriptions data loaded - placeholder');
}

// ==================== REPORTS DATA ====================
function loadReportsData() {
    console.log('Reports data loaded - placeholder');
}

// ==================== SETTINGS DATA ====================
function loadSettingsData() {
    console.log('Settings data loaded - placeholder');
}

// ==================== UTILITIES ====================
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation keyframes if not exists
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.submitClubForm = submitClubForm;
window.submitFacilityForm = submitFacilityForm;
window.submitActivityForm = submitActivityForm;
window.showNotification = showNotification;
