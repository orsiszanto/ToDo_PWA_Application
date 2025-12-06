import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  requestPermission() {
    if (!('Notification' in window)) {
      console.log('Nem támogatott az értesítésekre!');
      return;
    }

    Notification.requestPermission().then((permission) => {
      console.log('Notification engedély:', permission);
    });
  }
  showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}
