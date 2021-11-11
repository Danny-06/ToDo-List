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

  constructor() {}

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


  // Storage Methods

  async getTaskFromStorage(id: number): Promise<Task> {
    const tasks = await this.getTasksFromStorage()
    return tasks.filter(task => task.id === id)[0]
  }

  async getTasksFromStorage(): Promise<Task[]> {
    const {value: tasks} = await Storage.get({key: 'tasks'})
    const parsedTasks = JSON.parse(tasks)

    if (tasks) return parsedTasks
    return []
  }

  async addTaskToStorage(task: Task): Promise<void> {
    const tasks = await this.getTasksFromStorage()
    const id = this.taskCounter++
    tasks.push({id, ...task})

    const tasksString = JSON.stringify(tasks)

    Storage.set({
      key: 'tasks',
      value: tasksString
    })
  }

  async getMaxTaskID(): Promise<number>  {
    const tasks = await this.getTasksFromStorage()
    const tasksIDs = tasks.map(task => task.id)
    const id = Math.max(...tasksIDs)

    return id ?? 0
  }

}
