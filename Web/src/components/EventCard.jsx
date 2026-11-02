/* ==========================================
   COMPONENTE: EventCard
   Cartão que mostra as informações de um evento.
   Eu escrevo ele uma vez só e uso para todos os eventos.
   ========================================== */

/* Props:
   - titulo: nome do evento
   - categoria: tipo do evento (Palestra, Workshop...)
   - data: dia em que o evento acontece
   - local: onde o evento acontece
   - vagas: quantas vagas ainda restam */
function EventCard({ titulo, categoria, data, local, vagas }) {
  return (
    <article className="event-card">
      {/* Etiqueta com a categoria do evento */}
      <span className="event-categoria">{categoria}</span>

      {/* Nome do evento */}
      <h3>{titulo}</h3>

      {/* Informações do evento */}
      <p className="event-info">Data: {data}</p>
      <p className="event-info">Local: {local}</p>
      <p className="event-info">Vagas: {vagas}</p>

      {/* Botão de inscrição (a função dele vem depois) */}
      <button className="btn-principal">Inscrever-se</button>
    </article>
  );
}


// Disponibiliza o componente para outras páginas
export default EventCard;