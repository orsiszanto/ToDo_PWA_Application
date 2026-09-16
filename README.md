# Todoapp

Todoapp is a small single-page task manager built as an Angular Progressive Web App prototype. It demonstrates authenticated user flows, CRUD operations, browser persistence, push notifications, and a responsive Material UI.

The interface is primarily written in Hungarian. The source code and documentation are in English.

## Project context

This project was created for a Progressive Web Apps course at the University of Szeged during my BSc studies in Computer Science. It was developed as a learning project to explore Angular, Firebase, offline-capable browser storage, push notifications, and PWA deployment concepts.

## Project status

This repository contains the application prototype and its original Firebase integration. The Firebase project used during development has been deleted, so the hosted backend is no longer active.

As a result, the repository should be treated as an archived or portfolio project rather than a currently deployed application. Firebase Authentication, Cloud Firestore, and Firebase Cloud Messaging will not work until the configuration is connected to a new Firebase project. The code remains useful for demonstrating the architecture and implementation approach.

## Features

- Landing page with navigation to login and registration.
- Email/password registration and login through Firebase Authentication.
- Protected todo page using an Angular route guard.
- Add, complete, and delete todo items.
- Cloud persistence with Firestore.
- Intended local persistence with IndexedDB for offline use.
- A synchronization service boundary for moving local todos to Firestore.
- Browser notifications through Firebase Cloud Messaging.
- Foreground notifications through the application and background notifications through a Firebase messaging service worker.
- Installable PWA metadata and Angular service-worker asset caching in production builds.
- Responsive styling with Angular Material and SCSS.

## How the main solutions work

### Authentication and route protection

`AuthService` wraps Firebase Authentication and exposes the current user as an RxJS observable. The `authGuard` subscribes to that auth state before allowing access to `/main`. Unauthenticated users are redirected to `/login`, so the main task screen is not directly accessible without a signed-in account.

### Todo persistence

`FirestoreService` provides the remote CRUD operations. Firestore's `collectionData` returns an observable collection, which allows the todo list to react to remote changes without manually polling the server.

`IndexedDBService` provides a browser-local `todos` object store and exposes its contents through a `BehaviorSubject`. This gives the application a local data source that can be used when a network connection is unavailable.

`SyncService` is the boundary between local storage and cloud storage. It delegates local add, update, and delete operations to IndexedDB and includes a path for pushing local todos to Firestore when synchronization is required.

### Notifications

`NotificationService` requests browser notification permission, obtains an FCM registration token, and listens for messages while the app is open. `firebase-messaging-sw.js` handles background messages and uses the browser service-worker notification API, allowing notifications to appear when the application is not in the foreground.

### PWA behavior

The web manifest defines the installable application name, display mode, start URL, and icons. Angular's service worker prefetches the application shell and lazily caches static assets in production, improving repeat-load behavior and allowing the app shell to remain available when the network is unreliable.

## Technology stack

- Angular 19 standalone components
- TypeScript 5.7
- Angular Router with lazy-loaded routes
- Angular Material 19 and Angular CDK
- RxJS 7.8
- SCSS
- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Messaging
- Browser IndexedDB API
- Angular Service Worker and PWA manifest
- Karma and Jasmine configuration for unit tests
- UUID for todo identifiers

## Important implementation notes

The project contains the pieces for online and offline operation, but the current connection check in `main-page.component.ts` needs further work. It tests the truthiness of `fromEvent(window, 'online')`, which is an Observable and therefore truthy immediately; it does not represent the current network state. A production version should use `navigator.onLine` together with `online` and `offline` event subscriptions, or a dedicated connection-state service.

The synchronization method is also present but is not currently invoked by the main page. Conflict resolution and user-specific todo filtering would need to be added before treating this as a production multi-user application.

## Firebase configuration

The original Firebase client configuration appears in the Angular configuration, notification service, and messaging service worker. These values are frontend configuration values, not Firebase Admin private keys, but they point to the deleted project and therefore no longer provide a working backend.

To reactivate the application, create a new Firebase project and configure:

1. Firebase Authentication with the email/password provider.
2. A Firestore database and security rules.
3. Firebase Cloud Messaging and a web push certificate key.
4. The new client configuration in the application and messaging service worker.

The Firestore security rules should restrict todos to their owner. The current service uses a shared `/todos` collection and does not add a user ID to each todo, so user-specific data isolation is not yet implemented in the application code.

## Local development

The project requires Node.js, npm, and the Angular CLI dependencies listed in `package.json`.

```bash
npm install
npm start
```

Then open `http://localhost:4200/`.

Other available commands:

```bash
npm run build
npm test
```

Because the original Firebase project was deleted, a local run without new Firebase credentials will not provide working authentication or cloud persistence.

## Portfolio description

Built a standalone Angular PWA prototype for a Progressive Web Apps course at the University of Szeged during my BSc in Computer Science. Implemented Firebase Authentication, Firestore CRUD, IndexedDB local persistence, protected routes, Angular Material UI, and Firebase Cloud Messaging, with observable state and a separate synchronization layer for future offline support.
