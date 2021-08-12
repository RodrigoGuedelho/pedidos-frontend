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

  async pesquisar(descricao, descricaoDetalhada, status) {
    var retorno = ""; 
    try {
      var uri = "/api/produtos?status=" + status;
      if (!util.isEmpty(descricao))
        uri += "&descricao=" + descricao;
     
      if (!util.isEmpty(descricaoDetalhada))
        uri += "&descricaoDetalhada=" + descricaoDetalhada;
      

      retorno = await api.get(uri,  this.getConfig());
      return retorno.data;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }

  async getProduto(id) {
    var retorno = ""; 
    try {
      var uri = "/api/produtos?status=ATIVO&id=" + id;  
      retorno = await api.get(uri,  this.getConfig());
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
      retorno = await api.put("/api/produtos/" + id + "/cancelar", null, this.getConfig());
      return retorno.data;
    } catch (error) {
      console.log("error: ", error)
      return ;
      if (error.toString().includes('403'))
        auth.logout();
      return null;
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