import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SyncService } from '../services/sync.service';
import { IndexedDBService, Todo } from '../services/indexeddb.service';
import { FirestoreService} from '../services/firestore.service';
import { v4 as uuidv4 } from 'uuid';

import { CommonModule } from '@angular/common';
import { fromEvent, Observable } from 'rxjs';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPage {
  todos$!: Observable<Todo[]>;   // minden todo egyetlen listában
  newTodo = '';

  constructor(
    private indexedDBService: IndexedDBService,
    private firestoreService: FirestoreService,
    private auth: AuthService,
    private syncService: SyncService
  ) {
    if(fromEvent(window, 'online')){
      this.todos$ = this.firestoreService.getTodos();
      return;
    }
    this.todos$ = this.indexedDBService.todos$;
  }

async addTodo() {
    if (!this.newTodo.trim()) return;
    if(fromEvent(window, 'online')){
      let ref = await this.firestoreService.addTodo({
        id: uuidv4(),
        title: this.newTodo,
        completed: false,
      })
      this.firestoreService.getTodos();
      return;
    }

    this.syncService.addTodo({
      id: uuidv4(),   // vagy uuidv4()
      title: this.newTodo,
      completed: false,
    }).subscribe({
      next: () => (this.newTodo = ''),
      error: (err: any) => console.error(err),
    });
  }

  toggleCompletion(todo: Todo) {
    const updated = { ...todo, completed: !todo.completed };
    if(fromEvent(window, 'online')){
      this.firestoreService.updateTodo(updated)
      return
    }
    this.syncService.updateTodo(updated).subscribe();
  }

  deleteTodo(todo: Todo) {
    if (!todo.id) return;
    if(fromEvent(window, 'online')){
      this.firestoreService.deleteTodo(todo.id)
      return;
    }
    this.syncService.deleteTodo(todo).subscribe({
      error: (err: any) => console.error(err),
    });
  }

  logout() {
    this.auth.logout();
  }
}
