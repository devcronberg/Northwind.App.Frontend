// Footer Component using Fomantic UI
class AppFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const currentYear = new Date().getFullYear();

        this.innerHTML = `
      <div class="ui inverted vertical footer segment" style="margin-top: 4rem; padding: 2rem 0;">
        <div class="ui container">
          <div class="ui stackable grid">
            <div class="eight wide column">
              <h4 class="ui inverted header">Northwind Traders</h4>
              <p>&copy; ${currentYear} Northwind Traders. Demo Application for Educational Purposes.</p>
            </div>
            <div class="eight wide right aligned column">
              <div class="ui inverted link list">
                <a href="about.html" class="item">About</a>
                <a href="https://github.com/devcronberg/Northwind.App.Frontend" class="item">Github</a>                
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
}

// Register the custom element
customElements.define('app-footer', AppFooter);
