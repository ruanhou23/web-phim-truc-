// Auth JavaScript - Xử lý đăng nhập và đăng ký với Firebase
class AuthManager {
    constructor() {
        this.currentMode = 'login';
        this.auth = null;
        this.db = null;
        this.googleProvider = null;
        this.authMethods = null;
        this.init();
    }

    init() {
        // Wait for Firebase to be available
        this.waitForFirebase().then(() => {
            this.setupEventListeners();
            this.setupFormValidation();
            this.setupPasswordStrength();
            this.setupPasswordToggle();
            this.setupAuthStateListener();
        });
    }

    async waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.firebaseAuth && window.firebaseDb && window.firebaseAuthMethods) {
                    this.auth = window.firebaseAuth;
                    this.db = window.firebaseDb;
                    this.googleProvider = window.googleProvider;
                    this.authMethods = window.firebaseAuthMethods;
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    setupEventListeners() {
        // Toggle between login and register
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Forgot password
        document.querySelector('.forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = e.target.closest('.social-btn').classList.contains('google-btn') ? 'google' : 'facebook';
                this.handleSocialLogin(provider);
            });
        });

        // Real-time validation
        this.setupRealTimeValidation();
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${mode}-form`).classList.add('active');

        // Clear all errors
        this.clearAllErrors();
        this.clearAllInputs();
    }

    setupAuthStateListener() {
        this.authMethods.onAuthStateChanged(this.auth, (user) => {
            if (user) {
                console.log('User is signed in:', user);
                // User is signed in, redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                console.log('User is signed out');
            }
        });
    }

    setupFormValidation() {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

        // Phone validation (Vietnamese format)
        const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;

        this.validators = {
            email: (value) => emailRegex.test(value),
            password: (value) => passwordRegex.test(value),
            phone: (value) => phoneRegex.test(value),
            name: (value) => value.trim().length >= 2,
            confirmPassword: (value) => {
                const password = document.getElementById('register-password').value;
                return value === password;
            }
        };
    }

    setupRealTimeValidation() {
        // Email validation
        ['login-email', 'register-email'].forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('blur', () => {
                this.validateField(input, 'email');
            });
        });

        // Name validation
        const nameInput = document.getElementById('register-name');
        nameInput.addEventListener('blur', () => {
            this.validateField(nameInput, 'name');
        });

        // Phone validation
        const phoneInput = document.getElementById('register-phone');
        phoneInput.addEventListener('blur', () => {
            this.validateField(phoneInput, 'phone');
        });

        // Password validation
        const passwordInput = document.getElementById('register-password');
        passwordInput.addEventListener('input', () => {
            this.updatePasswordStrength();
            this.validateField(passwordInput, 'password');
        });

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('register-confirm-password');
        confirmPasswordInput.addEventListener('blur', () => {
            this.validateField(confirmPasswordInput, 'confirmPassword');
        });
    }

    validateField(input, type) {
        const value = input.value.trim();
        const isValid = this.validators[type](value);
        const errorElement = document.getElementById(input.id + '-error');
        
        if (isValid) {
            this.showFieldSuccess(input);
            this.hideError(errorElement);
        } else {
            this.showFieldError(input, this.getErrorMessage(type));
            this.showError(errorElement, this.getErrorMessage(type));
        }
        
        return isValid;
    }

    getErrorMessage(type) {
        const messages = {
            email: 'Email không hợp lệ',
            password: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
            phone: 'Số điện thoại không hợp lệ (VD: 0123456789)',
            name: 'Tên phải có ít nhất 2 ký tự',
            confirmPassword: 'Mật khẩu xác nhận không khớp'
        };
        return messages[type] || 'Giá trị không hợp lệ';
    }

    showFieldError(input, message) {
        input.classList.add('error');
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#fff5f5';
    }

    showFieldSuccess(input) {
        input.classList.remove('error');
        input.style.borderColor = '#28a745';
        input.style.backgroundColor = '#f8fff9';
    }

    showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    hideError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    clearAllErrors() {
        document.querySelectorAll('.form-error').forEach(error => {
            this.hideError(error);
        });
        
        document.querySelectorAll('.form-group input').forEach(input => {
            input.classList.remove('error');
            input.style.borderColor = '';
            input.style.backgroundColor = '';
        });
    }

    clearAllInputs() {
        document.querySelectorAll('.auth-form input').forEach(input => {
            input.value = '';
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('register-password');
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');

        passwordInput.addEventListener('input', () => {
            this.updatePasswordStrength();
        });
    }

    updatePasswordStrength() {
        const password = document.getElementById('register-password').value;
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        let strength = 0;
        let strengthClass = 'weak';
        let strengthLabel = 'Mật khẩu yếu';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength >= 4) {
            strengthClass = 'strong';
            strengthLabel = 'Mật khẩu mạnh';
        } else if (strength >= 3) {
            strengthClass = 'good';
            strengthLabel = 'Mật khẩu tốt';
        } else if (strength >= 2) {
            strengthClass = 'fair';
            strengthLabel = 'Mật khẩu trung bình';
        }

        strengthFill.className = `strength-fill ${strengthClass}`;
        strengthText.className = `strength-text ${strengthClass}`;
        strengthText.textContent = strengthLabel;
    }

    setupPasswordToggle() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const targetId = e.target.closest('.password-toggle').dataset.target;
                const input = document.getElementById(targetId);
                const icon = e.target.closest('.password-toggle').querySelector('.eye-icon');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.textContent = '🙈';
                } else {
                    input.type = 'password';
                    icon.textContent = '👁️';
                }
            });
        });
    }

    async handleLogin() {
        const form = document.getElementById('login-form');
        const formData = new FormData(form);
        
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = document.getElementById('remember-me').checked;

        // Validate form
        if (!this.validateField(document.getElementById('login-email'), 'email')) {
            return;
        }

        if (!password) {
            this.showError(document.getElementById('login-password-error'), 'Vui lòng nhập mật khẩu');
            return;
        }

        this.setLoading('login-form', true);

        try {
            // Use Firebase Authentication
            const userCredential = await this.authMethods.signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            this.showSuccess('Đăng nhập thành công!');
            
            // Store user data
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            
            if (rememberMe) {
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('user', JSON.stringify(userData));
            }
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Có lỗi xảy ra khi đăng nhập';
            
            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Không tìm thấy tài khoản với email này';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Mật khẩu không chính xác';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email không hợp lệ';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Tài khoản đã bị vô hiệu hóa';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau';
                    break;
            }
            
            this.showError(document.getElementById('login-password-error'), errorMessage);
        } finally {
            this.setLoading('login-form', false);
        }
    }

    async handleRegister() {
        const form = document.getElementById('register-form');
        const formData = new FormData(form);
        
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const agreeTerms = document.getElementById('agree-terms').checked;

        // Validate all fields
        const isNameValid = this.validateField(document.getElementById('register-name'), 'name');
        const isEmailValid = this.validateField(document.getElementById('register-email'), 'email');
        const isPhoneValid = this.validateField(document.getElementById('register-phone'), 'phone');
        const isPasswordValid = this.validateField(document.getElementById('register-password'), 'password');
        const isConfirmPasswordValid = this.validateField(document.getElementById('register-confirm-password'), 'confirmPassword');

        if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        if (!agreeTerms) {
            this.showError(document.getElementById('register-confirm-password-error'), 'Vui lòng đồng ý với điều khoản sử dụng');
            return;
        }

        this.setLoading('register-form', true);

        try {
            // Use Firebase Authentication
            const userCredential = await this.authMethods.createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Update user profile with display name
            await user.updateProfile({
                displayName: name
            });
            
            // Save additional user data to Firestore
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js");
            await setDoc(doc(this.db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: name,
                phone: phone,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString()
            });
            
            this.showSuccess('Đăng ký thành công!');
            
            // Store user data
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: name,
                phone: phone
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Register error:', error);
            let errorMessage = 'Có lỗi xảy ra khi đăng ký';
            
            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email này đã được sử dụng';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email không hợp lệ';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Phương thức đăng ký này không được phép';
                    break;
            }
            
            this.showError(document.getElementById('register-email-error'), errorMessage);
        } finally {
            this.setLoading('register-form', false);
        }
    }

    async handleForgotPassword() {
        const email = prompt('Nhập email để đặt lại mật khẩu:');
        if (email && this.validators.email(email)) {
            try {
                await this.authMethods.sendPasswordResetEmail(this.auth, email);
                alert('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn!');
            } catch (error) {
                console.error('Password reset error:', error);
                let errorMessage = 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'Không tìm thấy tài khoản với email này';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Email không hợp lệ';
                        break;
                }
                
                alert(errorMessage);
            }
        } else if (email) {
            alert('Email không hợp lệ!');
        }
    }

    async handleSocialLogin(provider) {
        if (provider === 'google') {
            try {
                // Determine which form is active to show appropriate loading state
                const activeForm = document.querySelector('.auth-form.active');
                const formId = activeForm.id;
                this.setLoading(formId, true);
                
                const result = await this.authMethods.signInWithPopup(this.auth, this.googleProvider);
                const user = result.user;
                
                // Check if this is a new user (registration) or existing user (login)
                const { doc, setDoc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js");
                const userDoc = await getDoc(doc(this.db, 'users', user.uid));
                const isNewUser = !userDoc.exists();
                
                if (isNewUser) {
                    this.showSuccess('Đăng ký Google thành công!');
                    
                    // Save new user data to Firestore
                    await setDoc(doc(this.db, 'users', user.uid), {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        provider: 'google',
                        createdAt: new Date().toISOString(),
                        lastLoginAt: new Date().toISOString()
                    });
                } else {
                    this.showSuccess('Đăng nhập Google thành công!');
                    
                    // Update last login time for existing user
                    await setDoc(doc(this.db, 'users', user.uid), {
                        ...userDoc.data(),
                        lastLoginAt: new Date().toISOString()
                    }, { merge: true });
                }
                
                // Store user data
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                console.error('Google auth error:', error);
                let errorMessage = 'Có lỗi xảy ra khi đăng nhập Google';
                
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        errorMessage = 'Đăng nhập bị hủy bởi người dùng';
                        break;
                    case 'auth/popup-blocked':
                        errorMessage = 'Popup bị chặn. Vui lòng cho phép popup và thử lại';
                        break;
                    case 'auth/account-exists-with-different-credential':
                        errorMessage = 'Tài khoản đã tồn tại với phương thức đăng nhập khác';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = 'Đăng nhập Google không được phép';
                        break;
                }
                
                // Show error in appropriate form
                const activeForm = document.querySelector('.auth-form.active');
                const errorElement = activeForm.querySelector('.form-error');
                if (errorElement) {
                    this.showError(errorElement, errorMessage);
                } else {
                    alert(errorMessage);
                }
            } finally {
                // Reset loading state for active form
                const activeForm = document.querySelector('.auth-form.active');
                const formId = activeForm.id;
                this.setLoading(formId, false);
            }
        } else if (provider === 'facebook') {
            alert('Đăng nhập Facebook sẽ được thêm trong phiên bản tiếp theo!');
        }
    }

    setLoading(formId, isLoading) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('.auth-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    showSuccess(message) {
        // Remove existing success message
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        // Create new success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.textContent = message;

        // Insert after form title
        const form = document.querySelector('.auth-form.active');
        const title = form.querySelector('h2');
        title.insertAdjacentElement('afterend', successDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Export for use in other scripts
window.AuthManager = AuthManager;