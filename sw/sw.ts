if ('serviceWorker' in navigator) {
    window.addEventListener(
            'load',
            () => navigator.serviceWorker.register('/static/service-worker.js').catch(console.error)
    );
}
