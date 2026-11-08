/* ==========================================
   PÁGINA INICIAL DO AGENDATECH

   Responsável por organizar os componentes
   que aparecem na página principal.
   Aqui também ficam a busca, o filtro por
   categoria e a ordenação dos eventos.
   ========================================== */


// Importação do useState (para guardar os valores dos filtros)
import { useState } from "react";

// Importação dos estilos
// (o nome do arquivo precisa ter as mesmas letras maiúsculas: paginaInicial.css)
import "../styles/paginaInicial.css";

// Importação dos dados (a lista de eventos agora fica em data/eventos.js)
import { eventos, transformarEmData } from "../data/eventos";

// Importação dos componentes
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventFilters from "../components/EventFilters";
import EventCard from "../components/EventCard";


/* Props (todas vêm do App):
   - favoritos / inscricoes: ids dos eventos favoritados e inscritos
   - aoFavoritar / aoInscrever: funções para marcar ou desmarcar
   - aoNavegar / aoSair: funções do menu lateral */
function PaginaInicial({
  favoritos,
  inscricoes,
  aoFavoritar,
  aoInscrever,
  aoNavegar,
  aoSair,
}) {
  /* ---------- VARIÁVEIS DE ESTADO ---------- */
  const [busca, setBusca] = useState("");          // texto da busca
  const [categoria, setCategoria] = useState("Todas"); // categoria escolhida
  const [ordem, setOrdem] = useState("data");      // forma de ordenar


  /* ---------- FUNÇÕES DOS CAMPOS ---------- */
  // Cada função guarda no estado o que a pessoa digitou ou escolheu
  function aoMudarBusca(evento) {
    setBusca(evento.target.value);
  }

  function aoMudarCategoria(evento) {
    setCategoria(evento.target.value);
  }

  function aoMudarOrdem(evento) {
    setOrdem(evento.target.value);
  }


  /* ---------- FILTRAR E ORDENAR ---------- */
  // 1) Filtro: fico só com os eventos que combinam com a busca e a categoria
  const eventosFiltrados = eventos.filter((evento) => {
    // toLowerCase deixa tudo minúsculo, para não importar maiúscula/minúscula
    const combinaComBusca = evento.titulo
      .toLowerCase()
      .includes(busca.toLowerCase());

    const combinaComCategoria =
      categoria === "Todas" || evento.categoria === categoria;

    return combinaComBusca && combinaComCategoria;
  });

  // 2) Ordenação: o [...lista] faz uma cópia, para não bagunçar a lista original
  const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
    if (ordem === "nome") {
      return a.titulo.localeCompare(b.titulo);
    }

    if (ordem === "vagas") {
      return b.vagas - a.vagas;
    }

    // Se não for nome nem vagas, ordena pela data (a mais próxima primeiro)
    return transformarEmData(a.data) - transformarEmData(b.data);
  });


  /* ---------- O QUE APARECE NA TELA ---------- */
  return (
    <div className="pagina-inicial">
      {/* Menu lateral */}
      <Sidebar
        paginaAtual="inicio"
        aoNavegar={aoNavegar}
        aoSair={aoSair}
      />

      {/* Conteúdo principal (ao lado da sidebar) */}
      <main className="conteudo">
        <Header nome="Ana" />

        {/* Busca, categoria e ordenação */}
        <EventFilters
          busca={busca}
          aoMudarBusca={aoMudarBusca}
          categoria={categoria}
          aoMudarCategoria={aoMudarCategoria}
          ordem={ordem}
          aoMudarOrdem={aoMudarOrdem}
        />

        {/* Lista de eventos: o map cria um card para cada evento */}
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
              inscrito={inscricoes.includes(evento.id)}
              aoFavoritar={() => aoFavoritar(evento.id)}
              aoInscrever={() => aoInscrever(evento.id)}
            />
          ))}
        </section>

        {/* Mensagem quando nenhum evento combina com a busca */}
        {eventosOrdenados.length === 0 && (
          <p className="sem-eventos">Nenhum evento encontrado.</p>
        )}
      </main>
    </div>
  );
}


// Disponibiliza a página para o restante do projeto
export default PaginaInicial;
