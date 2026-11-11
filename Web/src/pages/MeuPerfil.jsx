
/* ==========================================
   PÁGINA: Meu perfil
   Mostra os dados do aluno e um resumo da
   atividade dele no AgendaTech.
   ========================================== */

// Importação dos estilos
import "../styles/paginaInicial.css";
import "../styles/paginasInternas.css";

// Importação do avatar padrão e do menu lateral
import avatar from "../assets/imagens/avatar-default.svg";
import Sidebar from "../components/Sidebar";

// Dados de exemplo do aluno
const aluno = {
  nome: "Ana Silva",
  tipo: "Aluno",
  ra: "1234567890123",
  curso: "Sistemas para Internet",
  semestre: "4º semestre",
  email: "ana.silva@fatec.sp.gov.br",
};

function MeuPerfil({
  usuario,
  favoritos,
  inscricoes,
  aoNavegar,
  aoSair,
}) {
  return (
    <div className="pagina-inicial">

      {/* Menu lateral com o link "Meu perfil" destacado */}
      <Sidebar
        paginaAtual="perfil"
        usuario={usuario}
        aoNavegar={aoNavegar}
        aoSair={aoSair}
      />

      <main className="conteudo">

        {/* Título da página */}
        <header className="boas-vindas">
          <h1>Meu perfil</h1>
          <p>Confira os seus dados cadastrados na Fatec.</p>
        </header>

        {/* Cartão com foto, nome e dados do aluno */}
        <section className="perfil-card">

          {/* Foto e nome do aluno */}
          <div className="perfil-topo">
            <img
              src={avatar}
              alt="Foto de perfil do usuário"
              className="perfil-avatar"
            />

            <div>
              <h2>{usuario?.name || aluno.nome}</h2>

              <span>
                {usuario?.role === "professor" ? "Professor" : aluno.tipo}
              </span>
            </div>
          </div>

          {/* Lista de dados do aluno */}
          <dl className="perfil-dados">

            <div className="perfil-dado">
              <dt>RA</dt>
              <dd>{aluno.ra}</dd>
            </div>

            <div className="perfil-dado">
              <dt>Curso</dt>
              <dd>{aluno.curso}</dd>
            </div>

            <div className="perfil-dado">
              <dt>Semestre</dt>
              <dd>{aluno.semestre}</dd>
            </div>

            <div className="perfil-dado">
              <dt>E-mail institucional</dt>
              <dd>{aluno.email}</dd>
            </div>

          </dl>
        </section>

        {/* Mostra quantas inscrições e quantos favoritos o aluno tem */}
        <section className="perfil-numeros">

          <div className="perfil-numero">
            <strong>{inscricoes.length}</strong>
            <span>Inscrições</span>
          </div>

          <div className="perfil-numero">
            <strong>{favoritos.length}</strong>
            <span>Favoritos</span>
          </div>

        </section>

      </main>
    </div>
  );
}

// Exporta a página
export default MeuPerfil;
