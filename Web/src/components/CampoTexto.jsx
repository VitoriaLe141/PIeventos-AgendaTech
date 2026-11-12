/* ==========================================
   COMPONENTE: CampoTexto
   Campo reutilizável com rótulo, input e erro.
   ========================================== */

/* Props:
   - rotulo: nome que aparece em cima do campo
   - tipo: tipo do input (text, password...)
   - valor: o que está digitado
   - aoMudar: função que roda quando a pessoa digita
   - erro: mensagem de erro (se existir)
   - placeholder: texto de dica dentro do campo
   - id: liga o label ao input
   - tamanhoMaximo: quantos caracteres cabem
   - modoTeclado: no celular, "numeric" abre o teclado de números */
function CampoTexto({
  rotulo,
  tipo,
  valor,
  aoMudar,
  erro,
  placeholder,
  id,
  tamanhoMaximo,
  modoTeclado,
}) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>

      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={aoMudar}
        placeholder={placeholder}
        maxLength={tamanhoMaximo}
        inputMode={modoTeclado}
        className={erro ? "com-erro" : ""}
      />

      {erro && <span className="msg-erro">{erro}</span>}
    </div>
  );
}

export default CampoTexto;
