import api from "./api";
import auth from "../auth";
import util from "../utils/Util";

class UsuarioService {
  async salvar(body) {     
    var retorno = ""; 
    try {
      retorno = await api.post("/api/usuarios", JSON.stringify(body), util.getConfigHeaderAuthorization());
      console.log("retorno", retorno);
      return retorno;
    } catch (error) {
      console.log("Error: ", error.response.data);
      if (error.toString().includes('403'))
        auth.logout();
    }
  }

  async pesquisar(login, nome, id, status) {
    console.log("sds")
    var retorno = ""; 
    try {
      var uri = "/api/usuarios?status=" + status;
      if (!util.isEmpty(login))
        uri += "&login=" + login;
      if (!util.isEmpty(nome))
        uri += "&nome=" + nome;
      if (!util.isEmptyNumber(id) && id > 0)
        uri += "&id=" + id;
      
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
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
      retorno = await api.put("/api/usuarios/cancelar/" + id, null, util.getConfigHeaderAuthorization());
      console.log("retorno", retorno);
      return retorno;
    } catch (error) {
      console.log("Error: ", error.response.data);
      if (error.toString().includes('403'))
        auth.logout();
    }
  }
}

export default new UsuarioService();