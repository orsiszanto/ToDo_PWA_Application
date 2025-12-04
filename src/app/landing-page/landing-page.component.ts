import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-landing-page',
  imports: [ MatButtonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPage {
  constructor(private router: Router){}

  routerLogin(){
    this.router.navigate(['/login']);
  }
  routerRegistrate(){
    this.router.navigate(['/registrate'])
  }
  

}