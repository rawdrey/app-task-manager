import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItem } from './models/task-item';
import { TasksService } from './services/tasks.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private tasksService = inject(TasksService);

  tasks: TaskItem[] = [];

  newTask = {
    title: '',
    description: '',
    status: 'Pending'
  };

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
      }
    });
  }

  createTask(): void {
    if (!this.newTask.title.trim() || !this.newTask.description.trim()) {
      return;
    }

    this.tasksService.createTask(this.newTask).subscribe({
      next: () => {
        this.newTask = {
          title: '',
          description: '',
          status: 'Pending'
        };

        this.loadTasks();
      },
      error: (error) => {
        console.error('Erro ao criar tarefa:', error);
      }
    });
  }

  toggleTaskStatus(task: TaskItem): void {
    const updatedTask: TaskItem = {
      ...task,
      status: task.status === 'Pending' ? 'Completed' : 'Pending'
    };

    this.tasksService.updateTask(updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
      }
    });
  }

  deleteTask(id: number): void {
    const confirmed = confirm('Deseja realmente excluir esta tarefa?');

    if (!confirmed) {
      return;
    }

    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Erro ao excluir tarefa:', error);
      }
    });
  }

  getStatusLabel(status: string): string {
    if (status === 'Completed') {
      return 'Concluída';
    }

    return 'Pendente';
  }
}