import api from "./api";
import auth from "../auth";
import util from "../utils/Util";

class PedidoSerice  {
  async gerarRelatorio(dataInicio, dataFim) {
    var retorno = ""; 
    try {
      var uri = "/api/pedidos/relatorio?dataInicio=" + util.dateTostring(dataInicio) 
        + "&dataFim=" + util.dateTostring(dataFim);

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
}

export default new PedidoSerice();