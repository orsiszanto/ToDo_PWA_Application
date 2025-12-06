import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardActions } from "@angular/material/card";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatCard, MatCardActions],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private notification: NotificationService
  ) {}

  async login() {
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/main']);
    } catch (err) {
      console.error(err);
      this.onLoginFail();
    }
  }

  async onLoginFail() {
    await this.notification.requestPermissionAndGetToken(); 
    this.notification.showLocalNotification(
      'Login failed',
      'Helytelen felhasználónév vagy jelszó'
    );
  }

  routerRegistration() {
    this.router.navigate(['/registration']);
  }
}
