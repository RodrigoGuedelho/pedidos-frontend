import auth from "../auth";

class Util {
  isEmpty(texto) {
    return texto === undefined || texto === null || texto.trim() === '';
  }
  isEmptyNumber(numero) {
    return numero === undefined || numero === null
  }

  dateTostring(data) {
    return data.toISOString().split("T")[0];
  }
  formatarData(data) {
    const dataAuxiliar = new Date(data);
    return adicionarZero(dataAuxiliar.getDate()) + '/' + adicionarZero(dataAuxiliar.getMonth() + 1) + '/' + dataAuxiliar.getFullYear() 
      + ' ' + adicionarZero(dataAuxiliar.getHours()) + ':' + adicionarZero(dataAuxiliar.getMinutes()) + ':' 
      + adicionarZero(dataAuxiliar.getSeconds()) ;
  }
  getConfigHeaderAuthorization() {
    return {
      headers: {
        'Authorization': localStorage.getItem("token"),
        'Content-Type' : 'application/json'
      }
    }
  }
  verificarAutorizacao(response) {
    if (response.status === 403) {
      auth.logout();
    }
  }
}

function adicionarZero(numero){
  if (numero <= 9) 
      return "0" + numero;
  else
      return numero; 
}

export default new Util();