/* global $ */
// Customer Table Component using Fomantic UI
import { API_CONFIG } from '../config/settings.js';

class CustomerTable extends HTMLElement {
    constructor() {
        super();
        this.customers = [];
        this.loading = true;
        this.error = null;
    }

    connectedCallback() {
        this.render();
        this.fetchCustomers();
    }

    async fetchCustomers() {
        try {
            this.loading = true;
            this.render();

            const response = await fetch(`${API_CONFIG.BASE_URL}/public/customers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.customers = await response.json();
            this.loading = false;
            this.render();
        } catch (error) {
            console.error('Error fetching customers:', error);
            this.error = error.message;
            this.loading = false;
            this.render();
        }
    }

    handleEditOrCreate(customerId = null, mode = 'edit') {
        console.log('handleEditOrCreate called:', { customerId, mode });

        let customer = null;
        if (mode === 'edit') {
            // Convert to number since data-id is string but API returns numbers
            const customerIdNum = parseInt(customerId, 10);
            customer = this.customers.find(c => c.customerId === customerIdNum);
            console.log('Customer found:', customer);
            if (!customer) {
                console.error('Customer not found!');
                return;
            }
        } else {
            // Create mode - initialize empty customer
            customer = {
                customerId: '',
                customerName: '',
                contactName: '',
                contactTitle: '',
                address: '',
                city: '',
                region: '',
                postalCode: '',
                country: '',
                phone: '',
                fax: ''
            };
        }

        // Create modal if it doesn't exist
        let modal = document.getElementById('edit-customer-modal');
        console.log('Existing modal:', modal);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'edit-customer-modal';
            modal.className = 'ui modal';
            document.body.appendChild(modal);
            console.log('Modal created and appended to body');
        }

        const isEditMode = mode === 'edit';
        const modalTitle = isEditMode ? 'Edit Customer' : 'Create Customer';
        const modalIcon = isEditMode ? 'edit' : 'plus';
        const customerIdFieldStyle = isEditMode ? '' : 'display: none;';

        console.log('About to populate modal innerHTML');
        try {
            // Populate modal with form
            modal.innerHTML = `
            <i class="close icon"></i>
            <div class="header">
                <i class="${modalIcon} icon"></i>
                ${modalTitle}
            </div>
            <div class="content">
                <div class="ui form" id="edit-customer-form">
                    <div style="${customerIdFieldStyle}">
                        <form-text-input label="Customer ID" name="customerId" value="${customer.customerId}" readonly></form-text-input>
                    </div>
                    <form-text-input label="Company Name" name="customerName" value="${customer.customerName || ''}" required maxlength="40"></form-text-input>
                    <form-text-input label="Contact Name" name="contactName" value="${customer.contactName || ''}" maxlength="30"></form-text-input>
                    <form-text-input label="Contact Title" name="contactTitle" value="${customer.contactTitle || ''}" maxlength="30"></form-text-input>
                    <form-text-input label="Address" name="address" value="${customer.address || ''}" maxlength="60"></form-text-input>
                    <div class="two fields" style="margin-bottom: 1em; display: flex; gap: 1em;">
                        <form-text-input label="City" name="city" value="${customer.city || ''}" maxlength="15"></form-text-input>
                        <form-text-input label="Region" name="region" value="${customer.region || ''}" maxlength="15"></form-text-input>
                    </div>
                    <div class="two fields" style="margin-bottom: 1em; display: flex; gap: 1em;">
                        <form-text-input label="Postal Code" name="postalCode" value="${customer.postalCode || ''}" maxlength="10"></form-text-input>
                        <form-text-input label="Country" name="country" value="${customer.country || ''}" maxlength="15"></form-text-input>
                    </div>
                    <div class="two fields" style="margin-bottom: 1em; display: flex; gap: 1em;">
                        <form-text-input label="Phone" name="phone" value="${customer.phone || ''}" maxlength="24"></form-text-input>
                        <form-text-input label="Fax" name="fax" value="${customer.fax || ''}" maxlength="24"></form-text-input>
                    </div>
                </div>
            </div>
            <div class="actions">
                <div class="ui black deny button">
                    Cancel
                </div>
                <div class="ui positive right labeled icon button" id="save-customer-btn">
                    Save
                    <i class="checkmark icon"></i>
                </div>
            </div>
        `;
            console.log('Modal HTML populated successfully');
        } catch (error) {
            console.error('Error populating modal HTML:', error);
            return;
        }

        // Wait for next tick to ensure custom elements are defined
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                console.log('About to show modal');
                // Show modal using Fomantic UI
                $(modal).modal({
                    closable: false,
                    autofocus: false,
                    onApprove: () => {
                        if (mode === 'edit') {
                            this.saveCustomer(customerId);
                        } else {
                            this.createCustomer();
                        }
                        return false; // Prevent closing until save completes
                    },
                    onShow: () => {
                        console.log('Modal onShow callback');
                    },
                    onVisible: () => {
                        console.log('Modal is now visible');
                    },
                    onHide: () => {
                        console.log('Modal onHide callback');
                    }
                }).modal('show');
                console.log('Modal show() called');
            });
        });
    }

    async saveCustomer(customerId) {
        const form = document.getElementById('edit-customer-form');
        const inputs = form.querySelectorAll('form-text-input');

        const customerData = {};
        inputs.forEach(input => {
            customerData[input.getAttribute('name')] = input.value;
        });

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/public/customers/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Close modal and refresh data
            $('#edit-customer-modal').modal('hide');
            this.fetchCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
            alert(`Error saving customer: ${error.message}`);
        }
    }

    async createCustomer() {
        const form = document.getElementById('edit-customer-form');
        const inputs = form.querySelectorAll('form-text-input');

        const customerData = {};
        inputs.forEach(input => {
            const name = input.getAttribute('name');
            // Skip customerId field for create
            if (name !== 'customerId') {
                customerData[name] = input.value;
            }
        });

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/public/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Close modal and refresh data
            $('#edit-customer-modal').modal('hide');
            this.fetchCustomers();
        } catch (error) {
            console.error('Error creating customer:', error);
            alert(`Error creating customer: ${error.message}`);
        }
    }

    async handleDelete(customerId) {
        // Convert to number since data-id is string but API returns numbers
        const customerIdNum = parseInt(customerId, 10);
        if (!confirm(`Are you sure you want to delete customer ${customerIdNum}?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/public/customers/${customerIdNum}`, {
                method: 'DELETE',
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh data
            this.fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert(`Error deleting customer: ${error.message}`);
        }
    }

    render() {
        if (this.loading) {
            this.innerHTML = `
        <div class="ui segment" role="status" aria-live="polite" aria-atomic="true">
          <div class="ui active inverted dimmer">
            <div class="ui text loader">Loading customers...</div>
          </div>
          <p style="height: 200px;"></p>
        </div>
      `;
            return;
        }

        if (this.error) {
            this.innerHTML = `
        <div class="ui negative message" role="alert" aria-live="assertive">
          <div class="header">Error Loading Customers</div>
          <p>${this.error}</p>
        </div>
      `;
            return;
        }

        if (!this.customers || this.customers.length === 0) {
            this.innerHTML = `
        <div class="ui info message" role="status" aria-live="polite">
          <div class="header">No Customers Found</div>
          <p>There are no customers in the system.</p>
        </div>
      `;
            return;
        }

        this.innerHTML = `
      <div class="ui segment">
        <table class="ui celled striped table" role="table" aria-label="Customer list">
          <thead>
            <tr>
              <th scope="col"><i class="hashtag icon" aria-hidden="true"></i>Customer ID</th>
              <th scope="col"><i class="building icon" aria-hidden="true"></i>Company Name</th>
              <th scope="col"><i class="user icon" aria-hidden="true"></i>Contact Name</th>
              <th scope="col"><i class="map marker alternate icon" aria-hidden="true"></i>City</th>
              <th scope="col"><i class="globe icon" aria-hidden="true"></i>Country</th>
              <th scope="col" class="center aligned"><i class="cog icon" aria-hidden="true"></i>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.customers.map((customer) => `
              <tr>
                <td>
                  <div class="ui blue label">${customer.customerId}</div>
                </td>
                <td>
                  <strong>${customer.customerName || 'N/A'}</strong>
                </td>
                <td>${customer.contactName || 'N/A'}</td>
                <td>${customer.city || 'N/A'}</td>
                <td>${customer.country || 'N/A'}</td>
                <td class="center aligned">
                  <button type="button" class="ui small button pink-btn edit-btn" data-id="${customer.customerId}" aria-label="Edit ${customer.customerName || 'customer'}">
                    <i class="edit icon" aria-hidden="true"></i>Edit
                  </button>
                  <button type="button" class="ui small button black-btn delete-btn" data-id="${customer.customerId}" aria-label="Delete ${customer.customerName || 'customer'}">
                    <i class="trash icon" aria-hidden="true"></i>Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="ui label">
          <i class="database icon" aria-hidden="true"></i>
          Showing ${this.customers.length} customers
        </div>
      </div>
    `;

        // Attach event listeners to buttons
        this.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const customerId = e.currentTarget.getAttribute('data-id');
                this.handleEditOrCreate(customerId, 'edit');
            });
        });

        this.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const customerId = e.currentTarget.getAttribute('data-id');
                this.handleDelete(customerId);
            });
        });
    }
}

// Register the custom element
customElements.define('customer-table', CustomerTable);
