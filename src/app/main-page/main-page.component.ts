import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IndexedDBService, Todo, TodoList } from '../services/indexeddb.service';
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
  todoLists: TodoList[] = []; // pl. [{id: 1, name: 'Bevásárlás'}, {id: 2, name: 'Munka'}]
  selectedList: TodoList | null=null;
  todos: Todo[] = [];
  newTodo = '';
  newList = '';

  constructor(private indexedDBService: IndexedDBService, private auth: AuthService) {}

  async ngOnInit() {
    await this.loadLists();
  }

  // List
  async loadLists(){
    this.todoLists = await this.indexedDBService.getAllLists();
  }

  async addList(){
    if(this.newList.trim()){
      await this.indexedDBService.addList({name: this.newList});
      this.newList = '';
      await this.loadLists();
    }
  }

  async selectList(list: TodoList) {
    this.selectedList = list;

    await this.loadTodos();
  }

  async updateListName(list: TodoList, newName: string){
    list.name = newName;

    await this.indexedDBService.updateList(list);
    await this.loadLists();
  }

  async deleteList(list: TodoList){
    if(!list.id){
      return;
    }
    await this.indexedDBService.deleteList(list.id);

    if(this.selectedList?.id === list.id){
      this.selectedList = null;
    }
    await this.loadLists();

    this.todos=[];
  }

  //Todo
  async loadTodos() {
    if(!this.selectedList?.id){
      return;
    }
    this.todos = await this.indexedDBService.getTodosByList(this.selectedList.id);
  }

  async addTodo() {
    if (!this.selectedList?.id || !this.newTodo.trim()) {
      return;
    }
      await this.indexedDBService.addTodo({
        listId: this.selectedList.id,
        title: this.newTodo,
        completed: false,
      });
      this.newTodo = '';
      await this.loadTodos();
  }

  async toggleCompletion(todo: Todo) {
    todo.completed = !todo.completed;
    await this.indexedDBService.updateTodo(todo);
    await this.loadTodos();
  }

  async deleteTodo(id?: number) {
    if(id===undefined){
      return;
    }
    await this.indexedDBService.deleteTodo(id);
    await this.loadTodos();
  }

  logout() {
    this.auth.logout();
  }
}
