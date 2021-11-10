import { Task } from './../model/task';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TasksService {

  tasks: Task[] = []
  taskCounter: number = 0

  constructor() {

    this.tasks = [
      {
        id: 0,
        title: 'Hacer la colada',
        description: 'Separar la ropa blanca de la de color'
      },
      {
        id: 1,
        title: 'Estudiar Acceso a Datos',
        description: 'Hacer todos los ejercicios'
      },
      {
        id: 2,
        title: 'Sacar al perro',
        description: 'Contarle un cuento para que se relaje'
      }
    ]

    this.taskCounter = this.tasks.length

  } // constructor()

  getTask(id: number): Task {
    return this.tasks.filter(task => task.id === id)[0]
  }

  getTasks(): Task[] {
    return this.tasks
  }

  getTasksObservable(): Observable<Task[]> {
    return of(this.tasks)
  }

  saveTask(task: Task) {
    // Si la ID es nula, entonces se va a añadir una nueva tarea a la lista
    if (task.id == null) {
      const id = this.taskCounter++
      this.tasks.push({id, ...task})
    } else {
      // Si no, se va a editar una tarea ya existente
      const currentTask = this.getTask(task.id)
      Object.assign(currentTask, task)
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id)
  }

}
