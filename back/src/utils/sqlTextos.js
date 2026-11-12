/* ==========================================
   UTILITÁRIOS SQL
   Monta os campos e parâmetros usados nas consultas
   SQL criadas pelos models.
   ========================================== */

let sql_fields = [];
let sql_values = [];

// Separa os nomes dos campos e os valores recebidos.

export function extrair_dados(payload){
  sql_fields = [];
  sql_values = [];
  for (let chave in payload) { 
    if (payload.hasOwnProperty(chave)) { 
      sql_fields.push( chave) ;
      sql_fields.push( " , ") ;
      sql_values.push(payload[chave]);
    }  
  }
  sql_fields.pop();
}

// Monta a lista de nomes das colunas para o comando SQL.

export function gerar_sqlFields(){
  let aux = "";
  for ( var i = 0; i < sql_fields.length ; i++  ){
    aux = aux + sql_fields[i] ;  
  }
  return aux;
}

// Monta os sinais de interrogação usados nos parâmetros SQL.

export function gerar_sqlParams(){
  let aux = "";
  for ( var i = 0; i < sql_fields.length ; i++  ){
    // retira espaco em branco do elemento
    const chave = sql_fields[i].replace(/\s+/g, '');
    if (  chave == ",") {
        aux = aux + sql_fields[i] ;  
    }else {
       aux = aux + " ? " ;  
  }
  }
  return aux;
}

// Monta os campos e valores usados em uma atualização SQL.

export function gerar_sqlSets(){
  var aux = "";
  for ( var i = 0; i < sql_fields.length ; i++  ){
    let chave = sql_fields[i].replace(/\s+/g, '');
    if (  chave == ",") {
        aux = aux + sql_fields[i] ;  
    } else {
      aux = aux + sql_fields[i]+" = ? " ;  
    } 
  }
  return aux;
}

// Devolve a lista de valores separados para a consulta SQL.

export function listParms(){
    return sql_values ;
}
