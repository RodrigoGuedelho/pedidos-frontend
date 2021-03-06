import api from "./api";
import auth from "../auth";
import util from "../utils/Util";

class MesaService {
  async salvar(body) {     
    var retorno = ""; 
    try {
      retorno = await api.post("/api/mesas", JSON.stringify(body), util.getConfigHeaderAuthorization());
      console.log("retorno", retorno);
      return retorno;
    } catch (error) {
      console.log("Error: ", error.response.data);
      if (error.toString().includes('403'))
        auth.logout();
    }
      
    //throw new Error("Erro ao tenta salvar uma mesa.");
  }

  async editar(body, id) {
    var retorno = ""; 
    try {
      retorno = await api.post("/api/mesas/" + id, JSON.stringify(body), util.getConfigHeaderAuthorization());
      return retorno;
    } catch (error) {
      util.verificarAutorizacao(error.response.data);
    }
      
    //throw new Error("Erro ao tenta editar uma mesa.");
  }

  async pesquisar(id, numero, status) {
    var retorno = ""; 
    try {
      var uri = "/api/mesas?status=" + status;

      if (!util.isEmptyNumber(numero))
        uri += "&numero=" + numero;

      if (!util.isEmptyNumber(id))
        uri += "&id=" + id;
      
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async getMesa(id) {
    var retorno = ""; 
    try {
      var uri = "/api/mesas?status=ATIVO&id=" + id;  
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      if (retorno.data !== [] && retorno.data !== undefined && retorno.data !== null)
        return retorno.data[0];
      else 
        return null;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return null;
    }
  }

  async desabilitar(id) {
    var retorno = null;
    try {
      retorno = await api.put("/api/mesas/" + id + "/cancelar", null, util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      console.log("error: ", error)
      if (error.toString().includes('403'))
        auth.logout();
      return null;
    }
  }

  async pesquisarMesasAbertas(numero) {
    var retorno = null;
    try {
      var uri = "/api/mesas/abertas";
      if (!util.isEmptyNumber(numero) && numero > 0)
        uri += "?numero=" + numero;
      retorno = await api.get(uri, util.getConfigHeaderAuthorization());
    
      retorno.data.map(mesa => {
        mesa.numero = mesa.numero + "";
      })
      return retorno.data;
    } catch (error) {
      console.log("error: ", error)
      if (error.toString().includes('403'))
        auth.logout();
      return null;
    }
  }
}

export default new MesaService();