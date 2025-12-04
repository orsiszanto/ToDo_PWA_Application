import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, take, switchMap } from 'rxjs';

export interface Todo {
  id?: number;
  listId: number;
  title: string;
  completed: boolean;
}

export interface TodoList {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db!: IDBDatabase;
  private dbReady$ = new BehaviorSubject<boolean>(false);

  private readonly todoStore = 'todos';
  private readonly listStore = 'todoLists';

  public readonly todos$ = new BehaviorSubject<Todo[]>([]);
  public readonly lists$ = new BehaviorSubject<TodoList[]>([]);

  constructor() {
    this.initDB();
  }

  private initDB() {
    const request = indexedDB.open('todo-db', 1);

    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      if (!db.objectStoreNames.contains(this.listStore)) {
        db.createObjectStore(this.listStore, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(this.todoStore)) {
        const store = db.createObjectStore(this.todoStore, { keyPath: 'id', autoIncrement: true });
        store.createIndex('listIdIndex', 'listId', { unique: false });
      }
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadLists().subscribe();
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

  // ----------------------
  // LIST CRUD
  // ----------------------
  addList(list: TodoList): Observable<number> {
    return this.getDB().pipe(
      switchMap(db => new Observable<number>(observer => {
        const tr = db.transaction(this.listStore, 'readwrite');
        const store = tr.objectStore(this.listStore);
        const req = store.add(list);

        req.onsuccess = () => {
          observer.next(req.result as number);
          observer.complete();
          this.loadLists().subscribe(); // frissítjük a listákat
        };
        req.onerror = () => observer.error(req.error);
      }))
    );
  }

  updateList(list: TodoList): Observable<void> {
    return this.getDB().pipe(
      switchMap(db => new Observable<void>(observer => {
        const tr = db.transaction(this.listStore, 'readwrite');
        const store = tr.objectStore(this.listStore);
        const req = store.put(list);

        req.onsuccess = () => {
          this.loadLists().subscribe(() => {
            observer.next();
            observer.complete();
          });
        };
        req.onerror = () => observer.error(req.error);
      }))
    );
  }

  deleteList(listId: number): Observable<void> {
    return this.getDB().pipe(
      switchMap(db => new Observable<void>(observer => {
        // törlés a listStore-ból
        const trList = db.transaction(this.listStore, 'readwrite');
        const storeList = trList.objectStore(this.listStore);
        const reqList = storeList.delete(listId);

        reqList.onsuccess = () => {
          // törlés a todos-ból
          const trTodos = db.transaction(this.todoStore, 'readwrite');
          const storeTodos = trTodos.objectStore(this.todoStore);
          const index = storeTodos.index('listIdIndex');

          const cursorReq = index.openCursor(IDBKeyRange.only(listId));
          cursorReq.onsuccess = (event: any) => {
            const cursor = event.target.result;
            if (cursor) {
              storeTodos.delete(cursor.primaryKey);
              cursor.continue();
            }
          };

          cursorReq.onerror = () => observer.error(cursorReq.error);

          // frissítjük a BehaviorSubject-eket
          this.loadLists().subscribe(() => {
            this.loadTodos().subscribe(() => {
              observer.next();
              observer.complete();
            });
          });
        };
        reqList.onerror = () => observer.error(reqList.error);
      }))
    );
  }

  private loadLists(): Observable<void> {
    return this.getDB().pipe(
      switchMap(db => new Observable<void>(observer => {
        const tr = db.transaction(this.listStore, 'readonly');
        const store = tr.objectStore(this.listStore);
        const req = store.getAll();
        req.onsuccess = () => {
          this.lists$.next(req.result);
          observer.next();
          observer.complete();
        };
        req.onerror = () => observer.error(req.error);
      }))
    );
  }

  // ----------------------
  // TODO CRUD
  // ----------------------
  addTodo(todo: Todo): Observable<number> {
    return this.getDB().pipe(
      switchMap(db => new Observable<number>(observer => {
        const tr = db.transaction(this.todoStore, 'readwrite');
        const store = tr.objectStore(this.todoStore);
        const req = store.add(todo);

        req.onsuccess = () => {
          observer.next(req.result as number);
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

  deleteTodo(todoId: number): Observable<void> {
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

  getTodosByList(listId: number): Observable<Todo[]> {
    return this.todos$.pipe(
      map(todos => todos.filter(todo => todo.listId === listId))
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
