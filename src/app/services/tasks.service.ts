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

  async saveTask(task: Task) {
    // Si la ID es nula, entonces se va a añadir una nueva tarea a la lista
    if (task.id == null) return this.addTaskToStorage({...task})

    // Si no, se va a editar una tarea ya existente
    const tasks = await this.getTasksFromStorage()
    tasks.forEach(storedTask => {
      if (storedTask.id === task.id) Object.assign(storedTask, task)
    })

    const tasksStringify = JSON.stringify(tasks)

    await Storage.set({
      key: 'tasks',
      value: tasksStringify
    })

    this.tasks = await this.getTasksFromStorage()
  }

  async deleteTask(id: number) {
    await this.deleteTaskFromStore(id)
    this.tasks = await this.getTasksFromStorage()
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

  async deleteTaskFromStore(id: number) {
    const tasks = await this.getTasksFromStorage()
    const newTasks = tasks.filter(task => task.id !== id)
    const newTasksStringify = JSON.stringify(newTasks)

    return Storage.set({
      key: 'tasks',
      value: newTasksStringify
    })
  }

  async addTaskToStorage(task: Task): Promise<void> {
    const tasks = await this.getTasksFromStorage()
    const id = this.taskCounter++
    tasks.push({id, ...task})

    const tasksStringify = JSON.stringify(tasks)

    await Storage.set({
      key: 'tasks',
      value: tasksStringify
    })

    this.tasks = await this.getTasksFromStorage()
  }

  async getMaxTaskID(): Promise<number> {
    const tasks = await this.getTasksFromStorage()
    const tasksIDs = tasks.map(task => task.id)
    const id = Math.max(...tasksIDs)

    return Number.isFinite(id) ? id : -1
  }

}
