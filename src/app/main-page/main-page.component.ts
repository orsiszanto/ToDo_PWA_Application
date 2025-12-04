import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  IndexedDBService,
  Todo,
  TodoList,
} from '../services/indexeddb.service';
import { CommonModule } from '@angular/common';
import { Observable, map, take } from 'rxjs';

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
  selectedList: TodoList | null = null;

  // Todos csak a kiválasztott listához
  todoLists$!: Observable<TodoList[]>;
  todos$!: Observable<Todo[]>;

  newTodo = '';
  newList = '';

  constructor(
    private indexedDBService: IndexedDBService,
    private auth: AuthService
  ) {
    this.todoLists$ = this.indexedDBService.lists$;
    this.todos$ = this.indexedDBService.todos$;
  }

  selectList(list: TodoList) {
    this.selectedList = list;
    this.todos$ = this.indexedDBService.getTodosByList(list.id!);
  }

addList() {
  if (!this.newList.trim()) return;

  this.indexedDBService.addList({ name: this.newList }).subscribe({
    next: () => {
      this.newList = '';
      // azonnal kiválasztjuk az új listát
      this.indexedDBService.lists$.pipe(take(1)).subscribe((lists: TodoList[]) => {
        const addedList = lists[lists.length - 1];
        this.selectList(addedList);
      });
    },
    error: (err) => console.error(err)
  });
}


  updateListName(list: TodoList, newName: string) {
    list.name = newName;
    this.indexedDBService.updateList(list).subscribe();
  }

  deleteList(list: TodoList) {
    if (!list.id) return;
    this.indexedDBService.deleteList(list.id).subscribe({
      next: () => {
        if (this.selectedList?.id === list.id) this.selectedList = null;
      },
    });
  }

addTodo() {
  if (!this.selectedList?.id || !this.newTodo.trim()) return;

  this.indexedDBService.addTodo({
    listId: this.selectedList.id,
    title: this.newTodo,
    completed: false
  }).subscribe({
    next: () => this.newTodo = '',
    error: (err) => console.error(err)
  });
}


  toggleCompletion(todo: Todo) {
    todo.completed = !todo.completed;
    this.indexedDBService.updateTodo(todo).subscribe();
  }

  deleteTodo(id?: number) {
    if (!id) return;
    this.indexedDBService.deleteTodo(id).subscribe();
  }

  logout() {
    this.auth.logout();
  }
}
