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
})
export class App implements OnInit {
  private tasksService = inject(TasksService);

  tasks: TaskItem[] = [];
  loading = false;
  message = '';

  editingTaskId: number | null = null;
  searchTerm = '';

  newTask = {
    title: '',
    description: '',
    status: 'Pending'
  };

  ngOnInit(): void {
    this.loadTasks();
  }

  get filteredTasks(): TaskItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.tasks;
    }

    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(term)
    );
  }

  loadTasks(): void {
    this.loading = true;

    this.tasksService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        this.loading = false;
      },
      error: () => {
        this.message = 'Erro ao carregar tarefas.';
        this.loading = false;
      }
    });
  }

  createTask(): void {
    if (!this.newTask.title.trim()) {
      this.message = 'Informe o título da tarefa.';
      return;
    }

    this.tasksService.createTask(this.newTask).subscribe({
      next: () => {
        this.message = 'Tarefa criada com sucesso.';
        this.newTask = {
          title: '',
          description: '',
          status: 'Pending'
        };
        this.loadTasks();
      },
      error: () => {
        this.message = 'Erro ao criar tarefa.';
      }
    });
  }

  deleteTask(id: number): void {
    if (!confirm('Deseja realmente excluir esta tarefa?')) {
      return;
    }

    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        this.message = 'Tarefa excluída com sucesso.';
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: () => {
        this.message = 'Erro ao excluir tarefa.';
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
        task.status = updatedTask.status;
        this.message = 'Status atualizado com sucesso.';
      },
      error: () => {
        this.message = 'Erro ao atualizar status.';
      }
    });
  }

  startEdit(task: TaskItem): void {
    this.editingTaskId = task.id;
  }

  saveEdit(task: TaskItem): void {
    if (!task.title.trim()) {
      this.message = 'O título da tarefa não pode ficar vazio.';
      return;
    }

    this.tasksService.updateTask(task).subscribe({
      next: () => {
        this.message = 'Tarefa atualizada com sucesso.';
        this.editingTaskId = null;
      },
      error: () => {
        this.message = 'Erro ao atualizar tarefa.';
      }
    });
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.loadTasks();
  }

  getStatusLabel(status: string): string {
    return status === 'Completed' ? 'Concluída' : 'Pendente';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}