import api from "./services/api";

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

          console.log("Retorno", retorno.data);
          localStorage.setItem("token", retorno.data.Authorization);
          return true;
      } catch (error) {
        localStorage.removeItem("token");
        return false;
      }
      
    }

    logout() {
      localStorage.removeItem("token");
      window.location.href ='/';
    }

    getToken() {
      return localStorage.getItem("token");
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