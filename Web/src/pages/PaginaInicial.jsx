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
import "../styles/paginainicial.css";

// Importação dos componentes
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventFilters from "../components/EventFilters";
import EventCard from "../components/EventCard";


/* Lista de eventos de exemplo.
   Por enquanto eu escrevo os eventos aqui mesmo,
   depois eles vão vir do banco de dados. */
const eventos = [
  {
    id: 1,
    titulo: "Semana de Tecnologia",
    categoria: "Palestra",
    data: "12/11/2026",
    local: "Auditório",
    vagas: 40,
  },
  {
    id: 2,
    titulo: "Workshop de React",
    categoria: "Workshop",
    data: "18/11/2026",
    local: "Laboratório 3",
    vagas: 20,
  },
  {
    id: 3,
    titulo: "Feira de Projetos",
    categoria: "Feira",
    data: "25/11/2026",
    local: "Pátio",
    vagas: 100,
  },
  {
    id: 4,
    titulo: "Palestra de Carreira em TI",
    categoria: "Palestra",
    data: "05/11/2026",
    local: "Auditório",
    vagas: 60,
  },
  {
    id: 5,
    titulo: "Workshop de Banco de Dados",
    categoria: "Workshop",
    data: "20/11/2026",
    local: "Laboratório 1",
    vagas: 15,
  },
  {
    id: 6,
    titulo: "Feira de Estágios",
    categoria: "Feira",
    data: "30/11/2026",
    local: "Pátio",
    vagas: 80,
  },
];


/* Função auxiliar: transforma "12/11/2026" em uma data de verdade.
   Eu preciso disso para o computador conseguir comparar qual
   data vem antes da outra na hora de ordenar. */
function transformarEmData(texto) {
  // split separa o texto nas barras: ["12", "11", "2026"]
  const partes = texto.split("/");
  const dia = partes[0];
  const mes = partes[1];
  const ano = partes[2];

  // Os meses começam do 0 no JavaScript (janeiro = 0), por isso mes - 1
  return new Date(ano, mes - 1, dia);
}


function PaginaInicial() {
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
      <Sidebar />

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