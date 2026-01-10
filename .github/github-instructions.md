# AI Instruktioner: Northwind Frontend

## Projektoversigt

**Formål**: Pædagogisk demo-frontend ved brug af vanilla JavaScript, Web Components og Fomantic UI.

**Nøglebegrænsninger**:
- ✅ Kun Vanilla JavaScript (ES6+ moduler) - INGEN frameworks undtagen Fomantic UI til styling
- ✅ Web Components uden Shadow DOM (for Fomantic UI kompatibilitet)
- ✅ Kun engelsk sprog (kode, kommentarer, UI-tekst)
- ✅ Valuta: USD (en-US locale)
- ✅ **Nul Fejl Politik**: Ingen VS Code problemer/advarsler/fejl tilladt

## Tech Stack

- **UI Framework**: Fomantic UI 2.9.3 (CSS/komponenter via CDN)
- **Backend API**: `https://northwind-backend-b088.onrender.com/api`
- **Linters**: HTMLHint, Stylelint, ESLint (JS/JSON/Markdown/CSS)
- **Package Manager**: NPM (kun dev dependencies)

## Projektstruktur

```text
Northwind.App.Frontend/
├── .github/
│   └── github-instructions.md          # Denne fil
├── .vscode/
│   └── extensions.json                 # Anbefalede VS Code extensions
├── assets/
│   └── favicon.svg                     # Site-ikon
├── css/
│   └── styles.css                      # Minimale brugerdefinerede styles (Fomantic håndterer det meste)
├── js/
│   ├── app.js                          # Hoved-indgangspunkt
│   ├── components/
│   │   ├── app-header.js               # Navigations-header
│   │   ├── app-footer.js               # Footer
│   │   ├── customer-revenue-table.js   # Kundedata-tabel (dashboard)
│   │   ├── customer-table.js           # Kunde-tabel med CRUD
│   │   └── form-text-input.js          # Genanvendelig formular-input
│   └── config/
│       └── settings.js                 # API-konfiguration
├── index.html                          # Dashboard-side
├── customers.html                      # Kundestyring-side
├── .htmlhintrc                         # HTML linting regler
├── .stylelintrc.json                   # CSS linting regler
├── eslint.config.mjs                   # ESLint flat config
├── package.json                        # NPM scripts og dev dependencies
└── .gitignore                          # Git ignore mønstre
```

## Komponentarkitektur

### Web Components Mønster

Alle komponenter udvider `HTMLElement` **uden Shadow DOM** for at tillade Fomantic UI styling:

```javascript
class MyComponent extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    
    render() {
        this.innerHTML = `
            <div class="ui segment">
                <!-- Fomantic UI classes fungerer her -->
            </div>
        `;
    }
}

customElements.define('my-component', MyComponent);
```

**VIGTIGT**: 
- INGEN Shadow DOM (`this.attachShadow()`)
- Brug `this.innerHTML` direkte
- Definer kun custom elements én gang (tjek for duplikeret `customElements.define()`)

### Eksisterende Komponenter

1. **app-header.js**: Blå inverteret menu med skjold-ikon, Customers/About links
2. **app-footer.js**: Inverteret footer-segment med grid layout
3. **customer-revenue-table.js**: Henter `/api/public/customers-with-revenue`, renderer Fomantic tabel med loading state (bruges på dashboard)
4. **customer-table.js**: Viser alle kunder med CRUD-operationer (create, read, update, delete)
5. **form-text-input.js**: Genanvendelig formular-input komponent med label og validering

## API Integration

### Configuration

```javascript
// js/config/settings.js
export const API_CONFIG = {
    BASE_URL: 'https://northwind-backend-b088.onrender.com/api',
    TIMEOUT: 30000
};
```

### Available Endpoints

- `GET /api/public/customers-with-revenue` - Customer revenue data (no auth required)
- `GET /api/public/customers` - All customers
- `GET /api/public/customers/{id}` - Specific customer
- `POST /api/public/customers` - Create new customer
- `PUT /api/public/customers/{id}` - Update customer
- `DELETE /api/public/customers/{id}` - Delete customer

### Fetch Pattern

```javascript
import { API_CONFIG } from '../config/settings.js';

async fetchData() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/endpoint`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        // Handle data
    } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.message;
    }
}
```

## Styling Guidelines

### Fomantic UI Usage

Load via CDN in `<head>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css">
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
```

**Common Components**:
- `.ui.menu` - Navigation
- `.ui.container` - Page width
- `.ui.segment` - Content blocks
- `.ui.table` - Data tables
- `.ui.button` - Buttons
- `.ui.icon` - Icons
- `.ui.label` - Badges/tags
- `.ui.dimmer.active` + `.ui.loader` - Loading state

**Color Classes**: `.blue`, `.green`, `.red`, `.teal`, etc.
**Inverted**: `.inverted` for dark backgrounds

### Custom CSS

Keep `css/styles.css` minimal. Only add custom styles that Fomantic doesn't provide.

## Linting & Code Quality

### Zero Errors Workflow (MANDATORY)

1. **Before making changes**: Run `get_errors` tool to check baseline
2. **Make changes**
3. **After changes**: Run `get_errors` again
4. **If errors found**: Fix them IMMEDIATELY before proceeding
5. Run `npm run lint` to verify all linters pass

### NPM Scripts

```bash
npm run lint:html    # HTMLHint
npm run lint:css     # Stylelint  
npm run lint:js      # ESLint
npm run lint         # All linters
```

### Linter Configs

- **HTMLHint** (`.htmlhintrc`): HTML validation
- **Stylelint** (`.stylelintrc.json`): CSS validation with stylelint-config-standard
- **ESLint** (`eslint.config.mjs`): JS/JSON/Markdown/CSS validation
  - Ignores: `node_modules/`, `package-lock.json`, `*.min.js`, `dist/`, `build/`

### VS Code Extensions

Required extensions (in `.vscode/extensions.json`):
- `htmlhint.vscode-htmlhint`
- `stylelint.vscode-stylelint`
- `dbaeumer.vscode-eslint`
- `ritwickdey.liveserver`
- `chromedevtools.vscode-edge-devtools`

## Development Guidelines

### File Creation

When adding new components/files:

1. **Components**: `js/components/component-name.js`
   - Use kebab-case for filenames and custom element names
   - Export as class, define at bottom of file
   - Import in `js/app.js` or parent component

2. **Services**: `js/services/service-name.js`
   - Export functions or classes
   - Keep API logic separate from UI

3. **Styles**: Add to `css/styles.css` only if Fomantic doesn't cover it

### Formatting & Conventions

- **Indentation**: 4 spaces (configured in linters)
- **Quotes**: Single quotes for JS, double for HTML attributes
- **Currency**: Format with `Intl.NumberFormat` as USD
- **Language**: English only in all code, comments, UI text

### Testing

- Use `npx http-server -p 8080` or VS Code Live Server to run locally
- ES6 modules require HTTP server (won't work with `file://` protocol)
- Check browser console for errors
- Verify network requests in DevTools

## Common Tasks

### Adding a New Component

1. Create `js/components/my-component.js`:
```javascript
class MyComponent extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    
    render() {
        this.innerHTML = `
            <div class="ui segment">
                <h3>My Component</h3>
            </div>
        `;
    }
}

customElements.define('my-component', MyComponent);
```

2. Import in `js/app.js`:
```javascript
import './components/my-component.js';
```

3. Use in HTML:
```html
<my-component></my-component>
```

4. Run `get_errors` and `npm run lint` to verify

### Adding API Integration

1. Add endpoint config to `js/config/settings.js` if needed
2. Add fetch logic to component or create service
3. Handle loading/error states
4. Format data for display
5. Test with real API

### Git Workflow

```bash
git add .
git commit -m "Descriptive message"
```

All commits should pass linting (exit code 0).

## Troubleshooting

### CORS Errors with file://
- Must use HTTP server (Live Server or `npx http-server`)
- ES6 modules don't work with file:// protocol

### Component Registered Twice
- Check for duplicate `customElements.define()` calls
- Clear browser cache with hard reload (Ctrl+Shift+R)

### Fomantic UI Not Styling Component
- Verify Shadow DOM is NOT used
- Check that Fomantic CSS/JS is loaded in `<head>`
- Verify class names match Fomantic documentation

### Linting Errors
- Run `npm run lint` to see all errors
- Fix errors immediately (Zero Errors Policy)
- Check `.htmlhintrc`, `.stylelintrc.json`, `eslint.config.mjs` for rules

## Reference

- **Fomantic UI Docs**: https://fomantic-ui.com/
- **MDN Web Components**: https://developer.mozilla.org/en-US/docs/Web/Web_Components
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **ES6 Modules**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

3. [Projektstruktur](#projektstruktur)
4. [Kom i Gang](#kom-i-gang)
5. [Web Components](#web-components)
6. [Progressive Web App (PWA)](#progressive-web-app-pwa)
7. [API Integration](#api-integration)
8. [Styling med Vanilla CSS](#styling-med-vanilla-css)
9. [Best Practices](#best-practices)
10. [Deployment](#deployment)
11. [Undervisningsmateriale](#undervisningsmateriale)

---

## Projektbeskrivelse

Dette er en **demo frontend applikation** til undervisning, der viser hvordan man bygger en moderne webapplikation med:

- ✅ **Vanilla HTML, CSS og JavaScript** - Ingen frameworks
- ✅ **Web Components** - Moderne, genanvendelige komponenter
- ✅ **Progressive Web App (PWA)** - Installérbar, offline-capable
- ✅ **REST API Integration** - Kommunikerer med Northwind Backend
- ✅ **Responsiv Design** - Virker på mobil, tablet og desktop
- ✅ **Ingen Build Tools** - Kører direkte i browseren
- ✅ **English Language** - All code, comments, and UI text in English
- ✅ **Zero Errors** - No VS Code problems, warnings, or errors allowed

### Formål

Projektet demonstrerer **fundamentale web development koncepter** uden kompleksiteten fra frameworks som React, Vue eller Angular. Det er perfekt til:

- 🎓 Undervisning i web fundamentals
- 📖 Læring af Web Components
- 🔧 Forståelse af PWA koncepter
- 🌐 REST API integration
- 💡 Moderne JavaScript (ES6+)

---

## Teknologier og Arkitektur

### Ingen Frameworks - Kun Web Standards

| Teknologi          | Formål                     | Hvorfor?                          |
| ------------------ | -------------------------- | --------------------------------- |
| **HTML5**          | Struktur og semantik       | Native web platform               |
| **CSS3**           | Styling og layout          | Ingen Bootstrap, ren CSS          |
| **JavaScript**     | Logik og interaktivitet    | ES6+ modules, native features     |
| **Web Components** | Genanvendelige komponenter | Shadow DOM, Custom Elements       |
| **PWA**            | Offline, installérbar      | Service Workers, Web App Manifest |
| **Fetch API**      | HTTP requests til backend  | Native, ingen axios eller jQuery  |

### Arkitektur Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   index.html │  │  manifest   │  │   sw.js     │          │
│  │             │  │   .json     │  │  (Service   │          │
│  │  (Shell)    │  │  (PWA)      │  │   Worker)   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                                   │                 │
│         v                                   v                 │
│  ┌──────────────────────────────────────────────────┐        │
│  │         Web Components (js/components/)          │        │
│  ├──────────────────────────────────────────────────┤        │
│  │  • <app-header>     • <customer-list>            │        │
│  │  • <app-navigation> • <customer-detail>          │        │
│  │  • <app-footer>     • <login-form>               │        │
│  └──────────────────────────────────────────────────┘        │
│         │                                                     │
│         v                                                     │
│  ┌──────────────────────────────────────────────────┐        │
│  │           Services (js/services/)                │        │
│  ├──────────────────────────────────────────────────┤        │
│  │  • api.service.js       (HTTP requests)          │        │
│  │  • auth.service.js      (JWT tokens)             │        │
│  │  • storage.service.js   (localStorage)           │        │
│  └──────────────────────────────────────────────────┘        │
│         │                                                     │
└─────────┼─────────────────────────────────────────────────────┘
          │
          │ HTTPS (JWT Bearer Token)
          v
┌─────────────────────────────────────────────────────────────┐
│               Backend REST API (ASP.NET Core)                │
│  https://northwind-backend.onrender.com/api/                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Projektstruktur

```text
Northwind.App.Frontend.Simple/
│
├── .github/
│   └── README.md                    # Denne fil
│
├── index.html                       # Single Page Application shell
│
├── manifest.json                    # PWA manifest (app metadata)
├── sw.js                            # Service Worker (offline support)
│
├── css/
│   ├── styles.css                   # Global styles
│   ├── variables.css                # CSS custom properties (colors, spacing)
│   ├── layout.css                   # Layout utilities (grid, flexbox)
│   ├── components.css               # Component-specific styles
│   └── responsive.css               # Media queries
│
├── js/
│   ├── app.js                       # Application entry point
│   ├── router.js                    # Client-side routing
│   │
│   ├── components/
│   │   ├── app-header.js            # Header component
│   │   ├── app-navigation.js        # Navigation menu
│   │   ├── app-footer.js            # Footer component
│   │   ├── login-form.js            # Login form component
│   │   ├── customer-list.js         # Customer list component
│   │   ├── customer-detail.js       # Customer detail view
│   │   ├── customer-form.js         # Create/Edit customer form
│   │   └── loading-spinner.js       # Loading indicator
│   │
│   ├── services/
│   │   ├── api.service.js           # HTTP client (fetch wrapper)
│   │   ├── auth.service.js          # Authentication (JWT)
│   │   ├── storage.service.js       # localStorage wrapper
│   │   └── notification.service.js  # Toast notifications
│   │
│   └── utils/
│       ├── constants.js             # Constants (API URLs, etc.)
│       ├── validators.js            # Form validation
│       └── helpers.js               # Utility functions
│
└── assets/
    ├── icons/
    │   ├── icon-72x72.png           # PWA icons (various sizes)
    │   ├── icon-96x96.png
    │   ├── icon-128x128.png
    │   ├── icon-144x144.png
    │   ├── icon-152x152.png
    │   ├── icon-192x192.png
    │   └── icon-512x512.png
    │
    └── images/
        └── logo.svg                 # Application logo
```

---

## Kom i Gang

### Forudsætninger

- **Web Browser**: Chrome, Firefox, Safari eller Edge (seneste version)
- **Lokal Web Server**: Live Server, Python SimpleHTTPServer, eller lignende
- **Backend API**: Northwind Backend kørende (se backend README)

### Installation

**1. Clone Repository**

```bash
git clone https://github.com/[username]/Northwind.App.Frontend.Simple.git
cd Northwind.App.Frontend.Simple
```

**2. Start Lokal Web Server**

**Option A: VS Code Live Server**
- Installer [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Højreklik på `index.html` → "Open with Live Server"
- Åbner på `http://localhost:5500`

**Option B: Python SimpleHTTPServer**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```
- Åbn `http://localhost:8080`

**Option C: Node.js http-server**
```bash
npx http-server -p 8080
```

**3. Configure API URL**

Åbn [js/utils/constants.js](js/utils/constants.js) og opdater API URL:

```javascript
// Development
export const API_BASE_URL = 'http://localhost:5000/api';

// Production
export const API_BASE_URL = 'https://northwind-backend.onrender.com/api';
```

**4. Åbn i Browser**

Naviger til `http://localhost:8080` (eller den port du valgte)

---

## Web Components

### Hvad er Web Components?

**Web Components** er en samling af web platform APIs, der lader dig lave nye, genanvendelige, indkapslede HTML tags til brug i websider og webapps.

**3 Hovedteknologier**:

1. **Custom Elements**: Definer dine egne HTML elementer
2. **Shadow DOM**: Indkapslet DOM og styling
3. **HTML Templates**: `<template>` og `<slot>` elementer

### Opret en Web Component

**Eksempel: Customer Card Component**

```javascript
// js/components/customer-card.js

class CustomerCard extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Called when element is added to DOM
    this.render();
  }

  // Observed attributes (re-render when changed)
  static get observedAttributes() {
    return ['customer-id', 'company-name', 'contact-name', 'country'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Called when an observed attribute changes
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const customerId = this.getAttribute('customer-id');
    const companyName = this.getAttribute('company-name');
    const contactName = this.getAttribute('contact-name');
    const country = this.getAttribute('country');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          margin: 0.5rem 0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .company-name {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
        }

        .customer-id {
          font-size: 0.875rem;
          color: #666;
          font-family: monospace;
        }

        .contact-info {
          color: #555;
        }

        .country {
          display: inline-block;
          background: #e3f2fd;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
      </style>

      <div class="card-header">
        <span class="company-name">${companyName}</span>
        <span class="customer-id">${customerId}</span>
      </div>
      <div class="contact-info">${contactName}</div>
      <div class="country">📍 ${country}</div>
    `;
  }
}

// Register the custom element
customElements.define('customer-card', CustomerCard);
```

**Brug i HTML:**

```html
<customer-card
  customer-id="ALFKI"
  company-name="Alfreds Futterkiste"
  contact-name="Maria Anders"
  country="Germany">
</customer-card>
```

### Lifecycle Callbacks

| Callback                     | Hvornår kaldes                   |
| ---------------------------- | -------------------------------- |
| `constructor()`              | Element oprettes                 |
| `connectedCallback()`        | Element tilføjes til DOM         |
| `disconnectedCallback()`     | Element fjernes fra DOM          |
| `attributeChangedCallback()` | Observed attribute ændres        |
| `adoptedCallback()`          | Element flyttes til nyt dokument |

### Shadow DOM Benefits

✅ **Style Encapsulation**: CSS påvirker ikke resten af siden
✅ **DOM Encapsulation**: Intern struktur skjult for JavaScript
✅ **Reusability**: Kan bruges flere steder uden konflikter

**Eksempel:**

```javascript
this.attachShadow({ mode: 'open' });

// Styles kun påvirker dette component
this.shadowRoot.innerHTML = `
  <style>
    .button { color: red; }  /* Påvirker IKKE andre .button elementer */
  </style>
  <button class="button">Click Me</button>
`;
```

---

## Progressive Web App (PWA)

### Hvad er en PWA?

En **Progressive Web App** er en webapplikation, der opfører sig som en native app:

- 📱 **Installérbar**: Kan tilføjes til home screen
- 🔌 **Offline**: Virker uden internet
- 🔔 **Push Notifications**: (valgfrit)
- ⚡ **Fast**: Cacher ressourcer
- 🔒 **Sikker**: Kræver HTTPS

### PWA Komponenter

#### 1. Web App Manifest (manifest.json)

**Manifest** beskriver appen til browseren:

```json
{
  "name": "Northwind Customer Management",
  "short_name": "Northwind",
  "description": "Demo frontend for Northwind REST API",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2196f3",
  "background_color": "#ffffff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Link i index.html:**

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#2196f3">
```

#### 2. Service Worker (sw.js)

**Service Worker** er en JavaScript fil, der kører i baggrunden og intercepter network requests.

**Eksempel Service Worker:**

```javascript
// sw.js

const CACHE_NAME = 'northwind-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/router.js',
  '/assets/icons/icon-192x192.png',
  // ... andre assets
];

// Install event - cache alle assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone request
        const fetchRequest = event.request.clone();

        // Make network request
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response
          const responseToCache = response.clone();

          // Cache the response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});
```

**Register Service Worker (app.js):**

```javascript
// js/app.js

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}
```

### Caching Strategies

| Strategi                   | Hvornår brug                    | Fordel                    |
| -------------------------- | ------------------------------- | ------------------------- |
| **Cache First**            | Static assets (CSS, JS, images) | Hurtig, offline           |
| **Network First**          | API requests (dynamic data)     | Altid frisk data          |
| **Cache Only**             | App shell                       | Instant load              |
| **Network Only**           | Non-GET requests (POST, PUT)    | Ingen stale data          |
| **Stale While Revalidate** | Content der kan være gammelt    | Balance speed + freshness |

### PWA Install Prompt

**Lyt til install event:**

```javascript
// js/app.js

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default browser prompt
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install button
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Show install prompt
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted PWA install');
      } else {
        console.log('❌ User dismissed PWA install');
      }
      deferredPrompt = null;
    });
  });
});
```

---

## API Integration

### API Service (api.service.js)

**Centraliseret HTTP client:**

```javascript
// js/services/api.service.js

import { API_BASE_URL } from '../utils/constants.js';
import { AuthService } from './auth.service.js';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add JWT token if available
    const token = AuthService.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized (token expired)
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await AuthService.refreshToken();
        if (refreshed) {
          // Retry request with new token
          return this.request(endpoint, options);
        } else {
          // Redirect to login
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
      }

      // Parse JSON response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // Convenience methods
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Customer endpoints
  getCustomers() {
    return this.get('/customers');
  }

  getCustomer(id) {
    return this.get(`/customers/${id}`);
  }

  createCustomer(customer) {
    return this.post('/customers', customer);
  }

  updateCustomer(id, customer) {
    return this.put(`/customers/${id}`, customer);
  }

  deleteCustomer(id) {
    return this.delete(`/customers/${id}`);
  }
}

export const apiService = new ApiService();
```

### Auth Service (auth.service.js)

**JWT token management:**

```javascript
// js/services/auth.service.js

import { apiService } from './api.service.js';
import { StorageService } from './storage.service.js';

class AuthServiceClass {
  constructor() {
    this.ACCESS_TOKEN_KEY = 'access_token';
    this.REFRESH_TOKEN_KEY = 'refresh_token';
    this.USER_KEY = 'user';
  }

  // Login
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      // Store tokens
      StorageService.set(this.ACCESS_TOKEN_KEY, data.accessToken);
      StorageService.set(this.REFRESH_TOKEN_KEY, data.refreshToken);
      StorageService.set(this.USER_KEY, {
        username: data.username,
        role: data.role,
      });

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    // Clear local storage
    StorageService.remove(this.ACCESS_TOKEN_KEY);
    StorageService.remove(this.REFRESH_TOKEN_KEY);
    StorageService.remove(this.USER_KEY);

    // Redirect to login
    window.location.href = '/login';
  }

  // Refresh access token
  async refreshToken() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      // Update tokens
      StorageService.set(this.ACCESS_TOKEN_KEY, data.accessToken);
      StorageService.set(this.REFRESH_TOKEN_KEY, data.refreshToken);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Get access token
  getAccessToken() {
    return StorageService.get(this.ACCESS_TOKEN_KEY);
  }

  // Get refresh token
  getRefreshToken() {
    return StorageService.get(this.REFRESH_TOKEN_KEY);
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  // Get current user
  getCurrentUser() {
    return StorageService.get(this.USER_KEY);
  }
}

export const AuthService = new AuthServiceClass();
```

### Error Handling

**Global error handler:**

```javascript
// js/utils/error-handler.js

export class ErrorHandler {
  static handle(error) {
    console.error('Error:', error);

    let message = 'An unexpected error occurred';

    if (error.message) {
      message = error.message;
    }

    // Show toast notification
    this.showNotification(message, 'error');
  }

  static showNotification(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
```

---

## Styling med Vanilla CSS

### CSS Variables (variables.css)

**Define design tokens:**

```css
/* css/variables.css */

:root {
  /* Colors */
  --color-primary: #2196f3;
  --color-primary-dark: #1976d2;
  --color-primary-light: #bbdefb;

  --color-secondary: #ff5722;
  --color-secondary-dark: #e64a19;
  --color-secondary-light: #ffccbc;

  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-error: #f44336;
  --color-info: #2196f3;

  --color-text-primary: #212121;
  --color-text-secondary: #757575;
  --color-text-disabled: #bdbdbd;

  --color-background: #ffffff;
  --color-surface: #f5f5f5;
  --color-border: #e0e0e0;

  /* Spacing */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-xxl: 3rem;     /* 48px */

  /* Typography */
  --font-family-base: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-family-mono: 'Courier New', Courier, monospace;

  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-md: 1rem;       /* 16px */
  --font-size-lg: 1.25rem;    /* 20px */
  --font-size-xl: 1.5rem;     /* 24px */
  --font-size-xxl: 2rem;      /* 32px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.16);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.19);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;

  /* Z-index */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-tooltip: 1100;
}
```

### Layout Utilities (layout.css)

**Flexbox and Grid utilities:**

```css
/* css/layout.css */

/* Container */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Flexbox */
.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.flex-between {
  justify-content: space-between;
  align-items: center;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-1 {
  flex: 1;
}

/* Grid */
.grid {
  display: grid;
  gap: var(--spacing-md);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Spacing */
.mt-1 { margin-top: var(--spacing-sm); }
.mt-2 { margin-top: var(--spacing-md); }
.mt-3 { margin-top: var(--spacing-lg); }
.mt-4 { margin-top: var(--spacing-xl); }

.mb-1 { margin-bottom: var(--spacing-sm); }
.mb-2 { margin-bottom: var(--spacing-md); }
.mb-3 { margin-bottom: var(--spacing-lg); }
.mb-4 { margin-bottom: var(--spacing-xl); }

.p-1 { padding: var(--spacing-sm); }
.p-2 { padding: var(--spacing-md); }
.p-3 { padding: var(--spacing-lg); }
.p-4 { padding: var(--spacing-xl); }
```

### Responsive Design (responsive.css)

**Mobile-first media queries:**

```css
/* css/responsive.css */

/* Mobile First: Base styles for mobile */

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-lg);
  }

  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }

  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Hide utilities */
@media (max-width: 767px) {
  .hide-mobile {
    display: none !important;
  }
}

@media (min-width: 768px) {
  .hide-desktop {
    display: none !important;
  }
}
```

---

## Best Practices

### 0. Code Quality - Zero VS Code Problems

**CRITICAL: All code must be error-free in VS Code**

**Mandatory Workflow:**

1. **BEFORE starting work:**
   ```javascript
   // Always check current state first
   get_errors() // See existing problems
   ```

2. **AFTER making changes:**
   ```javascript
   // Verify your changes introduced no errors
   get_errors() // Must return "No errors found"
   ```

3. **If errors found:**
   - Fix them IMMEDIATELY
   - Run `get_errors` again
   - Only continue when clean

**Example workflow:**
```text
User request → get_errors (check baseline)
  ↓
Make changes
  ↓
get_errors (verify clean) → ❌ Errors found
  ↓
Fix errors
  ↓
get_errors (verify again) → ✅ No errors
  ↓
Task complete
```

**Code examples:**

```javascript
// ❌ Bad: Syntax errors, duplicate code, missing semicolons
class MyComponent {
  render() { }
  render() { }  // Duplicate method - VS Code error!
}

// ✅ Good: Clean, no problems in VS Code
class MyComponent {
  render() {
    return '<div>Content</div>';
  }
}
```

**Linters configured:**
- **HTMLHint** - HTML validation (`.htmlhintrc`)
- **Stylelint** - CSS validation (`.stylelintrc.json`)
- **VS Code** - JavaScript/TypeScript validation

**Common issues to avoid:**
- Duplicate methods/properties
- Missing semicolons (if required by linter)
- Unused variables
- Type mismatches
- Import/export errors
- Invalid HTML structure
- CSS property errors
- Missing alt attributes on images

**NPM scripts available:**
- `npm run lint:html` - Check HTML files
- `npm run lint:css` - Check CSS files
- `npm run lint` - Check both

### 1. JavaScript ES6+ Modules

**Use modules for code organization:**

```javascript
// ✅ Good: Use import/export
import { apiService } from './services/api.service.js';

export class CustomerService {
  getAll() {
    return apiService.getCustomers();
  }
}

// ❌ Bad: Global variables
var customerService = {
  getAll: function() { ... }
};
```

### 2. Async/Await over Callbacks

```javascript
// ✅ Good: Async/await
async function loadCustomers() {
  try {
    const customers = await apiService.getCustomers();
    renderCustomers(customers);
  } catch (error) {
    handleError(error);
  }
}

// ❌ Bad: Callback hell
apiService.getCustomers(function(customers) {
  renderCustomers(customers, function() {
    loadOrders(function() {
      // ...
    });
  });
});
```

### 3. Error Handling

**Always handle errors:**

```javascript
// ✅ Good: Try/catch
async function deleteCustomer(id) {
  try {
    await apiService.deleteCustomer(id);
    showNotification('Customer deleted', 'success');
  } catch (error) {
    showNotification(error.message, 'error');
    console.error('Delete failed:', error);
  }
}

// ❌ Bad: No error handling
async function deleteCustomer(id) {
  await apiService.deleteCustomer(id);
  showNotification('Customer deleted', 'success');
}
```

### 4. Semantic HTML

```html
<!-- ✅ Good: Semantic elements -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>
  <p>&copy; 2026</p>
</footer>

<!-- ❌ Bad: Divs everywhere -->
<div class="header">
  <div class="nav">
    <div class="menu">...</div>
  </div>
</div>
```

### 5. Accessibility (a11y)

**CRITICAL: All interactive elements must be keyboard accessible and screen reader friendly**

#### Accessibility Checklist

- ✅ **Semantic HTML**: Use proper elements (`<button>`, `<nav>`, `<main>`, `<section>`)
- ✅ **ARIA Labels**: Add `aria-label` or `aria-labelledby` to icon-only buttons
- ✅ **Keyboard Navigation**: All interactive elements must be keyboard accessible
- ✅ **Focus Management**: Visible focus indicators, logical tab order
- ✅ **Form Labels**: All inputs must have associated `<label>` elements
- ✅ **Alt Text**: All images must have descriptive `alt` attributes
- ✅ **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- ✅ **Screen Reader**: Test with NVDA, JAWS, or VoiceOver

#### Semantic HTML

```html
<!-- ✅ Good: Semantic elements -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Dashboard</a></li>
    <li><a href="/customers.html">Customers</a></li>
  </ul>
</nav>

<main>
  <section aria-labelledby="customers-heading">
    <h2 id="customers-heading">Customer List</h2>
    <!-- Content -->
  </section>
</main>

<!-- ❌ Bad: Non-semantic divs -->
<div class="navigation">
  <div><a href="/">Dashboard</a></div>
  <div><a href="/customers.html">Customers</a></div>
</div>

<div>
  <div class="heading">Customer List</div>
  <!-- Content -->
</div>
```

#### Buttons and Interactive Elements

```html
<!-- ✅ Good: Accessible buttons -->
<button 
  type="button"
  aria-label="Edit customer Maria Anders"
  onclick="handleEdit('ALFKI')">
  <i class="edit icon" aria-hidden="true"></i>
</button>

<button 
  type="button"
  aria-label="Delete customer Maria Anders"
  onclick="handleDelete('ALFKI')">
  <i class="trash icon" aria-hidden="true"></i>
</button>

<!-- With text and icon -->
<button type="button">
  <i class="save icon" aria-hidden="true"></i>
  Save Customer
</button>

<!-- ❌ Bad: Non-accessible -->
<div onclick="handleEdit('ALFKI')">
  <i class="edit icon"></i>
</div>

<a href="#" onclick="handleDelete('ALFKI')">
  <i class="trash icon"></i>
</a>
```

#### Form Accessibility

```html
<!-- ✅ Good: Accessible forms -->
<form>
  <div class="field">
    <label for="customer-name">
      Customer Name
      <span aria-label="required">*</span>
    </label>
    <input 
      id="customer-name" 
      type="text" 
      required
      aria-required="true"
      aria-invalid="false"
      aria-describedby="name-error">
    <span id="name-error" role="alert" class="error" style="display:none;">
      Please enter a customer name
    </span>
  </div>

  <div class="field">
    <label for="contact-name">Contact Name</label>
    <input 
      id="contact-name" 
      type="text"
      placeholder="John Doe">
  </div>

  <button type="submit">
    <i class="save icon" aria-hidden="true"></i>
    Save Customer
  </button>
</form>

<!-- ❌ Bad: Not accessible -->
<form>
  <input type="text" placeholder="Customer Name">
  <input type="text" placeholder="Contact Name">
  <div class="button">Save</div>
</form>
```

#### Images and Icons

```html
<!-- ✅ Good: Descriptive alt text -->
<img src="logo.png" alt="Northwind Traders Company Logo">
<img src="chart.png" alt="Revenue chart showing 20% growth in Q4">

<!-- Decorative images -->
<img src="decoration.png" alt="" role="presentation">

<!-- Icons in buttons (use aria-hidden) -->
<button aria-label="Search customers">
  <i class="search icon" aria-hidden="true"></i>
</button>

<!-- ❌ Bad: Missing or poor alt text -->
<img src="logo.png">
<img src="logo.png" alt="image">
<img src="chart.png" alt="chart">
```

#### Loading States and Error Messages

```html
<!-- ✅ Good: Accessible loading and errors -->
<div role="status" aria-live="polite" aria-atomic="true">
  <div class="ui active dimmer">
    <div class="ui loader"></div>
    <span class="sr-only">Loading customers...</span>
  </div>
</div>

<div role="alert" aria-live="assertive" class="ui negative message">
  <i class="times circle icon" aria-hidden="true"></i>
  <span>Error: Failed to load customers. Please try again.</span>
</div>

<div role="status" aria-live="polite" class="ui success message">
  <i class="check circle icon" aria-hidden="true"></i>
  <span>Customer saved successfully!</span>
</div>

<!-- CSS for screen reader only content -->
<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

#### Keyboard Navigation

```javascript
// ✅ Good: Keyboard support in components
class CustomerTable extends HTMLElement {
    attachEventListeners() {
        // Handle keyboard events
        this.querySelectorAll('button').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });

        // Trap focus in modals
        const modal = this.querySelector('.ui.modal');
        if (modal) {
            this.trapFocus(modal);
        }
    }

    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }
}
```

#### Modal Dialog Accessibility

```javascript
// ✅ Good: Accessible modal implementation
showModal() {
    const modal = this.querySelector('.ui.modal');
    
    // Store previously focused element
    this.previousFocus = document.activeElement;
    
    // Show modal with Fomantic UI
    $(modal).modal({
        onShow: () => {
            // Set focus to first input or close button
            const firstInput = modal.querySelector('input, button');
            if (firstInput) firstInput.focus();
            
            // Add aria attributes
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'modal-title');
        },
        onHidden: () => {
            // Restore focus when closed
            if (this.previousFocus) {
                this.previousFocus.focus();
            }
        }
    }).modal('show');
}
```

#### Table Accessibility

```html
<!-- ✅ Good: Accessible table -->
<table class="ui celled table" role="table" aria-label="Customer list">
  <thead>
    <tr>
      <th scope="col">Customer ID</th>
      <th scope="col">Company Name</th>
      <th scope="col">Contact Name</th>
      <th scope="col">Revenue</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ALFKI</td>
      <td>Alfreds Futterkiste</td>
      <td>Maria Anders</td>
      <td>$15,000.00</td>
      <td>
        <button type="button" aria-label="Edit Alfreds Futterkiste">
          <i class="edit icon" aria-hidden="true"></i>
        </button>
        <button type="button" aria-label="Delete Alfreds Futterkiste">
          <i class="trash icon" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

#### Color Contrast

```css
/* ✅ Good: Sufficient contrast */
:root {
  /* Primary text: #000000 on #FFFFFF = 21:1 (AAA) */
  --text-color: #000000;
  --bg-color: #ffffff;
  
  /* Links: #0066cc on #FFFFFF = 8.59:1 (AAA) */
  --link-color: #0066cc;
  
  /* Error: #d01919 on #FFFFFF = 5.78:1 (AA) */
  --error-color: #d01919;
}

/* ❌ Bad: Insufficient contrast */
:root {
  /* #aaaaaa on #ffffff = 2.32:1 (Fails WCAG) */
  --text-color: #aaaaaa;
}
```

#### Testing Accessibility

**Browser Tools:**
```javascript
// Check for accessibility issues in console
// Install axe-core via CDN or npm
<script src="https://cdn.jsdelivr.net/npm/axe-core@4.7.0/axe.min.js"></script>
<script>
  axe.run().then(results => {
    if (results.violations.length) {
      console.error('Accessibility violations:', results.violations);
    } else {
      console.log('No accessibility violations found!');
    }
  });
</script>
```

**Manual Testing:**
- Test with keyboard only (no mouse)
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Check color contrast with browser DevTools
- Verify focus indicators are visible
- Test form validation with screen reader

**Automated Testing:**
```bash
# Install axe-core for testing
npm install --save-dev axe-core

# Or use browser extensions:
# - axe DevTools (Chrome/Firefox)
# - WAVE (Chrome/Firefox)
# - Lighthouse (Chrome DevTools)
```

### 6. Performance

**Debounce search input:**

```javascript
// js/utils/debounce.js
export function debounce(func, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((value) => {
  apiService.searchCustomers(value);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### 7. Language and Localization

**All code and UI in English:**

```javascript
// ✅ Good: English
const customerName = document.getElementById('customer-name');
showNotification('Customer created successfully', 'success');

// ❌ Bad: Danish or mixed languages
const kundeNavn = document.getElementById('kunde-navn');
showNotification('Kunde oprettet succesfuldt', 'success');
```

**Currency and Formatting:**
```javascript
// Use USD for demonstration purposes
const formatted = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(amount);
```

### 8. Security

**Sanitize user input:**

```javascript
// js/utils/sanitize.js
export function sanitizeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Usage
const userInput = '<script>alert("XSS")</script>';
const safe = sanitizeHTML(userInput);
// Result: "&lt;script&gt;alert("XSS")&lt;/script&gt;"
```

**Never use `innerHTML` with user input:**

```javascript
// ❌ Bad: XSS vulnerability
element.innerHTML = userInput;

// ✅ Good: Use textContent
element.textContent = userInput;

// ✅ Good: Sanitize first
element.innerHTML = sanitizeHTML(userInput);
```

---

## Deployment

### Static Site Hosting

**Options:**

1. **GitHub Pages**
   - Free
   - Custom domain
   - HTTPS
   - Deploy: Push to `gh-pages` branch

2. **Netlify**
   - Free tier
   - Continuous deployment
   - Edge functions
   - Deploy: Connect GitHub repo

3. **Vercel**
   - Free tier
   - Fast CDN
   - Serverless functions
   - Deploy: `vercel deploy`

4. **Azure Static Web Apps**
   - Free tier
   - Azure integration
   - API support
   - Deploy: GitHub Actions

### GitHub Pages Deployment

**1. Build (if needed):**
```bash
# No build step needed for vanilla JS!
```

**2. Deploy:**
```bash
# Create gh-pages branch
git checkout -b gh-pages

# Push to GitHub
git push origin gh-pages
```

**3. Enable GitHub Pages:**
- Go to repo Settings → Pages
- Source: Deploy from branch `gh-pages`
- URL: `https://[username].github.io/[repo-name]`

### Environment Configuration

**Use environment-specific config:**

```javascript
// js/utils/constants.js

const ENV = 'production'; // 'development' | 'production'

export const API_BASE_URL = 
  ENV === 'production'
    ? 'https://northwind-backend.onrender.com/api'
    : 'http://localhost:5000/api';

export const DEBUG = ENV === 'development';
```

---

## Undervisningsmateriale

### Læringsmål

Efter gennemgang af dette projekt skal studerende kunne:

1. **HTML & CSS**
   - ✅ Skrive semantisk HTML5
   - ✅ Style med vanilla CSS (ingen frameworks)
   - ✅ Bruge CSS variables
   - ✅ Implementere responsivt design

2. **JavaScript**
   - ✅ Bruge ES6+ features (modules, arrow functions, async/await)
   - ✅ Arbejde med Fetch API
   - ✅ Håndtere asynkron kode
   - ✅ Implementere error handling

3. **Web Components**
   - ✅ Oprette custom elements
   - ✅ Bruge Shadow DOM
   - ✅ Lifecycle callbacks
   - ✅ Props og events

4. **PWA**
   - ✅ Oprette Web App Manifest
   - ✅ Registrere Service Worker
   - ✅ Implementere caching strategies
   - ✅ Gøre app installérbar

5. **API Integration**
   - ✅ Kalde REST API endpoints
   - ✅ Håndtere JWT authentication
   - ✅ Implementere CRUD operationer
   - ✅ Error handling

### Øvelser

#### Øvelse 1: Opret en ny Web Component

**Opgave**: Lav en `<order-card>` component, der viser ordre information.

**Krav**:
- Viser OrderID, OrderDate, CustomerID
- Klikbar (navigate til order detail)
- Shadow DOM med styling
- Responsive

#### Øvelse 2: Implementer Søgefunktionalitet

**Opgave**: Tilføj søgefelt til customer list.

**Krav**:
- Filter customers by company name
- Debounce input (300ms)
- Show loading indicator
- Handle empty results

#### Øvelse 3: Offline Support

**Opgave**: Udvid Service Worker til at cache API responses.

**Krav**:
- Cache GET /api/customers
- Stale-while-revalidate strategy
- Show "Offline" indicator
- Sync when online

#### Øvelse 4: Form Validation

**Opgave**: Lav client-side validation for customer form.

**Krav**:
- Validate required fields
- Email format validation
- Show error messages
- Disable submit if invalid

### Projekter

#### Projekt 1: Product Management

**Beskrivelse**: Tilføj product management til appen.

**Features**:
- List products (with category)
- Product detail view
- Create/Edit product
- Delete product
- Image upload

#### Projekt 2: Order Management

**Beskrivelse**: Implementer order functionality.

**Features**:
- List orders (with customer info)
- Order detail (with order items)
- Create new order
- Add/remove order items
- Calculate order total

#### Projekt 3: Dashboard

**Beskrivelse**: Lav et dashboard med statistik.

**Features**:
- Total customers count
- Recent orders
- Top products
- Revenue chart (with Chart.js eller Canvas API)

---

## Ressourcer

### Dokumentation

- [MDN Web Docs](https://developer.mozilla.org/) - Web platform reference
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [PWA](https://web.dev/progressive-web-apps/)

### Tools

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debugging
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA audit
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [PWA Builder](https://www.pwabuilder.com/) - PWA manifest generator

### Inspiration

- [Web Components Examples](https://www.webcomponents.org/examples)
- [PWA Examples](https://pwa.rocks/)
- [Vanilla JS Projects](https://github.com/topics/vanilla-javascript)

---

## Support

### Problemer?

1. **Check browser console** for errors
2. **Verify API is running** (backend må køre)
3. **Check network tab** for failed requests
4. **Clear cache** og reload (Ctrl+Shift+R)
5. **Check Service Worker** status (DevTools → Application)

### Debugging Tips

**Service Worker Issues:**
```javascript
// Unregister all service workers
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
```

**Clear all caches:**
```javascript
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

**View stored tokens:**
```javascript
console.log('Access Token:', localStorage.getItem('access_token'));
console.log('Refresh Token:', localStorage.getItem('refresh_token'));
```

---

## Licens

Dette projekt er lavet til undervisningsformål og er frit tilgængeligt.

---

**God fornøjelse med undervisningen! 🚀**
