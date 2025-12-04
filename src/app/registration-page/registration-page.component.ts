import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [MatButtonModule, MatFormField, MatInputModule, FormsModule],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
})
export class RegistrationPage {
  email = '';
  password = '';

  constructor(private router: Router, private auth: AuthService) {}

  async registration() {
    try {
      await this.auth.registration(this.email, this.password);
      alert('Sikeres regisztráció!');
      this.router.navigate(['/login']);
    } catch (err) {
      console.error(err);
      alert('Hiba a regisztráció során!');
    }
  }

  routerLogin() {
    this.router.navigate(['/login']);
  }
}
