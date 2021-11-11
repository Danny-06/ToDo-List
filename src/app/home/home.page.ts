import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  constructor(public tasksService: TasksService, private router: Router) {}

  async ngOnInit() {
    const ts = this.tasksService

    localStorage.clear()

    ts.taskCounter = await ts.getMaxTaskID() + 1

    await ts.addTaskToStorage({title: 'Una tarea', description: 'Algo'})
    await ts.addTaskToStorage({title: 'Otra tarea', description: 'Algo más'})

    ts.tasks = await ts.getTasksFromStorage()
  }

  goEditTask(id?: number) {
    const idTask = id ?? ''
    this.router.navigateByUrl(`/edit/${idTask}`)
  }

}
