// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.0/8 are considered localhost for IPv4.
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
);

export function register(): Promise<ServiceWorkerRegistration | undefined> {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // The URL constructor is available in all browsers that support SW.
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            // Our service worker won't work if PUBLIC_URL is on a different origin
            // from what our page is served on. This might happen if a CDN is used to
            // serve assets; see https://github.com/facebook/create-react-app/issues/2374
            return Promise.resolve(undefined);
        }

        return new Promise<ServiceWorkerRegistration | undefined>(
            (resolve, reject) => {
                window.addEventListener('load', () => {
                    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
                    if (isLocalhost) {
                        // This is running on localhost. Let's check if a service worker still exists or not.
                        resolve(checkValidServiceWorker(swUrl));
                    } else {
                        // Is not localhost. Just register service worker
                        resolve(registerValidSW(swUrl));
                    }
                });
            }
        );
    }
    return Promise.resolve(undefined);
}

function registerValidSW(swUrl: string) {
    return navigator.serviceWorker.register(swUrl);
}

async function checkValidServiceWorker(
    swUrl: string
): Promise<ServiceWorkerRegistration | undefined> {
    const fetchResult = await fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    });
    const contentType = fetchResult.headers.get('content-type');
    if (
        fetchResult.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
    ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
                window.location.reload();
            });
        });
        return Promise.resolve(undefined);
    } else {
        // Service worker found. Proceed as normal.
        return registerValidSW(swUrl);
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
}
