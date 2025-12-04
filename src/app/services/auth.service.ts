import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private auth = getAuth();

  constructor(private router: Router){}

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

