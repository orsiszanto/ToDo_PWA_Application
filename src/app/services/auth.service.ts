import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  get currentUserId(): string{
    return this.auth.currentUser?.uid || '0;'
  }

  async login(email: string, password:string){
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async registration(email:string,password:string){
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout(){
    signOut(this.auth).then(()=>{
      this.router.navigate(['/landing']);
    });
  }

  isLoggedIn(): boolean{
    return this.auth.currentUser != null;
  }
}
