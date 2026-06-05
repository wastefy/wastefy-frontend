importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyCU5j3GIbtU3eoizwQ-nZgRC6CrkltjTRw",
  authDomain: "wastefy-project.firebaseapp.com",
  projectId: "wastefy-project",
  storageBucket: "wastefy-project.firebasestorage.app",
  messagingSenderId: "321381466156",
  appId: "1:321381466156:web:681636de77c2d3c76c1189"
})

const messaging = firebase.messaging()
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  })
})