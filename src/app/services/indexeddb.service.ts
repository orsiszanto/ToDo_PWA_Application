import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, take, switchMap } from 'rxjs';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db!: IDBDatabase;
  private dbReady$ = new BehaviorSubject<boolean>(false);

  private readonly todoStore = 'todos';

  public readonly todos$ = new BehaviorSubject<Todo[]>([]);

  constructor() {
    this.initDB();
  }

  private initDB() {
    const request = indexedDB.open('todo-db', 1);

    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      if (!db.objectStoreNames.contains(this.todoStore)) {
        // nincs autoIncrement, mert string ID-t használunk
        db.createObjectStore(this.todoStore, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadTodos().subscribe();
      this.dbReady$.next(true);
    };

    request.onerror = (event: any) => console.error('Database error:', event);
  }

  private getDB(): Observable<IDBDatabase> {
    return this.dbReady$.pipe(
      filter(ready => ready),
      take(1),
      map(() => this.db)
    );
  }

  addTodo(todo: Todo): Observable<string> {
    return this.getDB().pipe(
      switchMap(db => new Observable<string>(observer => {
        const tr = db.transaction(this.todoStore, 'readwrite');
        const store = tr.objectStore(this.todoStore);
        const req = store.add(todo);

        req.onsuccess = () => {
          observer.next(req.result as string);
          observer.complete();
          this.loadTodos().subscribe();
        };
        req.onerror = () => observer.error(req.error);
      }))
    );
  }

  updateTodo(todo: Todo): Observable<void> {
    return this.getDB().pipe(
      switchMap(db => new Observable<void>(observer => {
        const tr = db.transaction(this.todoStore, 'readwrite');
        const store = tr.objectStore(this.todoStore);
        const req = store.put(todo);

        req.onsuccess = () => {
          this.loadTodos().subscribe(() => {
            observer.next();
            observer.complete();
          });
        };
        req.onerror = () => observer.error(req.error);
      }))
    );
  }

  deleteTodo(todoId: string): Observable<void> {
    return this.getDB().pipe(
      switchMap(db => new Observable<void>(observer => {
        const tr = db.transaction(this.todoStore, 'readwrite');
        const store = tr.objectStore(this.todoStore);
        const req = store.delete(todoId);

        req.onsuccess = () => {
          this.loadTodos().subscribe(() => {
            observer.next();
            observer.complete();
          });
        };
        req.onerror = () => observer.error(req.error);
      }))
    );
  }

  private loadTodos(): Observable<void> {
    return this.getDB().pipe(
      switchMap(db => new Observable<void>(observer => {
        const tr = db.transaction(this.todoStore, 'readonly');
        const store = tr.objectStore(this.todoStore);
        const req = store.getAll();
        req.onsuccess = () => {
          this.todos$.next(req.result);
          observer.next();
          observer.complete();
        };
        req.onerror = () => observer.error(req.error);
      }))
    );
  }
}
