

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

// Mostra as informações do usuário conectado
function MeuPerfil({
    usuario,
    favoritos,
    inscricoes,
    aoNavegar,
    aoSair,
}) {
    return (
        <div className="pagina-inicial">

            {/* Menu lateral do aluno */}
            <Sidebar
                paginaAtual="perfil"
                usuario={usuario}
                aoNavegar={aoNavegar}
                aoSair={aoSair}
            />

            <main className="conteudo">

                {/* Área que centraliza o conteúdo do perfil */}
                <div className="perfil-container">

                    {/* Título da página */}
                    <header className="perfil-cabecalho">
                        <h1>Meu perfil</h1>
                        <p>
                            Confira os seus dados cadastrados na Fatec.
                        </p>
                    </header>

                    {/* Cartão principal com os dados do aluno */}
                    <section className="perfil-card">

                        {/* Foto e identificação do usuário */}
                        <div className="perfil-topo">
                            <img
                                src={avatar}
                                alt="Foto de perfil do usuário"
                                className="perfil-avatar"
                            />

                            <div className="perfil-identificacao">
                                <h2>{usuario?.name || aluno.nome}</h2>

                                <span>
                                    {usuario?.role === "professor"
                                        ? "Professor"
                                        : aluno.tipo}
                                </span>
                            </div>
                        </div>

                        {/* Informações pessoais e acadêmicas */}
                        <div className="perfil-dados">

                            <div className="perfil-dado">
                                <span>RA</span>
                                <strong>{aluno.ra}</strong>
                            </div>

                            <div className="perfil-dado">
                                <span>Curso</span>
                                <strong>{aluno.curso}</strong>
                            </div>

                            <div className="perfil-dado">
                                <span>Semestre</span>
                                <strong>{aluno.semestre}</strong>
                            </div>

                            <div className="perfil-dado">
                                <span>E-mail institucional</span>
                                <strong>{aluno.email}</strong>
                            </div>

                        </div>
                    </section>

                    {/* Resumo da atividade do aluno */}
                    <section className="perfil-numeros">

                        <div className="perfil-numero">
                            <strong>{inscricoes.length}</strong>
                            <span>Inscrições realizadas</span>
                        </div>

                        <div className="perfil-numero">
                            <strong>{favoritos.length}</strong>
                            <span>Eventos favoritos</span>
                        </div>

                    </section>

                </div>

            </main>
        </div>
    );
}

// Exporta a página
export default MeuPerfil;
