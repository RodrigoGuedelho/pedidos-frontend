import auth from "../auth";

class Util {
  isEmpty(texto) {
    return texto.trim() === '' ||  texto === undefined || texto === null;
  }
  isEmptyNumber(numero) {
    return numero === undefined || numero === null
  }

  dateTostring(data) {
    return data.toISOString().split("T")[0];
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

export default new Util();