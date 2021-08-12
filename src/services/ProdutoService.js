import api from "./api";
import auth from "../auth";
import util from "../utils/Util";


class ProdutoService {

  async salvar(body) {     
    var retorno = ""; 
    try {
      retorno = await api.post("/api/produtos", JSON.stringify(body), this.getConfig());
      return retorno;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
    }
      
    throw new Error("Erro ao tenta salvar um produto.");
  }

  async pesquisar(descricao, descricaoDetalhada) {
    var retorno = ""; 
    try {
      var uri = "/api/produtos?";
      if (!util.isEmpty(descricao))
        uri += "descricao=" + descricao;
      if(!util.isEmpty(descricao) && !util.isEmpty(descricaoDetalhada))
        uri += "&" 
      if (!util.isEmpty(descricaoDetalhada))
        uri += "descricaoDetalhada=" + descricaoDetalhada;

      retorno = await api.get(uri,  this.getConfig());
      return retorno.data;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  getConfig() {
    return {
      headers: {
        'Authorization': localStorage.getItem("token"),
        'Content-Type' : 'application/json'
      }
    }
  }

  
}

export default new ProdutoService();