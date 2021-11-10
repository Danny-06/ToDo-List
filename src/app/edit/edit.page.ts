import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../model/task';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})

export class EditPage implements OnInit {

  task: Task = {title: '', description: ''}

  constructor(
    public tasksService: TasksService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const taskID = parseInt( this.activatedRoute.snapshot.paramMap.get('id') )

    const currentTask = this.tasksService.getTask(taskID)

    // Si se edita la tarea (si la ID no es NaN)
    // Rellenar los inputs con la información de la tarea
    if (!isNaN(taskID)) this.task = {...currentTask}
  }

  saveTask() {
    this.tasksService.saveTask(this.task)
    this.router.navigateByUrl('/home')
  }

}
