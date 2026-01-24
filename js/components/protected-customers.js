import { API_CONFIG } from '../config/settings.js';

// Protected Customers Component - Demonstrates protected endpoint access with JWT
class ProtectedCustomers extends HTMLElement {
    constructor() {
        super();
        this.customers = [];
        this.isLoading = false;
        this.error = null;
    }

    connectedCallback() {
        this.render();

        // Listen for authentication changes
        window.addEventListener('auth-changed', () => this.render());
    }

    render() {
        const token = localStorage.getItem('authToken');
        const isLoggedIn = !!token;

        this.innerHTML = `
      <div class="ui segment">
        <h2 class="ui header">
          <i class="shield icon" aria-hidden="true"></i>
          <div class="content">
            Protected Customer Data
            <div class="sub header">Requires authentication token</div>
          </div>
        </h2>

        <button 
            class="ui primary button ${this.isLoading ? 'loading disabled' : ''}" 
            id="fetch-protected-btn"
            aria-label="Fetch protected customers"
          >
            <i class="download icon" aria-hidden="true"></i>
            ${this.isLoading ? 'Fetching...' : 'Fetch Protected Customers'}
          </button>

        ${this.error ? `
            <div class="ui negative message" role="alert">
              <div class="header">Error</div>
              <p>${this.error}</p>
              ${this.error.includes('401') || this.error.includes('Unauthorized') ? `
                <p><strong>Tip:</strong> Your token might be expired or invalid. Try logging in again.</p>
              ` : ''}
            </div>
          ` : ''}

        ${this.customers.length > 0 ? `
          <div class="ui positive message">
            <div class="header">
              <i class="check circle icon" aria-hidden="true"></i>
              Success!
            </div>
            <p>Successfully fetched ${this.customers.length} customers from protected endpoint (showing first 5).</p>
          </div>

          <table class="ui celled table" role="table" aria-label="Protected customers table">
            <thead>
              <tr>
                <th scope="col"><i class="hashtag icon" aria-hidden="true"></i>Customer ID</th>
                <th scope="col"><i class="building icon" aria-hidden="true"></i>Customer Name</th>
              </tr>
            </thead>
            <tbody>
              ${this.customers.map(customer => `
                <tr>
                  <td>
                    <div class="ui blue label">${customer.customerId || customer.CustomerId || 'N/A'}</div>
                  </td>
                  <td>
                    <strong>${customer.customerName || customer.CustomerName || 'N/A'}</strong>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        ${!this.isLoading && this.customers.length === 0 && !this.error ? `
          <div class="ui info message">
            <div class="header">
              <i class="info circle icon" aria-hidden="true"></i>
              ${isLoggedIn ? 'Ready to Fetch' : 'Test Without Token'}
            </div>
            <p>Click the button above to fetch customers from the protected endpoint.</p>
            <p><strong>Endpoint:</strong> <code>GET ${API_CONFIG.BASE_URL}/customers</code></p>
            ${isLoggedIn ? `
              <p><strong>Header:</strong> <code>Authorization: Bearer {token}</code></p>
              <p class="ui text"><i class="check icon"></i> You are logged in. This should return <strong>200 OK</strong>.</p>
            ` : `
              <p><strong>Header:</strong> <code>None (no token)</code></p>
              <p class="ui text"><i class="warning icon"></i> You are NOT logged in. This will return <strong>401 Unauthorized</strong>.</p>
            `}
          </div>
        ` : ''}
      </div>
    `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const fetchBtn = this.querySelector('#fetch-protected-btn');

        if (fetchBtn) {
            fetchBtn.addEventListener('click', () => this.fetchProtectedCustomers());
        }
    }

    async fetchProtectedCustomers() {
        const token = localStorage.getItem('authToken');

        this.isLoading = true;
        this.error = null;
        this.customers = [];
        this.render();

        try {
            // Try protected endpoint (without /public/)
            const headers = {
                'Content-Type': 'application/json',
            };

            // Only add Authorization header if token exists
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/customers`, {
                method: 'GET',
                headers,
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Invalid or expired token (401)');
                } else if (response.status === 403) {
                    throw new Error('Forbidden: You do not have permission to access this resource (403)');
                } else if (response.status === 404) {
                    throw new Error('Protected endpoint not found (404). The backend may not have protected customer endpoints, or they use a different path.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();

            // Handle both array and object responses
            const allCustomers = Array.isArray(data) ? data : (data.customers || data.data || []);

            // Only take first 5 customers
            this.customers = allCustomers.slice(0, 5);

            if (this.customers.length === 0) {
                this.error = 'No customers returned from protected endpoint.';
            }

        } catch (error) {
            console.error('Error fetching protected customers:', error);
            this.error = error.message;
        } finally {
            this.isLoading = false;
            this.render();
        }
    }
}

// Register the custom element
customElements.define('protected-customers', ProtectedCustomers);
