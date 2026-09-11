// Service worker de réception des notifications.
// Doit être placé à la racine du dépôt, à côté de index.html.

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDYS45LGIAp4tb1SzteAn-iTQwDtDz9LlI",
  authDomain: "jauge-quotidien.firebaseapp.com",
  databaseURL: "https://jauge-quotidien-default-rtdb.firebaseio.com",
  projectId: "jauge-quotidien",
  storageBucket: "jauge-quotidien.firebasestorage.app",
  messagingSenderId: "135326627086",
  appId: "1:135326627086:web:4b0495bffef1b4ae9bd35f"
});

const messaging = firebase.messaging();

// Notification reçue alors que l'app est fermée ou en arrière-plan
messaging.onBackgroundMessage(payload => {
  const title = (payload.notification && payload.notification.title) || "Notre question du jour";
  const body = (payload.notification && payload.notification.body) || "";
  self.registration.showNotification(title, {
    body: body,
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: { url: "https://mathismadar.github.io/Jauge-Quotidien/" }
  });
});

// Un appui sur la notification ouvre l'app, ou la met au premier plan
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url)
    || "https://mathismadar.github.io/Jauge-Quotidien/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.indexOf("Jauge-Quotidien") !== -1 && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
