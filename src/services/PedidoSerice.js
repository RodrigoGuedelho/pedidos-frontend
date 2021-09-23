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
}

export default new PedidoSerice();