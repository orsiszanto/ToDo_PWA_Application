import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IndexedDBService } from '../services/indexeddb';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, FormsModule, MatCheckboxModule, MatIconModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPage implements OnInit {
  todoLists: any[] = []; // pl. [{id: 1, name: 'Bevásárlás'}, {id: 2, name: 'Munka'}]
  selectedList: any = null;
  todos: any[] = [];
  newTodo = '';

  constructor(private indexedDBService: IndexedDBService, private auth: AuthService) {}

  async ngOnInit() {
    this.todoLists = [
      { id: 1, name: 'Shopping' },
      { id: 2, name: 'Work' },
    ];
  }

  selectList(list: any) {
    this.selectedList = list;
    this.loadTodos();
  }

  async loadTodos() {
    const all = await this.indexedDBService.getAll();
    this.todos = all.filter((t) => t.listId === this.selectedList.id);
  }

  async addTodo() {
    if (this.newTodo.trim() && this.selectedList) {
      await this.indexedDBService.add({
        listId: this.selectedList.id,
        title: this.newTodo,
        completed: false,
      });
      this.newTodo = '';
      await this.loadTodos();
    }
  }

  async toggleCompletion(todo: any) {
    todo.completed = !todo.completed;
    await this.indexedDBService.update(todo);
    await this.loadTodos();
  }

  async deleteTodo(id: number) {
    await this.indexedDBService.delete(id);
    await this.loadTodos();
  }

  logout() {
    this.auth.logout();
  }
}
