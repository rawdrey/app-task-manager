import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from './models/task-item';
import { TasksService } from './services/tasks.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private tasksService = inject(TasksService);

  tasks: TaskItem[] = [];

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        console.log('Tasks loaded:', response);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }
}