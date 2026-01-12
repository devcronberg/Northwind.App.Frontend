// Header Component with Navigation using Fomantic UI
class AppHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
      <nav class="ui inverted blue menu" role="navigation" aria-label="Main navigation">
        <div class="ui container">
          <a href="index.html" class="header item" aria-label="Northwind Traders home">
            <i class="shield icon" aria-hidden="true"></i>
            Northwind Traders
          </a>
          <a href="customers.html" class="item" aria-label="Customer management">
            <i class="users icon" aria-hidden="true"></i>
            Customers
          </a>
          <a href="about.html" class="item" aria-label="About us">
            <i class="info circle icon" aria-hidden="true"></i>
            About
          </a>
        </div>
      </nav>
    `;
    }
}

// Register the custom element
customElements.define('app-header', AppHeader);
