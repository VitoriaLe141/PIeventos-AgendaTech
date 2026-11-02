/* ==========================================
   COMPONENTE: EventFilters
   Barra com a busca, o filtro de categoria
   e a ordenação dos eventos.
   Ele só mostra os campos. Quem guarda os valores
   e faz a filtragem é a PaginaInicial.
   ========================================== */

/* Props:
   - busca: texto digitado na busca
   - aoMudarBusca: função que roda quando a pessoa digita
   - categoria: categoria escolhida no filtro
   - aoMudarCategoria: função que roda quando troca a categoria
   - ordem: forma de ordenação escolhida
   - aoMudarOrdem: função que roda quando troca a ordenação */
function EventFilters({
  busca,
  aoMudarBusca,
  categoria,
  aoMudarCategoria,
  ordem,
  aoMudarOrdem,
}) {
  return (
    <section className="filtros">
      {/* Campo de busca */}
      <input
        type="text"
        className="filtro-busca"
        placeholder="Buscar evento pelo nome"
        value={busca}
        onChange={aoMudarBusca}
      />

      {/* Filtro por categoria */}
      <select
        className="filtro-select"
        value={categoria}
        onChange={aoMudarCategoria}
      >
        <option value="Todas">Todas as categorias</option>
        <option value="Palestra">Palestra</option>
        <option value="Workshop">Workshop</option>
        <option value="Feira">Feira</option>
      </select>

      {/* Ordenação */}
      <select
        className="filtro-select"
        value={ordem}
        onChange={aoMudarOrdem}
      >
        <option value="data">Data mais próxima</option>
        <option value="nome">Nome (A-Z)</option>
        <option value="vagas">Mais vagas</option>
      </select>
    </section>
  );
}


// Disponibiliza o componente para outras páginas
export default EventFilters;