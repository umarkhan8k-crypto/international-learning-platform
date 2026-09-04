self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'International Learning Platform', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'International Learning Platform';
  const options = {
    body: data.body || '',
    // Large icon shown inside the notification — our green brand icon.
    icon: 'icon-192.png',
    // Small status-bar icon (Android). This MUST be a simple white
    // silhouette on a transparent background — Android applies its own
    // tint color to it, so a colored image here would just look wrong.
    badge: 'badge-96.png',
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
