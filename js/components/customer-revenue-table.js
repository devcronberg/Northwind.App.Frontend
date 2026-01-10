// Customer Revenue Table Component using Fomantic UI
import { API_CONFIG } from '../config/settings.js';

class CustomerRevenueTable extends HTMLElement {
    constructor() {
        super();
        this.customers = [];
        this.loading = true;
        this.error = null;
    }

    static get observedAttributes() {
        return ['limit'];
    }

    connectedCallback() {
        this.render();
        this.fetchCustomers();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'limit' && oldValue !== newValue) {
            this.fetchCustomers();
        }
    }

    async fetchCustomers() {
        this.loading = true;
        this.error = null;
        this.render();

        try {
            const limit = parseInt(this.getAttribute('limit')) || 10;
            const url = `${API_CONFIG.BASE_URL}/public/customers-with-revenue?skip=0&take=${limit}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.customers = await response.json();
            this.loading = false;
            this.render();
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            this.error = error.message;
            this.loading = false;
            this.render();
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    }

    render() {
        this.innerHTML = this.renderContent();
    }

    renderContent() {
        if (this.loading) {
            return `
        <div class="ui segment" style="min-height: 300px;" role="status" aria-live="polite" aria-atomic="true">
          <div class="ui active inverted dimmer">
            <div class="ui large text loader">Loading customer data...</div>
          </div>
        </div>
      `;
        }

        if (this.error) {
            return `
        <div class="ui negative message" role="alert" aria-live="assertive">
          <div class="header">
            <i class="warning icon" aria-hidden="true"></i>
            Error Loading Data
          </div>
          <p>${this.error}</p>
          <p>Failed to fetch customer data from server.</p>
        </div>
      `;
        }

        if (!this.customers || this.customers.length === 0) {
            return `
        <div class="ui info message" role="status" aria-live="polite">
          <div class="header">No Data Available</div>
          <p>No customers found</p>
        </div>
      `;
        }

        return `
      <table class="ui celled striped table" role="table" aria-label="Top customers by revenue">
        <thead>
          <tr>
            <th scope="col"><i class="hashtag icon" aria-hidden="true"></i>Customer ID</th>
            <th scope="col"><i class="building icon" aria-hidden="true"></i>Customer Name</th>
            <th scope="col" class="center aligned"><i class="shopping cart icon" aria-hidden="true"></i>Order Count</th>
            <th scope="col" class="right aligned"><i class="dollar icon" aria-hidden="true"></i>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${this.customers.map((item) => `
            <tr>
              <td>
                <div class="ui blue label">${item.customer.customerId}</div>
              </td>
              <td>
                <h4 class="ui header">
                  <div class="content">
                    ${item.customer.customerName || 'N/A'}
                    ${item.customer.country ? `<div class="sub header"><i class="map marker alternate icon" aria-hidden="true"></i>${item.customer.country}</div>` : ''}
                  </div>
                </h4>
              </td>
              <td class="center aligned">
                <div class="ui circular teal label">${item.totalOrderCount}</div>
              </td>
              <td class="right aligned">
                <strong style="color: #21ba45; font-size: 1.1em;">${this.formatCurrency(item.totalRevenue)}</strong>
              </td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <th colspan="4" class="center aligned">
              <div class="ui label">
                <i class="users icon" aria-hidden="true"></i>
                Showing ${this.customers.length} customers
              </div>
            </th>
          </tr>
        </tfoot>
      </table>
    `;
    }
}

// Register the custom element
customElements.define('customer-revenue-table', CustomerRevenueTable);

