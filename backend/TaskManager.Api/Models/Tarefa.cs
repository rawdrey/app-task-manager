namespace TaskManager.Api.Models
{
    public class Tarefa
    {
        public int Id { get; set; }

        public string Titulo { get; set; }

        public string Descricao { get; set; }

        public string Status { get; set; } // Pendente / Concluida

        public DateTime DataCriacao { get; set; } = DateTime.Now;
    }
}