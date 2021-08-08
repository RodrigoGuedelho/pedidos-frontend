import api from "./api"

class ProdutoService {

  async salvar(body) {
       
    let config = {
      headers: {
        'Authorization': localStorage.getItem("token"),
        'Content-Type' : 'application/json'
      }
    }
    return await api.post("/api/produtos", JSON.stringify(body), config);
  }

  
}

export default new ProdutoService();