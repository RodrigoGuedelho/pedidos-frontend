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
}

export default new UsuarioService();