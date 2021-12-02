import api from "./api";
import auth from "../auth";
import util from "../utils/Util";

class PedidoSerice  {
  async gerarRelatorio(dataInicio, dataFim, status) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos/relatorio?dataInicio=" + util.dateTostring(dataInicio) 
        + "&dataFim=" + util.dateTostring(dataFim) + '&status=' + status;

      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async gerarRelatorioVisualizar(id) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos/relatorio/" + id;

      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async salvar(body) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos";
      retorno = await api.post(uri, JSON.stringify(body), util.getConfigHeaderAuthorization());
      return retorno;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async editar(body) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos/" + body.id ;
      retorno = await api.put(uri, JSON.stringify(body), util.getConfigHeaderAuthorization());
      return retorno;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async pesquisar(dataInicio, dataFim, status) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos/agrupado?status=" + status +
      "&dataInicio=" + util.dateTostring(dataInicio) 
      + "&dataFim=" + util.dateTostring(dataFim);
      
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async getPedido(id) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos/" + id;   
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async finalizar(id) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos/finalizar/" + id;  
      retorno = await api.put(uri, null, util.getConfigHeaderAuthorization());
      return retorno.data;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async cancelar(id) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos/cancelar/" + id;   
      retorno = await api.put(uri, null, util.getConfigHeaderAuthorization());
      return retorno.data
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }
}

export default new PedidoSerice();