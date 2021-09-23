import React, {useState, useRef, useEffect } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import {Link} from 'react-router-dom';
import { Toast } from "primereact/toast";
import produtoService from "../../services/ProdutoService"
//import "./style.css";


function CadProduto(props) {
  const [descricao, setDescricao] = useState("");
  const [descricaoDetalhada, setDescricaoDetalhada] = useState("");
  const [idProduto, setIdProduto] = useState(0);
  const [preco, setPreco] = useState(0);
  const toast = useRef(null);
  const {match} = props;
  const {id} = match.params;

  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  useEffect(async () => {
    if(id !== undefined){
      const produto = await produtoService.getProduto(id);
      if(produto) {
        setDescricao(produto.descricao);
        setDescricaoDetalhada(produto.descricaoDetalhada);
        setPreco(produto.preco);
        setIdProduto(produto.id);
      } 
    }
  }, []);

  async function salvar(e) {
    try {
      e.preventDefault();
      if (!await validarSalvar())
        return;
      const body = {
        descricao : descricao,
        descricaoDetalhada : descricaoDetalhada,
        preco : preco,
        id : idProduto ? idProduto : undefined
      }
      
      const retorno = await produtoService.salvar(body);
      
      if (retorno.status >= 200 && retorno.status < 300)
        showMessage("Operação realizada com sucesso.", "success", "Operação")
      else 
        showMessage("Erro ao tenta salvar.", "error", "Operação");
    } catch (error) {
      showMessage("Erro ao tenta salvar.", "error", "Operação")
    }
  }

  async function validarSalvar() {
    let retorno = true;
    if (descricao.trim() === '' || descricao === undefined || descricao === null) {
      await showMessage("Descrição não informada.", "error", "Operação");
      retorno = false;
    }
    if (descricaoDetalhada.trim() === '' || descricaoDetalhada === undefined || descricaoDetalhada === null) {
      await showMessage("Descrição detalhada não informada.", "error", "Operação");
      retorno = false;
    }

    if ( descricaoDetalhada === undefined || descricaoDetalhada === null || preco < 0) {
      await showMessage("Preço inválido.", "error", "Operação");
      retorno = false;
    }
    return retorno;
  }

  return (
    <div className="p-margin-formularios">
      <form id="formProduto" className="p-fluid" >
        <Panel header="Cadastro de Produtos">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="firstname6">Descrição</label>
                  <InputText id="firstname6" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>
              <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="lastname6">Preço</label>
                  <InputNumber inputId="locale-user" value={preco} onValueChange={(e) => setPreco(e.value)} mode="decimal" minFractionDigits={2} />
              </div>
              <div className="p-field p-col-12">
                  <label htmlFor="address">Descrição Detalhada</label>
                  <InputTextarea id="address" type="text" rows="4" value={descricaoDetalhada} 
                    onChange={(e) => setDescricaoDetalhada(e.target.value)} />
              </div>
              <div className="p-field p-col-12 p-md-8 "/>
              <div className="p-field p-col-12 p-md-2">
                <Button id="salvarProduto" label="Salvar" onClick={salvar} />
              </div>
              <div className="p-field p-col-12 p-md-2 ">
                <Link to="/" className="p-button p-button-secondary btn-link p-d-flex p-jc-center">Cancelar</Link>
              </div>
          </div>
        </Panel>  
      </form>
    </div> 
    );
}

export default CadProduto;