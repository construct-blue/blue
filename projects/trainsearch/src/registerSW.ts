if ('serviceWorker' in navigator) {
    window.addEventListener(
            'load',
            () => navigator.serviceWorker.register('/static/service-worker.js', {scope: '/'})
                    .catch(console.error)
    );
}
