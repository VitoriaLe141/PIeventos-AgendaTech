/* ==========================================
   PÁGINA: Minhas inscrições
   Mostra os eventos em que o aluno se inscreveu,
   do mais próximo para o mais distante.
   Aqui também dá para cancelar a inscrição.
   ========================================== */

// Importação dos estilos
import "../styles/paginaInicial.css";
import "../styles/paginasInternas.css";

// Importação dos dados
import { eventos, transformarEmData } from "../data/eventos";

// Importação dos componentes
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";


  function MinhasInscricoes({
    usuario,
    favoritos,
    inscricoes,
    aoFavoritar,
    aoInscrever,
    aoNavegar,
    aoSair,
  })  {

  // 1) Fica só com os eventos em que o aluno está inscrito
  const eventosInscritos = eventos.filter((evento) =>
    inscricoes.includes(evento.id)
  );

  // 2) Ordeno pela data (o [...lista] faz uma cópia da lista)
  const eventosOrdenados = [...eventosInscritos].sort(
    (a, b) => transformarEmData(a.data) - transformarEmData(b.data)
  );

  return (
    <div className="pagina-inicial">
      {/* Menu lateral (com o "Minhas inscrições" destacado) */}
      <Sidebar
        paginaAtual="inscricoes"
        usuario={usuario}
        aoNavegar={aoNavegar}
        aoSair={aoSair}
      />

      <main className="conteudo">
        <header className="boas-vindas">
          <h1>Minhas inscrições</h1>
          <p>Acompanhe os eventos em que você vai participar.</p>
        </header>

        {eventosOrdenados.length > 0 ? (
          <>
            {/* usa singular ou plural conforme a quantidade */}
            <p className="resumo">
              Você tem <strong>{eventosOrdenados.length}</strong>{" "}
              {eventosOrdenados.length === 1
                ? "inscrição ativa"
                : "inscrições ativas"}
              .
            </p>

            <section className="lista-eventos">
              {eventosOrdenados.map((evento) => (
                <EventCard
                  key={evento.id}
                  titulo={evento.titulo}
                  categoria={evento.categoria}
                  data={evento.data}
                  local={evento.local}
                  vagas={evento.vagas}
                  favorito={favoritos.includes(evento.id)}
                  inscrito={true} /* sempre true: esta lista só tem inscrições */
                  aoFavoritar={() => aoFavoritar(evento.id)}
                  aoInscrever={() => aoInscrever(evento.id)}
                />
              ))}
            </section>
          </>
        ) : (
          <section className="estado-vazio">
            <p>Você ainda não se inscreveu em nenhum evento.</p>
            <button
              type="button"
              className="btn-principal btn-auto"
              onClick={() => aoNavegar("inicio")}
            >
              Ver eventos
            </button>
          </section>
        )}
      </main>
    </div>
  );
}


export default MinhasInscricoes;
