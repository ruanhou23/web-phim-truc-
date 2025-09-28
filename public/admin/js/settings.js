// ===== SETTINGS MANAGEMENT =====

let settings = {
    general: {
        siteName: 'NhanPhim',
        siteDescription: 'Nền tảng xem phim trực tuyến hàng đầu Việt Nam',
        siteUrl: 'https://nhanphim.com',
        moviesPerPage: 20,
        autoApprove: true,
        maxFileSize: 500
    },
    security: {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        require2FA: false,
        apiRateLimit: 100,
        enableCORS: true
    },
    notifications: {
        emailNotifications: true,
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: '',
        smtpPassword: '',
        newUserNotification: true,
        newMovieNotification: true,
        errorNotification: true
    },
    appearance: {
        theme: 'dark',
        primaryColor: '#667eea',
        language: 'vi',
        logoUrl: '',
        faviconUrl: ''
    },
    backup: {
        autoBackup: true,
        backupFrequency: 'weekly',
        backupRetention: 30
    }
};

let backups = [
    {
        id: 1,
        name: 'backup_2024_01_15_143022',
        date: '2024-01-15 14:30:22',
        size: '2.3 MB',
        type: 'full'
    },
    {
        id: 2,
        name: 'backup_2024_01_14_090000',
        date: '2024-01-14 09:00:00',
        size: '1.8 MB',
        type: 'incremental'
    }
];

let currentTab = 'general';

// Initialize immediately when script loads
(function() {
    console.log('Settings script loaded');
    
    // Try to initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSettingsPage);
    } else {
        // DOM already loaded
        initializeSettingsPage();
    }
})();

function initializeSettingsPage() {
    setupEventListeners();
    loadSettings();
    renderBackupList();
}

function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Tab switching - use event delegation for better reliability
    const settingsContent = document.querySelector('.settings-content');
    if (settingsContent) {
        settingsContent.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn') || e.target.closest('.tab-btn')) {
                e.preventDefault();
                const btn = e.target.classList.contains('tab-btn') ? e.target : e.target.closest('.tab-btn');
                const tabId = btn.getAttribute('data-tab');
                console.log('Tab button clicked:', tabId);
                if (tabId) {
                    switchTab(tabId);
                }
            }
        });
    }

    // Save settings button
    const saveBtn = document.getElementById('save-settings');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }

    // Backup actions
    const createBackupBtn = document.getElementById('create-backup');
    if (createBackupBtn) {
        createBackupBtn.addEventListener('click', createBackup);
    }

    const restoreBackupBtn = document.getElementById('restore-backup');
    if (restoreBackupBtn) {
        restoreBackupBtn.addEventListener('click', restoreBackup);
    }
}

function switchTab(tabId) {
    console.log('Switching to tab:', tabId);
    
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Find and activate selected tab and content
    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    const selectedContent = document.getElementById(`${tabId}-tab`);
    
    console.log('Selected tab element:', selectedTab);
    console.log('Selected content element:', selectedContent);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
        currentTab = tabId;
        
        console.log('Tab switched successfully to:', tabId);
        
        if (tabId === 'backup') {
            renderBackupList();
        }
    } else {
        console.error('Tab or content element not found for:', tabId);
    }
}

function loadSettings() {
    // Load settings from API
    fetch('/api/admin/settings')
        .then(response => response.json())
        .then(data => {
            settings = data;
            populateSettingsForm();
        })
        .catch(error => {
            console.error('Error loading settings:', error);
            populateSettingsForm(); // Fallback to default settings
        });
}

function populateSettingsForm() {
    // Load general settings
    document.getElementById('site-name').value = settings.general.siteName;
    document.getElementById('site-description').value = settings.general.siteDescription;
    document.getElementById('site-url').value = settings.general.siteUrl;
    document.getElementById('movies-per-page').value = settings.general.moviesPerPage;
    document.getElementById('auto-approve').checked = settings.general.autoApprove;
    document.getElementById('max-file-size').value = settings.general.maxFileSize;

    // Load security settings
    document.getElementById('session-timeout').value = settings.security.sessionTimeout;
    document.getElementById('max-login-attempts').value = settings.security.maxLoginAttempts;
    document.getElementById('require-2fa').checked = settings.security.require2FA;
    document.getElementById('api-rate-limit').value = settings.security.apiRateLimit;
    document.getElementById('enable-cors').checked = settings.security.enableCORS;

    // Load notification settings
    document.getElementById('email-notifications').checked = settings.notifications.emailNotifications;
    document.getElementById('smtp-host').value = settings.notifications.smtpHost;
    document.getElementById('smtp-port').value = settings.notifications.smtpPort;
    document.getElementById('smtp-username').value = settings.notifications.smtpUsername;
    document.getElementById('smtp-password').value = settings.notifications.smtpPassword;
    document.getElementById('new-user-notification').checked = settings.notifications.newUserNotification;
    document.getElementById('new-movie-notification').checked = settings.notifications.newMovieNotification;
    document.getElementById('error-notification').checked = settings.notifications.errorNotification;

    // Load appearance settings
    document.getElementById('theme').value = settings.appearance.theme;
    document.getElementById('primary-color').value = settings.appearance.primaryColor;
    document.getElementById('language').value = settings.appearance.language;
    document.getElementById('logo-url').value = settings.appearance.logoUrl;
    document.getElementById('favicon-url').value = settings.appearance.faviconUrl;

    // Load backup settings
    document.getElementById('auto-backup').checked = settings.backup.autoBackup;
    document.getElementById('backup-frequency').value = settings.backup.backupFrequency;
    document.getElementById('backup-retention').value = settings.backup.backupRetention;
}

function saveSettings() {
    const saveBtn = document.getElementById('save-settings');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    saveBtn.disabled = true;

    const newSettings = {
        general: {
            siteName: document.getElementById('site-name').value,
            siteDescription: document.getElementById('site-description').value,
            siteUrl: document.getElementById('site-url').value,
            moviesPerPage: parseInt(document.getElementById('movies-per-page').value),
            autoApprove: document.getElementById('auto-approve').checked,
            maxFileSize: parseInt(document.getElementById('max-file-size').value)
        },
        security: {
            sessionTimeout: parseInt(document.getElementById('session-timeout').value),
            maxLoginAttempts: parseInt(document.getElementById('max-login-attempts').value),
            require2FA: document.getElementById('require-2fa').checked,
            apiRateLimit: parseInt(document.getElementById('api-rate-limit').value),
            enableCORS: document.getElementById('enable-cors').checked
        },
        notifications: {
            emailNotifications: document.getElementById('email-notifications').checked,
            smtpHost: document.getElementById('smtp-host').value,
            smtpPort: parseInt(document.getElementById('smtp-port').value),
            smtpUsername: document.getElementById('smtp-username').value,
            smtpPassword: document.getElementById('smtp-password').value,
            newUserNotification: document.getElementById('new-user-notification').checked,
            newMovieNotification: document.getElementById('new-movie-notification').checked,
            errorNotification: document.getElementById('error-notification').checked
        },
        appearance: {
            theme: document.getElementById('theme').value,
            primaryColor: document.getElementById('primary-color').value,
            language: document.getElementById('language').value,
            logoUrl: document.getElementById('logo-url').value,
            faviconUrl: document.getElementById('favicon-url').value
        },
        backup: {
            autoBackup: document.getElementById('auto-backup').checked,
            backupFrequency: document.getElementById('backup-frequency').value,
            backupRetention: parseInt(document.getElementById('backup-retention').value)
        }
    };

    // Save settings via API
    fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            settings = { ...settings, ...newSettings };
            localStorage.setItem('adminSettings', JSON.stringify(settings));
            showNotification(data.message, 'success');
            applyThemeChanges(newSettings.appearance);
        } else {
            showNotification('Lỗi khi lưu cài đặt!', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving settings:', error);
        showNotification('Lỗi kết nối khi lưu cài đặt!', 'error');
    })
    .finally(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    });
}

function applyThemeChanges(appearance) {
    if (appearance.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', appearance.primaryColor);
    }

    if (appearance.theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (appearance.theme === 'light') {
        document.body.classList.remove('dark-theme');
    }
}

function createBackup() {
    const createBtn = document.getElementById('create-backup');
    const originalText = createBtn.innerHTML;
    
    createBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tạo...';
    createBtn.disabled = true;

    setTimeout(() => {
        const now = new Date();
        const backupName = `backup_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        
        const newBackup = {
            id: backups.length + 1,
            name: backupName,
            date: now.toLocaleString('vi-VN'),
            size: '2.1 MB',
            type: 'full'
        };
        
        backups.unshift(newBackup);
        renderBackupList();
        showNotification('Sao lưu đã được tạo thành công!', 'success');
        
        createBtn.innerHTML = originalText;
        createBtn.disabled = false;
    }, 2000);
}

function restoreBackup() {
    showBackupSelectionModal();
}

function showBackupSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chọn bản sao lưu để khôi phục</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="backup-selection-list">
                    ${backups.map(backup => `
                        <div class="backup-selection-item" data-backup-id="${backup.id}">
                            <div class="backup-info">
                                <div class="backup-name">${backup.name}</div>
                                <div class="backup-date">${backup.date}</div>
                                <div class="backup-size">${backup.size}</div>
                            </div>
                            <button class="btn btn-primary" onclick="confirmRestore(${backup.id})">
                                <i class="fas fa-upload"></i>
                                Khôi phục
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function confirmRestore(backupId) {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;
    
    if (confirm(`Bạn có chắc chắn muốn khôi phục từ bản sao lưu "${backup.name}"?`)) {
        showNotification('Đang khôi phục dữ liệu...', 'info');
        
        setTimeout(() => {
            showNotification('Khôi phục dữ liệu thành công!', 'success');
            document.querySelector('.modal').remove();
        }, 3000);
    }
}

function renderBackupList() {
    const backupList = document.getElementById('backup-list');
    if (!backupList) return;
    
    if (backups.length === 0) {
        backupList.innerHTML = `
            <div class="no-backups">
                <i class="fas fa-database"></i>
                <p>Chưa có bản sao lưu nào</p>
            </div>
        `;
        return;
    }
    
    backupList.innerHTML = backups.map(backup => `
        <div class="backup-item">
            <div class="backup-info">
                <div class="backup-name">${backup.name}</div>
                <div class="backup-date">${backup.date}</div>
                <div class="backup-size">${backup.size} • ${backup.type}</div>
            </div>
            <div class="backup-actions-item">
                <button class="btn-icon btn-download" onclick="downloadBackup(${backup.id})" title="Tải xuống">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteBackup(${backup.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function downloadBackup(backupId) {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;
    
    showNotification(`Đang tải xuống ${backup.name}...`, 'info');
    
    setTimeout(() => {
        showNotification('Tải xuống thành công!', 'success');
    }, 1000);
}

function deleteBackup(backupId) {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;
    
    if (confirm(`Bạn có chắc chắn muốn xóa bản sao lưu "${backup.name}"?`)) {
        backups = backups.filter(b => b.id !== backupId);
        renderBackupList();
        showNotification('Bản sao lưu đã được xóa!', 'success');
    }
}

// Load settings from localStorage
function loadSettingsFromStorage() {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
        try {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        } catch (error) {
            console.error('Error loading settings from storage:', error);
        }
    }
}

loadSettingsFromStorage();