import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Todo {
  id: string;          // Firestore doc ID
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  getTodos(): Observable<Todo[]> {
    const ref = collection(this.firestore, `/todos`);
    return collectionData(ref, { idField: 'id' }) as Observable<Todo[]>;
  }

  addTodo( data: Todo){
    const ref = collection(this.firestore, `/todos`);
    console.log(data);
    return addDoc(ref, data);
  }

  updateTodo(data: Todo) {
    const ref = doc(this.firestore, `todos/`,data.id);
    return updateDoc(ref,{
      'title':data.title,
      'completed':data.completed
    });
  }

  deleteTodo(todoId: string) {
    const ref = doc(this.firestore, `todos/${todoId}`);
    return deleteDoc(ref);
  }
}
