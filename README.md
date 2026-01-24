# Northwind.App.Frontend

En moderne vanilla JavaScript frontend-applikation, der demonstrerer bedste praksis for web-komponenter, API-integration og brugergrænsefladedesign. Bygget med HTML5, CSS3 og moderne JavaScript ES6+ moduler. Denne applikation forbruger Northwind Backend API.

## 🌟 Funktioner

- ✅ **Progressive Web App (PWA)** - Installerbar på desktop og mobile enheder
- ✅ **Web-komponenter** - Genanvendelige brugerdefinerede elementer uden frameworks
- ✅ **Vanilla JavaScript** - Ingen framework-afhængigheder, kun moderne ES6+
- ✅ **Responsivt Design** - Fomantic UI til konsekvent styling
- ✅ **API-integration** - REST API-klient til Northwind backend
- ✅ **Kunde Dashboard** - Top-kunder sorteret efter omsætning
- ✅ **Kundestyring** - Komplet CRUD-operationer for kunder (Create, Read, Update, Delete)
- ✅ **JWT Autentificering** - Login-system og adgang til beskyttede endpoints
- ✅ **Kodekvalitetsværktøjer** - ESLint, HTMLHint og Stylelint
- ✅ **Modulær Arkitektur** - Organiseret komponentstruktur

## 🚀 Live Demo

**Frontend:** [https://devcronberg.github.io/Northwind.App.Frontend](https://devcronberg.github.io/Northwind.App.Frontend)

Frontend-applikationen forbinder til den deployede backend API:

**Backend API:** [https://northwind-backend-b088.onrender.com](https://northwind-backend-b088.onrender.com)

> ⚠️ **Bemærk:** Backend API'en er hostet på Render.com's gratis niveau og lukker ned efter 15 minutters inaktivitet. Den første forespørgsel kan tage 30-50 sekunder.

## 🛠️ Teknologi Stack

- **HTML5** - Semantisk markup med brugerdefinerede elementer
- **CSS3** - Moderne styling med CSS Grid og Flexbox
- **JavaScript ES6+** - Moduler, klasser, async/await
- **Fomantic UI** - Responsivt CSS framework (fork af Semantic UI)
- **jQuery** - Krævet af Fomantic UI
- **Web Components** - Custom Elements API
- **Fetch API** - Moderne HTTP-klient

## 📋 Forudsætninger

- Moderne webbrowser (Chrome, Firefox, Edge, Safari)
- Lokal webserver (f.eks. Live Server, http-server eller VS Code Live Server extension)
- Node.js og npm (til udviklingsværktøjer og linting)

## 🏃 Kom i Gang

### 1. Klon repository

```bash
git clone https://github.com/devcronberg/Northwind.App.Frontend.git
cd Northwind.App.Frontend
```

### 2. Installer udviklingsafhængigheder

```bash
npm install
```

### 3. Start lokal webserver

#### Med VS Code Live Server extension:
- Højreklik på `index.html`
- Vælg "Open with Live Server"

#### Med http-server:
```bash
npx http-server -p 8080
```

#### Med Python:
```bash
python -m http.server 8080
```

### 4. Åbn i browser

Naviger til: `http://localhost:8080`

## 📁 Projektstruktur

```text
Northwind.App.Frontend/
├── index.html                    # Dashboard-side
├── customers.html                # Kundestyring-side
├── auth.html                     # Autentificering-side (JWT login demo)
├── about.html                    # Om-side
├── manifest.json                 # PWA web app manifest
├── sw.js                         # Service worker (minimal, ingen cache)
├── package.json                  # NPM-afhængigheder og scripts
├── eslint.config.mjs             # ESLint-konfiguration
├── assets/
│   ├── favicon.ico               # Favicon (32x32)
│   ├── favicon.svg               # SVG favicon
│   ├── icon-192.png              # PWA app ikon (192x192)
│   ├── icon-512.png              # PWA app ikon (512x512)
│   └── apple-touch-icon.png      # iOS app ikon (180x180)
├── css/
│   └── styles.css                # Brugerdefineret styling
├── js/
│   ├── app.js                    # Applikations indgangspunkt
│   ├── config/
│   │   └── settings.js           # API og app konfiguration
│   └── components/
│       ├── app-header.js         # Header-komponent
│       ├── app-footer.js         # Footer-komponent
│       ├── customer-table.js     # Kundeliste-tabel med CRUD
│       ├── login-form.js         # Login-formular med JWT
│       ├── protected-customers.js     # Beskyttet endpoint demo
│       ├── customer-revenue-table.js  # Omsætningsdashboard-tabel
│       └── form-text-input.js    # Genanvendelig formular-input
└── .github/
    ├── copilot-instructions.md   # GitHub Copilot instruktioner
    └── workflows/
        └── deploy.yml            # Automatisk deployment til GitHub Pages
```

## 🧩 Web-komponenter

Applikationen bruger moderne Web Components (Custom Elements):

### `<app-header>`
Navigations-header med logo og menu-links.

### `<app-footer>`
Footer med copyright-information.

### `<customer-table>`
Viser alle kunder i en tabel med komplet CRUD-operationer (Create, Read, Update, Delete).

**Funktioner:**
- Opret nye kunder via "Create Customer" knap
- Rediger eksisterende kunder
- Slet kunder med bekræftelse
- Responsiv tabel med Fomantic UI styling

**Attributter:**
- `limit` (valgfri) - Maksimalt antal kunder der skal vises

### `<customer-revenue-table>`
Dashboard-tabel med top-kunder sorteret efter omsætning.

**Attributter:**
- `limit` (påkrævet) - Antal top-kunder der skal vises

### `<form-text-input>`
Genanvendelig formular-inputfelt-komponent.

**Attributter:**
- `label` - Feltetiket

### `<login-form>`
Login-formular til JWT-autentificering.

**Funktioner:**
- Login med email og password
- Token-lagring i localStorage
- Logout-funktionalitet
- Visuel feedback ved login/logout

### `<protected-customers>`
Demonstrerer adgang til beskyttede API-endpoints med JWT token.

**Funktioner:**
- Fetch kunder fra beskyttet endpoint
- Automatisk inkludering af Authorization header
- Fejlhåndtering for udløbne/ugyldige tokens
- Viser kundedata i tabel
- `name` - Formularfeltnavn
#### Public Endpoints (ingen autentificering påkrævet)
- `GET /api/public/customers` - Hent alle kunder
- `GET /api/public/customers-with-revenue` - Hent kunder med omsætning
- `GET /api/public/customers/{id}` - Hent specifik kunde
- `POST /api/public/customers` - Opret ny kunde
- `PUT /api/public/customers/{id}` - Opdater kunde
- `DELETE /api/public/customers/{id}` - Slet kunde

#### Auth Endpoints
- `POST /api/auth/login` - Login og modtag JWT token
  - Request body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "jwt-token-string" }`

#### Protected Endpoints (kræver JWT token)
- `GET /api/customers` - Hent kunder (kræver Authorization header)
  - Header: `Authorization: Bearer {token}`:

### Konfiguration

API-endepunkter er konfigureret i [js/config/settings.js](js/config/settings.js):

```javascript
export const API_CONFIG = {
    BASE_URL: 'https://northwind-backend-b088.onrender.com/api',
    TIMEOUT: 30000,
};
```

### Anvendte Endepunkter

- `GET /api/public/customers` - Hent alle kunder
- `GET /api/public/customers-with-revenue` - Hent kunder med omsætning
- `GET /api/public/customers/{id}` - Hent specifik kunde
- `POST /api/public/customers` - Opret ny kunde
- `PUT /api/public/customers/{id}` - Opdater kunde
- `DELETE /api/public/customers/{id}` - Slet kunde

## 🎨 Styling

Applikationen bruger **Fomantic UI** til konsekvent styling:

- Responsivt grid-system
- For-stylede komponenter (knapper, tabeller, formularer)
- Ikoner via Fomantic UI icon font
- Brugerdefineret styling i [css/styles.css](css/styles.css)

## 📱 Progressive Web App (PWA)

Applikationen er bygget som en Progressive Web App og kan installeres på både desktop og mobile enheder.

**🚨 VIGTIGT:** Kør altid lint før commit eller deployment!

```bash
# Lint HTML
npm run lint:html

# Lint CSS
npm run lint:css

# Lint JavaScript
npm run lint:js

# Lint alt
npm run lint
```

Deployment til GitHub Pages vil fejle hvis linting ikke passerer.

### Installation af PWA

#### På Desktop (Chrome/Edge):

1. Åbn applikationen i browseren
2. Klik på install-ikonet i adresselinjen (eller "..." menu → "Install Northwind Traders")
3. Appen åbnes i et selvstændigt vindue uden browser-chrome

#### På Mobile (Android/iOS):

1. Åbn applikationen i Safari (iOS) eller Chrome (Android)
2. **iOS:** Tryk "Share" → "Add to Home Screen"
3. **Android:** Tryk menu → "Add to Home Screen" eller følg installation-prompt
4. Appen vises som et ikon på hjemmeskærmen

### PWA Filer

- `manifest.json` - Web app manifest med app-metadata
- `sw.js` - Service worker (pass-through, ingen cache)
- `assets/icon-192.png` - App ikon 192x192 (blå baggrund, hvidt "N")
- `assets/icon-512.png` - App ikon 512x512 (blå baggrund, hvidt "N")
- `assets/apple-touch-icon.png` - iOS specifikt ikon 180x180
- `assets/favicon.ico` - Browser favicon

### PWA Begrænsninger

⚠️ **Bemærk:** Denne PWA har **ingen offline funktionalitet eller caching**. Applikationen kræver en aktiv internetforbindelse for at fungere, da den afhænger af backend API'en.

Service workeren er minimal og implementerer kun grundlæggende install/activate events for at opfylde PWA-kravene, men cacher ikke ressourcer eller API-kald.

## 🧪 Kodekvalitet

Vi bruger automatiske værktøjer til at sikre høj kodekvalitet. Sørg for at køre disse før hver commit.

- **Autentificering ([auth.html](auth.html))
- JWT-baseret autentificering demo
- Login-formular med token-lagring
- Fetch beskyttede kunde-endpoints med Authorization header
- Demonstrerer forskel mellem public og protected endpoints

### ESLint** - Tjekker JavaScript for fejl og stil
- **HTMLHint** - Tjekker HTML for korrekthed
- **Stylelint** - Tjekker CSS for fejl

### Linting-scripts

```bash
# Lint HTML
npm run lint:html

# Lint CSS
npm run lint:css

# Lint JavaScript
npm run lint:js

# Kør alle tjek (påkrævet før deployment)
npm run lint
```

## 📄 Sider

### Dashboard ([index.html](index.html))
- Viser velkomst og oversigt
- Præsenterer top-kunder sorteret efter omsætning via `<customer-revenue-table>`

### Kundestyring ([customers.html](customers.html))
- Hovedside for kunde-administration
- Implementerer fuld CRUD (Create, Read, Update, Delete) via `<customer-table>`

### Om ([about.html](about.html))
- Information om projektet, teknologistakken og udviklingsprocessen

## 🔧 Konfiguration

### API-konfiguration

API-endepunkter er konfigureret i [js/config/settings.js](js/config/settings.js).

Standardkonfigurationen peger på den live backend:

```javascript
export const API_CONFIG = {
    BASE_URL: 'https://northwind-backend-b088.onrender.com/api',
    TIMEOUT: 30000,
};
```

For lokal udvikling med [Northwind.App.Backend](https://github.com/devcronberg/Northwind.App.Backend), ændr URL'en til:

```javascript
export const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 30000,
};
```

## 📝 Demonstrerede Best Practices

- ✅ **Separation of Concerns** - Komponenter, konfiguration og styling adskilt
- ✅ **Genanvendelige Komponenter** - Web Components med brugerdefinerede attributter
- ✅ **Moderne JavaScript** - ES6 moduler, klasser, async/await
- ✅ **Fejlhåndtering** - Try/catch blokke og bruger-feedback
- ✅ **Loading States** - Visuel feedback under API-kald
- ✅ **Responsivt Design** - Mobile-first tilgang
- ✅ **Kodekvalitet** - Linting og konsekvent kode-stil
- ✅ **Semantisk HTML** - Korrekt brug af HTML5 elementer
- ✅ **Tilgængelighed** - ARIA labels og semantiske tags

## 🚀 Deployment

Frontend-applikationen kan deployes til enhver statisk hosting-tjeneste:

### GitHub Pages (Automatiseret)

Dette projekt inkluderer en GitHub Actions workflow, der automatisk deployer til GitHub Pages ved hvert push til `main` branchen.

**Engangs-setup:**
1. Gå til repository **Settings** → **Pages**
2. Under **"Build and deployment"**, vælg **"GitHub Actions"** som kilde
3. Push til `main` branchen for at udløse deployment
4. Siden vil være tilgængelig på: `https://devcronberg.github.io/Northwind.App.Frontend`

Workflow'en (`.github/workflows/deploy.yml`) gør automatisk:
- Installerer afhængigheder
- Kører linting-tjek (HTML, CSS, JavaScript)
- Deployer applikationen til GitHub Pages

**Efter setup**, vil hvert push til `main` automatisk deploye den seneste version.

### GitHub Pages (Manuelt)
```bash
# Alternativ: Aktiver GitHub Pages i repository-indstillinger
# Vælg main branch og rod-mappe
```

### Netlify
```bash
# Træk mappen til netlify.com
# eller forbind dit GitHub repository
```

### Vercel
```bash
npx vercel
```

### Render Static Site
```yaml
# render.yaml eksempel
services:
  - type: web
    name: northwind-frontend
    env: static
    buildCommand: "echo 'No build needed'"
    staticPublishPath: .
```

## 🔗 Relaterede Projekter

- **Backend API**: [Northwind.App.Backend](https://github.com/devcronberg/Northwind.App.Backend)
- **Live Backend**: [https://northwind-backend-b088.onrender.com](https://northwind-backend-b088.onrender.com)
- **Swagger API Docs**: [https://northwind-backend-b088.onrender.com/swagger](https://northwind-backend-b088.onrender.com/swagger)

## 🤝 Bidrag

Dette er et demo-projekt til læringsformål. Du er velkommen til at:

- Forke repository'et
- Oprette feature branches
- Indsende pull requests
- Rapportere problemer
- Foreslå forbedringer

## 📄 Licens

Dette projekt er open source og tilgængeligt til undervisningsformål.

## 🙏 Anerkendelser

- **Northwind Database** - Klassisk eksempel-database fra Microsoft
- **Fomantic UI Team** - For det fremragende CSS framework
- **Web Components Community** - For standarder og best practices

## 📞 Kontakt

- **Repository**: https://github.com/devcronberg/Northwind.App.Frontend
- **Backend API**: https://github.com/devcronberg/Northwind.App.Backend
- **Live Demo**: https://northwind-backend-b088.onrender.com

---

**God Kodning! 🚀**

*Dette er en demo-applikation til undervisningsformål. Til produktionsbrug skal du implementere ordentlig sikkerhed, fejllogning, overvågning og performance-optimering.*
