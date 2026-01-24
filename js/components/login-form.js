import { API_CONFIG } from '../config/settings.js';

// Login Form Component
class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.isLoading = false;
        this.error = null;
        this.successMessage = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        const isLoggedIn = !!token;

        this.innerHTML = `
      <div class="ui segment">
        <h2 class="ui header">
          <i class="sign in icon" aria-hidden="true"></i>
          <div class="content">
            ${isLoggedIn ? 'Logged In' : 'Login'}
          </div>
        </h2>

        ${this.error ? `
          <div class="ui negative message" role="alert">
            <div class="header">Login Failed</div>
            <p>${this.error}</p>
          </div>
        ` : ''}

        ${this.successMessage ? `
          <div class="ui positive message" role="alert">
            <div class="header">Success</div>
            <p>${this.successMessage}</p>
          </div>
        ` : ''}

        ${isLoggedIn ? `
          <div class="ui info message">
            <div class="header">
              <i class="user icon" aria-hidden="true"></i>
              Currently Logged In
            </div>
            <p><strong>Username:</strong> ${userEmail || 'Unknown'}</p>
            <p><strong>Token:</strong> <code style="word-break: break-all;">${token.substring(0, 50)}...</code></p>
          </div>
          <button class="ui red button" id="logout-btn" aria-label="Logout">
            <i class="sign out icon" aria-hidden="true"></i>
            Logout
          </button>
        ` : `
          <form class="ui form" id="login-form" aria-label="Login form">
            <div class="field">
              <label for="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value="user"
                placeholder="User" 
                required 
                aria-required="true"
                ${this.isLoading ? 'disabled' : ''}
              >
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value="user"
                placeholder="Enter password" 
                required 
                aria-required="true"
                ${this.isLoading ? 'disabled' : ''}
              >
            </div>
            <button 
              type="submit" 
              class="ui primary button ${this.isLoading ? 'loading disabled' : ''}" 
              aria-label="Login"
            >
              <i class="sign in icon" aria-hidden="true"></i>
              ${this.isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div class="ui message">
            <div class="header">Demo Credentials</div>
            <p><strong>Username:</strong> User</p>
            <p><strong>Password:</strong> user</p>
            <p class="ui small text">Note: These are example credentials. Check backend API documentation for actual test accounts.</p>
          </div>
        `}
      </div>
    `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const form = this.querySelector('#login-form');
        const logoutBtn = this.querySelector('#logout-btn');

        if (form) {
            form.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogin(event) {
        event.preventDefault();

        const username = this.querySelector('#username').value.trim();
        const password = this.querySelector('#password').value;

        if (!username || !password) {
            this.error = 'Username and password are required';
            this.render();
            return;
        }

        this.isLoading = true;
        this.error = null;
        this.successMessage = null;
        this.render();

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid username or password');
                } else if (response.status === 404) {
                    throw new Error('Login endpoint not found. Check backend API documentation.');
                } else {
                    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();

            if (!data.accessToken) {
                throw new Error('No access token received from server');
            }

            // Store token and user info
            localStorage.setItem('authToken', data.accessToken);
            localStorage.setItem('userEmail', username);

            this.successMessage = 'Login successful! You can now access protected endpoints.';
            this.error = null;

            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('auth-changed', {
                detail: { loggedIn: true, username }
            }));

        } catch (error) {
            console.error('Login error:', error);
            this.error = error.message;
        } finally {
            this.isLoading = false;
            this.render();
        }
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');

        this.successMessage = null;
        this.error = null;

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('auth-changed', {
            detail: { loggedIn: false }
        }));

        this.render();
    }
}

// Register the custom element
customElements.define('login-form', LoginForm);
