import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
} from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router: Router = inject(Router);

  currentUser$: Observable<any>;
  constructor(private auth: Auth) {
    this.currentUser$ = authState(this.auth);
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async registration(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

 logout() {
  return signOut(this.auth).then(() => {
    this.router.navigate(['/login']);
  });
}
}
