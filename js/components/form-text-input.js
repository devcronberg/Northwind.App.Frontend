// Form Text Input Component using Fomantic UI
class FormTextInput extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['label', 'name', 'value', 'placeholder', 'required', 'minlength', 'maxlength', 'password', 'disabled', 'readonly', 'autocomplete'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.render();
            this.setupEventListeners();
        }
    }

    get value() {
        const input = this.querySelector('input');
        return input ? input.value : '';
    }

    set value(val) {
        const input = this.querySelector('input');
        if (input) {
            input.value = val;
        }
    }

    setupEventListeners() {
        const input = this.querySelector('input');
        if (!input) return;

        // Forward input events to component
        input.addEventListener('input', (e) => {
            this.dispatchEvent(new CustomEvent('input', {
                detail: { value: e.target.value },
                bubbles: true
            }));
        });

        input.addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('change', {
                detail: { value: e.target.value },
                bubbles: true
            }));
        });
    }

    render() {
        const label = this.getAttribute('label') || '';
        const name = this.getAttribute('name') || '';
        const value = this.getAttribute('value') || '';
        const placeholder = this.getAttribute('placeholder') || '';
        const required = this.hasAttribute('required');
        const minlength = this.getAttribute('minlength') || '';
        const maxlength = this.getAttribute('maxlength') || '';
        const password = this.hasAttribute('password');
        const disabled = this.hasAttribute('disabled');
        const readonly = this.hasAttribute('readonly');
        const autocomplete = this.getAttribute('autocomplete') || 'off';

        const inputType = password ? 'password' : 'text';

        // Set the custom element itself to display: block and width: 100%
        this.style.display = 'block';
        this.style.width = '100%';

        this.innerHTML = `
      <div class="field ${required ? 'required' : ''}" style="margin-bottom: 1em;">
        <label for="${name}">${label}${required ? ' <span aria-label="required">*</span>' : ''}</label>
        <input 
          type="${inputType}"
          id="${name}"
          name="${name}"
          value="${value}"
          placeholder="${placeholder}"
          ${required ? 'required aria-required="true"' : ''}
          ${minlength ? `minlength="${minlength}"` : ''}
          ${maxlength ? `maxlength="${maxlength}"` : ''}
          ${disabled ? 'disabled' : ''}
          ${readonly ? 'readonly' : ''}
          autocomplete="${autocomplete}"
          aria-invalid="false"
        />
      </div>
    `;
    }
}

// Register the custom element
customElements.define('form-text-input', FormTextInput);
