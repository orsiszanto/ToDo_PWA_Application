import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ MatButtonModule],
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