
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAGo1TY-IJznUAU05G6X6sGqnS36eWkpyY',
  authDomain: 'todo-18fa3.firebaseapp.com',
  projectId: 'todo-18fa3',
  storageBucket: 'todo-18fa3.firebasestorage.app',
  messagingSenderId: '732085319722',
  appId: '1:732085319722:web:420bdc5b5cc336e0206b53',
  measurementId: 'G-PWH1NR6P03'
};

const VAPID_KEY = 'BFm9CUyfsipFBujlTv9puPmCh5epnWCwtK0_JY2QYn_ElIiPvtAQh_iucT2ULsuDAhsFZO_whIeW5RUe2ADlK18';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private app = initializeApp(firebaseConfig);
  private messaging = getMessaging(this.app);

  constructor() {
    this.listenForForegroundMessages();
  }

  async requestPermissionAndGetToken(): Promise<string | null> {
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }

    try {
      const token = await getToken(this.messaging, { vapidKey: VAPID_KEY });
      console.log('FCM token:', token);
      return token;
    } catch (err) {
      console.error('FCM token error:', err);
      return null;
    }
  }

  private listenForForegroundMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);
      new Notification(payload.notification?.title ?? 'Notification', {
        body: payload.notification?.body,
      });
    });
  }

  showLocalNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body});
    }
  }
}

