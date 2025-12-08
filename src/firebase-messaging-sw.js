importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js')

const firebase_config = {
  apiKey: 'AIzaSyAGo1TY-IJznUAU05G6X6sGqnS36eWkpyY',
  authDomain: 'todo-18fa3.firebaseapp.com',
  projectId: 'todo-18fa3',
  storageBucket: 'todo-18fa3.firebasestorage.app',
  messagingSenderId: '732085319722',
  appId: '1:732085319722:web:420bdc5b5cc336e0206b53',
  measurementId: 'G-PWH1NR6P03'
};

firebase.initializeApp(firebase_config)
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Recieved background message', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
})