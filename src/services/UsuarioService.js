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

  async editar(body) {     
    var retorno = ""; 
    try {
      retorno = await api.put("/api/usuarios/" + body.id, JSON.stringify(body), util.getConfigHeaderAuthorization());
      console.log("retorno", retorno);
      return retorno;
    } catch (error) {
      console.log("Error: ", error.response.data);
      if (error.toString().includes('403'))
        auth.logout();
    }
  }

  async pesquisar(login, nome, id, status) {
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

  async getUsuario(id) {
    var retorno = ""; 
    try {
      var uri = "/api/usuarios?status=ATIVO&id=" + id;
      
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      if (retorno.data.length > 0)
        return retorno.data[0];
      return null;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return [];
    }
  }  

  async getImagemUsuarioLogado() {
    var imagem = null; 
    try {
      return await this.getImagemByLogin(auth.getNameUser());
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

  async uploadImgagem(imagem, id) {

    let formData = new FormData();
    formData.append("file", imagem);
    formData.append("name", "file");
    var retorno = null;
    try {
      retorno = await api.put("/api/usuarios/" + id + "/upload", formData, util.getConfigHeaderAuthorization());
      console.log("sd", retorno)
      return retorno.status;
    } catch (error) {
      console.log("error: ", error)
      if (error.toString().includes('403'))
        auth.logout();
      return null;
    }
  }

  async getImagem(id) {
    var retorno = ""; 
    try {
      var uri = "/api/usuarios/upload/" + id;  
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      if (retorno.data !== undefined && retorno.data !== null)
        return retorno.data;
      else 
        return null;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return null;
    }
  }

  async getImagemByLogin(login) {
    var retorno = ""; 
    try {
      var uri = "/api/usuarios/upload/login/" + login;  
      retorno = await api.get(uri,  util.getConfigHeaderAuthorization());
      if (retorno.data !== undefined && retorno.data !== null)
        return retorno.data; 
      return null;
    } catch (error) {
      if (error.toString().includes('403'))
        auth.logout();
      return null;
    }
  }
}

export default new UsuarioService();