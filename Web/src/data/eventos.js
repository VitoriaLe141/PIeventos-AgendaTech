/* ==========================================
   DADOS: LISTA DE EVENTOS

   ========================================== */

export const eventos = [
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


/* transforma "12/11/2026" em uma data de verdade.
   Preciso disso para o computador conseguir comparar qual
   data vem antes da outra na hora de ordenar. */
export function transformarEmData(texto) {
  // split separa o texto nas barras: ["12", "11", "2026"]
  const partes = texto.split("/");
  const dia = partes[0];
  const mes = partes[1];
  const ano = partes[2];

  // Os meses começam do 0 no JavaScript (janeiro = 0), por isso mes - 1
  return new Date(ano, mes - 1, dia);
}
