import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';
import {
  getMessaging,
  getToken,
  provideMessaging,
} from '@angular/fire/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAGo1TY-IJznUAU05G6X6sGqnS36eWkpyY',
  authDomain: 'todo-18fa3.firebaseapp.com',
  projectId: 'todo-18fa3',
  storageBucket: 'todo-18fa3.firebasestorage.app',
  messagingSenderId: '732085319722',
  appId: '1:732085319722:web:420bdc5b5cc336e0206b53',
  measurementId: 'G-PWH1NR6P03',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'todo-18fa3',
        appId: '1:732085319722:web:420bdc5b5cc336e0206b53',
        storageBucket: 'todo-18fa3.firebasestorage.app',
        apiKey: 'AIzaSyAGo1TY-IJznUAU05G6X6sGqnS36eWkpyY',
        authDomain: 'todo-18fa3.firebaseapp.com',
        messagingSenderId: '732085319722',
        measurementId: 'G-PWH1NR6P03',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
  ],
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

navigator.serviceWorker
  .register('./firebase-messaging-sw.js')
  .then((registration) => {
    getToken(messaging, {
      vapidKey:
        'BFm9CUyfsipFBujlTv9puPmCh5epnWCwtK0_JY2QYn_ElIiPvtAQh_iucT2ULsuDAhsFZO_whIeW5RUe2ADlK18',
      serviceWorkerRegistration: registration,
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log(currentToken);
        } else {
          console.log(
            'no reg token available. request permission to genereate one'
          );
        }
      })
      .catch((err) => {
        console.log('An error occured while retriveing token ', err);
      });
  });
