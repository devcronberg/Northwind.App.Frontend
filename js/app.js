// Main Application Entry Point

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Northwind Traders Application Initialized');

    // Application initialization code will go here
    initializeApp();

    // Register Service Worker for PWA
    registerServiceWorker();
});

function initializeApp() {
    // Future: Initialize router, services, etc.
    console.log('✅ App ready');
}

// Register Service Worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('✅ Service Worker registered:', registration);
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }
}
