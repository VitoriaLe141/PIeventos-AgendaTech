/* ==========================================
   COMPONENTE: EventCard
   Cartão que mostra as informações de um evento.
   Eu escrevo ele uma vez só e uso para todos os eventos.
   ========================================== */

// Estilos do coração de favorito e do botão de cancelar
import "../styles/eventCard.css";

/* Props:
   - titulo: nome do evento
   - categoria: tipo do evento (Palestra, Workshop...)
   - data: dia em que o evento acontece
   - local: onde o evento acontece
   - vagas: quantas vagas ainda restam
   - favorito: true se o evento está nos favoritos
   - inscrito: true se o aluno já está inscrito
   - aoFavoritar: função que roda ao clicar no coração
   - aoInscrever: função que roda ao clicar no botão de inscrição */
function EventCard({
  titulo,
  categoria,
  data,
  local,
  vagas,
  favorito,
  inscrito,
  aoFavoritar,
  aoInscrever,
}) {
  return (
    <article className="event-card">
      {/* Coração para favoritar (fica no canto do card) */}
      <button
        type="button"
        className={favorito ? "btn-favorito ativo" : "btn-favorito"}
        onClick={aoFavoritar}
        aria-pressed={favorito}
        aria-label={
          favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
      >
        {/* O tamanho do ícone é definido no eventCard.css 
            O viewBox é só o "sistema de coordenadas" do desenho, não é tamanho */}
        <svg
          viewBox="0 0 24 24"
          /* Coração preenchido quando é favorito, só o contorno quando não é */
          fill={favorito ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Etiqueta com a categoria do evento */}
      <span className="event-categoria">{categoria}</span>

      {/* Nome do evento */}
      <h3>{titulo}</h3>

      {/* Informações do evento */}
      <p className="event-info">Data: {data}</p>
      <p className="event-info">Local: {local}</p>
      <p className="event-info">Vagas: {vagas}</p>

      {/* Botão de inscrição: vira "Cancelar inscrição" se já estiver inscrito */}
      <button
        type="button"
        className={inscrito ? "btn-principal btn-cancelar" : "btn-principal"}
        onClick={aoInscrever}
      >
        {inscrito ? "Cancelar inscrição" : "Inscrever-se"}
      </button>
    </article>
  );
}


// Disponibiliza o componente para outras páginas
export default EventCard;
