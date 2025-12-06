import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ MatButtonModule, MatCardModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPage {
  constructor(private router: Router){}

  routerLogin(){
    this.router.navigate(['/login']);
  }
  routerRegistration(){
    this.router.navigate(['/registration'])
  }
}