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
   - vagas: quantas vagas ainda restam
   - favorito: true se o evento está nos favoritos
   - inscrito: true se o aluno já está inscrito
   - aoFavoritar: função que roda ao clicar no coração
   - aoInscrever: função que roda ao clicar no botão de inscrição */

import { useState } from "react";

// Estilos do coração de favorito e do botão de cancelar
import "../styles/eventCard.css";

// Monta o cartão com os dados e as ações de um evento.

function EventCard({
  titulo,
  categoria,
  data,
  horario,
  local,
  vagas,
  descricao,
  favorito,
  inscrito,
  aoFavoritar,
  aoInscrever,
}) {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  return (
    <>
      <article
        className="event-card"
        onClick={() => setMostrarDetalhes(true)}
      >
        {/* Botão de favoritos */}
        <button
          type="button"
          className={favorito ? "btn-favorito ativo" : "btn-favorito"}
          onClick={(e) => {
            e.stopPropagation();
            aoFavoritar();
          }}
          aria-pressed={favorito}
          aria-label={
            favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill={favorito ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <span className="event-categoria">{categoria}</span>

        <h3>{titulo}</h3>

        <p className="event-info">Data: {data}</p>
        <p className="event-info">Local: {local}</p>
        <p className="event-info">Vagas: {vagas}</p>

        {/* Botão de inscrição */}
        <button
          type="button"
          className={inscrito ? "btn-principal btn-cancelar" : "btn-principal"}
          onClick={(e) => {
            e.stopPropagation();
            aoInscrever();
          }}
        >
          {inscrito ? "Cancelar inscrição" : "Inscrever-se"}
        </button>
      </article>

      {/* Janela com os detalhes do evento */}
      {mostrarDetalhes && (
        <div
          className="evento-modal-fundo"
          onClick={() => setMostrarDetalhes(false)}
        >
          <section
            className="evento-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="evento-modal-fechar"
              onClick={() => setMostrarDetalhes(false)}
              aria-label="Fechar detalhes"
            >
              &times;
            </button>

            <span className="event-categoria">{categoria}</span>

            <h2>{titulo}</h2>

            <p className="evento-modal-descricao">
              {descricao || "Nenhuma descrição foi informada."}
            </p>

            <div className="evento-modal-informacoes">
              <p><strong>Data:</strong> {data}</p>
              {horario && <p><strong>Horário:</strong> {horario}</p>}
              <p><strong>Local:</strong> {local}</p>
              <p><strong>Vagas:</strong> {vagas}</p>
            </div>

            <button
              type="button"
              className={inscrito ? "btn-principal btn-cancelar" : "btn-principal"}
              onClick={aoInscrever}
            >
              {inscrito ? "Cancelar inscrição" : "Inscrever-se"}
            </button>
          </section>
        </div>
      )}
    </>
  );
}

export default EventCard;
