import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Todo {
  id?: number;
  listId: number; // a lista id-je, amihez tartozik
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
      this.loadLists();
      this.loadTodos();
    };

    request.onerror = (event: any) => {
      console.error('Database error:', event);
    };
  }

  // ----------------------
  // LIST CRUD
  // ----------------------

  async addList(list: TodoList): Promise<number> {
    const tr = this.db.transaction(this.listStore, 'readwrite');
    const store = tr.objectStore(this.listStore);

    const id = await new Promise<number>((resolve, reject) => {
      const request = store.add(list);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });

    this.loadLists();
    return id;
  }

  async getAllLists(): Promise<TodoList[]> {
    const tr = this.db.transaction(this.listStore, 'readonly');
    const store = tr.objectStore(this.listStore);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateList(list: TodoList) {
    const tr = this.db.transaction(this.listStore, 'readwrite');
    const store = tr.objectStore(this.listStore);

    await new Promise<void>((resolve, reject) => {
      const request = store.put(list);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    this.loadLists();
  }

  async deleteList(listId: number) {
    // Töröljük a listát
    const trList = this.db.transaction(this.listStore, 'readwrite');
    const storeList = trList.objectStore(this.listStore);
    await new Promise<void>((resolve, reject) => {
      const request = storeList.delete(listId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Töröljük a hozzá tartozó todos-t
    const trTodos = this.db.transaction(this.todoStore, 'readwrite');
    const storeTodos = trTodos.objectStore(this.todoStore);
    const index = storeTodos.index('listIdIndex');

    index.openCursor(IDBKeyRange.only(listId)).onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        storeTodos.delete(cursor.primaryKey);
        cursor.continue();
      }
    };

    this.loadLists();
    this.loadTodos();
  }

  private async loadLists() {
    const lists = await this.getAllLists();
    this.lists$.next(lists);
  }

  // ----------------------
  // TODO CRUD
  // ----------------------

  async addTodo(todo: Todo): Promise<number> {
    const tr = this.db.transaction(this.todoStore, 'readwrite');
    const store = tr.objectStore(this.todoStore);

    const id = await new Promise<number>((resolve, reject) => {
      const request = store.add(todo);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });

    this.loadTodos();
    return id;
  }

  async getTodosByList(listId: number): Promise<Todo[]> {
    const tr = this.db.transaction(this.todoStore, 'readonly');
    const store = tr.objectStore(this.todoStore);
    const index = store.index('listIdIndex');

    return new Promise((resolve, reject) => {
      const request = index.getAll(listId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTodo(todo: Todo) {
    const tr = this.db.transaction(this.todoStore, 'readwrite');
    const store = tr.objectStore(this.todoStore);

    await new Promise<void>((resolve, reject) => {
      const request = store.put(todo);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    this.loadTodos();
  }

  async deleteTodo(todoId: number) {
    const tr = this.db.transaction(this.todoStore, 'readwrite');
    const store = tr.objectStore(this.todoStore);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(todoId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    this.loadTodos();
  }

  private async loadTodos() {
    const tr = this.db.transaction(this.todoStore, 'readonly');
    const store = tr.objectStore(this.todoStore);

    const todos: Todo[] = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    this.todos$.next(todos);
  }
}
