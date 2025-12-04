import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "todo-18fa3", appId: "1:732085319722:web:420bdc5b5cc336e0206b53", storageBucket: "todo-18fa3.firebasestorage.app", apiKey: "AIzaSyAGo1TY-IJznUAU05G6X6sGqnS36eWkpyY", authDomain: "todo-18fa3.firebaseapp.com", messagingSenderId: "732085319722", measurementId: "G-PWH1NR6P03", projectNumber: "732085319722", version: "2" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })]
};
