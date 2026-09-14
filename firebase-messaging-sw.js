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

// Notification reçue alors que l'app est fermée ou en arrière-plan.
// La fonction envoie des données seules, l'affichage est fait ici,
// ce qui évite le doublon avec l'affichage automatique de Firebase.
messaging.onBackgroundMessage(payload => {
  const d = payload.data || {};
  const title = d.title || "Notre question du jour";
  self.registration.showNotification(title, {
    body: d.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: "quotidien",
    renotify: true,
    data: { url: d.url || "https://mathismadar.github.io/Jauge-Quotidien/" }
  });
});

// Un appui sur la notification ouvre l'app, ou la met au premier plan
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url)
    || "https://mathismadar.github.io/Jauge-Quotidien/";

  event.waitUntil(
    // On retire aussi les autres notifications en attente : une fois
    // l'app ouverte, elles n'ont plus lieu d'être
    self.registration.getNotifications().then(list => {
      list.forEach(n => n.close());
      return clients.matchAll({ type: "window", includeUncontrolled: true });
    }).then(windows => {
      for (const client of windows) {
        if (client.url.indexOf("Jauge-Quotidien") !== -1 && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
