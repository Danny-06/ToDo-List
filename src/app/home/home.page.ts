import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public tasksService: TasksService, private router: Router) {

  }

  goEditTask(id?: number) {
    this.router.navigateByUrl(`/edit/${id != null ? id : ''}`)
  }

}
