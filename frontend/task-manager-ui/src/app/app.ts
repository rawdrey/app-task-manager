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
    this.message = '';

    this.tasksService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 0) {
          this.message = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';
          return;
        }

        this.message = 'Erro ao carregar tarefas. Tente novamente.';
      }
    });
  }

  createTask(): void {
    if (!this.newTask.title.trim()) {
      this.message = 'O título da tarefa é obrigatório.';
      return;
    }

    if (!this.newTask.description.trim()) {
      this.message = 'A descrição da tarefa é obrigatória.';
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
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Erro de conexão com o servidor. Verifique se a API está em execução.';
          return;
        }

        this.message = 'Não foi possível criar a tarefa.';
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
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Erro de conexão com o servidor.';
          return;
        }

        this.message = 'Não foi possível excluir a tarefa.';
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
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Erro de conexão com o servidor.';
          return;
        }

        this.message = 'Erro ao atualizar o status da tarefa.';
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

    if (!task.description.trim()) {
      this.message = 'A descrição da tarefa não pode ficar vazia.';
      return;
    }

    this.tasksService.updateTask(task).subscribe({
      next: () => {
        this.message = 'Tarefa atualizada com sucesso.';
        this.editingTaskId = null;
      },
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Erro de conexão com o servidor.';
          return;
        }

        this.message = 'Erro ao atualizar a tarefa.';
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