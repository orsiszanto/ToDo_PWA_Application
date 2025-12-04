import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';


import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login-page',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPage {
  email = '';
  password='';

  constructor(private router: Router, private auth: AuthService) {}

 async login(){
  try{
    await this.auth.login(this.email, this.password);
    this.router.navigate(['/main']);
  }catch(err){
console.error(err);
alert('Nem megfelelő email cím vagy jelszó!');
  }
 }

 routerRegistration(){
  this.router.navigate(['/registrate']);
 }
}
