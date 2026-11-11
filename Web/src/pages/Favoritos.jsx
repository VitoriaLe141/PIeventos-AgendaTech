/* ==========================================
   PÁGINA: Favoritos
   Mostra os eventos que o aluno marcou
   com o coração na página inicial.
   ========================================== */

// Importação dos estilos
import "../styles/paginaInicial.css";
import "../styles/paginasInternas.css";

// Importação dos dados
import { eventos } from "../data/eventos";

// Importação dos componentes
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";


function Favoritos({
  usuario,
  favoritos,
  inscricoes,
  aoFavoritar,
  aoInscrever,
  aoNavegar,
  aoSair,
}) {

  // Fico só com os eventos que estão na lista de favoritos
  const eventosFavoritos = eventos.filter((evento) =>
    favoritos.includes(evento.id)
  );

  return (
    <div className="pagina-inicial">
      {/* Menu lateral (com o link "Favoritos" destacado) */}
      <Sidebar
        paginaAtual="favoritos"
        usuario={usuario}
        aoNavegar={aoNavegar}
        aoSair={aoSair}
      />

      <main className="conteudo">
        {/* Título da página (usa o mesmo estilo das boas-vindas) */}
        <header className="boas-vindas">
          <h1>Favoritos</h1>
          <p>Os eventos que você marcou para não perder.</p>
        </header>

        {/* Se tem favoritos, mostra os cards. Se não, mostra um aviso */}
        {eventosFavoritos.length > 0 ? (
          // O map cria um card para cada evento favorito
          <section className="lista-eventos">
            {eventosFavoritos.map((evento) => (
              <EventCard
                key={evento.id}
                titulo={evento.titulo}
                categoria={evento.categoria}
                data={evento.data}
                local={evento.local}
                vagas={evento.vagas}
                favorito={true} /* sempre true: esta lista só tem favoritos */
                inscrito={inscricoes.includes(evento.id)}
                aoFavoritar={() => aoFavoritar(evento.id)}
                aoInscrever={() => aoInscrever(evento.id)}
              />
            ))}
          </section>
        ) : (
          <section className="estado-vazio">
            <p>Você ainda não favoritou nenhum evento.</p>
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


export default Favoritos;
