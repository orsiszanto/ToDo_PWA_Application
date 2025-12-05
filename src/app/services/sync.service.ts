import { Injectable } from '@angular/core';
import { FirestoreService, Todo as FirestoreTodo } from './firestore.service';
import { IndexedDBService, Todo as LocalTodo } from './indexeddb.service';
import { BehaviorSubject, from } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  public readonly syncedTodos$ = new BehaviorSubject<LocalTodo[]>([]);

  constructor(
    private firestoreService: FirestoreService,
    private indexedDBService: IndexedDBService
  ) {}

  // 🔹 Push IndexedDB → Firestore
 PushToFirestore(userId: string) {
    this.indexedDBService.todos$.subscribe(localTodos => {
      localTodos.forEach(todo => {
        if (!todo.id) {
          // ha nincs ID, generálunk egyet
          const newTodo: FirestoreTodo = { ...todo, id: uuidv4() };
          from(this.firestoreService.addTodo(newTodo)).subscribe();
        } else {
          this.firestoreService.updateTodo(todo).then();
        }
      });
    });
  }

  // 🔹 Add todo offline → majd sync Firestore
  addTodo(todo: LocalTodo) {
    const newTodo: LocalTodo = {
      ...todo
    };
    return this.indexedDBService.addTodo(newTodo);
  }

  // 🔹 Update todo offline → majd sync Firestore
  updateTodo(todo: LocalTodo) {
    return this.indexedDBService.updateTodo(todo);
  }

  // 🔹 Delete todo offline → majd sync Firestore
  deleteTodo(todo: LocalTodo) {
    return this.indexedDBService.deleteTodo(todo.id);
  }
}
