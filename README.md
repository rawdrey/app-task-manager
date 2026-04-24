Aplicação web simples para cadastro e gerenciamento de tarefas, desenvolvida como desafio técnico do Bootcamp Web Front.
Tecnologias utilizadas
Front-end
Angular
TypeScript
Tailwind CSS
HttpClient
Back-end
ASP.NET Core Web API
C#
Entity Framework Core
SQL Server
Funcionalidades
Listar tarefas
Criar tarefas
Editar tarefas
Excluir tarefas
Alterar status da tarefa
Buscar tarefa por título
Exibir data de criação
Mensagens de sucesso e erro
Validação simples de formulário
Estrutura do projeto
app-task-manager
backend
TaskManager.Api
frontend
task-manager-ui
Como executar o back-end
Acesse a pasta da API
cd backend/TaskManager.Api
Restaure as dependências
dotnet restore
Aplique as migrations no banco
dotnet ef database update
Execute a API
dotnet run
A API ficará disponível em
http://localhost:5077
Swagger
http://localhost:5077/swagger
Como executar o front-end
Acesse a pasta do Angular
cd frontend/task-manager-ui
Instale as dependências
npm install
Execute o projeto
ng serve
A aplicação ficará disponível em
http://localhost:4200
Banco de dados
O projeto utiliza SQL Server com Entity Framework Core.
A string de conexão está configurada no arquivo Program.cs dentro do backend.
Banco utilizado
TaskManagerDb
Endpoints da API
GET /api/Tasks
GET /api/Tasks/{id}
POST /api/Tasks
PUT /api/Tasks/{id}
DELETE /api/Tasks/{id}
Observações
Para o front-end consumir a API corretamente, o back-end precisa estar rodando antes.
O CORS está configurado para permitir requisições do Angular em
http://localhost:4200
Autor
Desenvolvido por Rawdrey Anderson Nobre Rodrigues.