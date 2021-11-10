import { getTestBed } from '@angular/core/testing';
import { Task } from './../model/task';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})

export class TasksService {

  tasks: Task[] = []
  taskCounter: number = 0

  constructor() {

    ;(async function (_this) {

      localStorage.clear()

      const newTask = {
        id: 0,
        title: 'Una tarea',
        description: 'Algo'
      }

      await _this.addTaskToStorage(newTask)

      _this.tasks = await _this.getTasksFromStorage()

    })(this);

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

  async getTasksFromStorage(): Promise<Task[]> {
    const tasks = await Storage.get({key: 'tasks'})
    const parsedTasks = JSON.parse(tasks.value)

    if (tasks.value) return parsedTasks
    return []
  }

  async addTaskToStorage(task: Task) {
    let tasks = await this.getTasksFromStorage()
    tasks.push(task)
 
    const tasksString = JSON.stringify(tasks)

    Storage.set({
      key: 'tasks',
      value: tasksString
    })
  }

}
