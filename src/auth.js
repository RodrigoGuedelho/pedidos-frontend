import api from "./services/api";
import usuarioService from "./services/UsuarioService";

class Auth {
    isAuthenticated() {
      var token = localStorage.getItem("token");
      return token !== undefined && token !== null;
    }

    async login(userName, password) {
      //Chamar rota de login
      try {
          var body  = {
            login : userName,
            senha : password
          };
          const retorno = await api.post("/login", JSON.stringify(body));
          localStorage.setItem("token", retorno.data.Authorization);
          
          const imagemUsuario = await usuarioService.getImagemUsuarioLogado();
          localStorage.setItem("imagemUsuarioLogado", imagemUsuario);

          return true;
      } catch (error) {
        localStorage.removeItem("token");
        return false;
      }
      
    }

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("imagemUsuarioLogado");
      window.location.href ='/';
    }

    getToken() {
      return localStorage.getItem("token");
    }

    getImagemUsuarioLogadoCache() {
      return localStorage.getItem("imagemUsuarioLogado");
    }
    setImagemUsuarioLogadoCache(imagem) {
      localStorage.setItem("imagemUsuarioLogado", imagem);
    }

    getNameUser() {
      var token = this.getToken();
      token = token.replace("Bearer ", "");
      var partesToken = [] 
      partesToken = token.split(".");

      var payloadToken = Buffer.from(partesToken[1], 'base64').toString('ascii');
      payloadToken = JSON.parse(payloadToken)
      console.log(">>>> " + payloadToken.sub)
      return payloadToken.sub;
    }


}

export default new Auth(); 