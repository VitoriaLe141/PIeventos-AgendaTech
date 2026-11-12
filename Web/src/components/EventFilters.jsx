/* ==========================================
   COMPONENTE: EventFilters
   Barra com a busca, o filtro de categoria
   e a ordenação dos eventos.
   Ele apenas mostra os campos.
   A filtragem acontece na PaginaInicial.
   ========================================== */

/* Props:
   - busca: texto digitado na busca
   - aoMudarBusca: função chamada ao digitar
   - categoria: categoria escolhida
   - aoMudarCategoria: função chamada ao trocar categoria
   - categorias: categorias encontradas nos eventos
   - ordem: forma de ordenação escolhida
   - aoMudarOrdem: função chamada ao trocar ordenação
*/

function EventFilters({
    busca,
    aoMudarBusca,
    categoria,
    aoMudarCategoria,
    categorias,
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

                {categorias.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>

            {/* Ordenação dos eventos */}
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
