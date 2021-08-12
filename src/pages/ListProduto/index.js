import React, {useState, useRef } from "react";
import { Panel } from 'primereact/panel';
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from "primereact/button"
import produtoService from "../../services/ProdutoService";
import { Menu } from 'primereact/menu';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
//import "./style.css";


function ListProduto(props) {
  const [produtos, setProdutos] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [descricaoDetalhada, setDescricaoDetalhada] = useState("");
  const toast = useRef(null);
  const menu =useState(null);
  const [produtoExclusao, setProdutoExlusao] = useState(null);
  const [status, setStatus] = useState("ATIVO");
  const statusFiltro = ["ATIVO", "CANCELADO"];

  const [items, setItems] = useState([
    {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: ''},
    {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogDesativacao()}
  ]);

  const showMessage = (mensagem, tipo = "success", titulo = "Operação") => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  async function pesquisar(e) {
    e.preventDefault();
    setProdutos(await produtoService.pesquisar(descricao, descricaoDetalhada, status));
  }

  function precoBodyTemplate(rowData){
    return new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(rowData.preco);
  }

  function showMenu(e,rowData) {
    e.preventDefault();
    
    setItems([
      {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: getUrlEdiarProduto(rowData)},
      {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogDesativacao()}
    ])
    setProdutoExlusao(rowData);
    try {
      menu.current.toggle(e);
    } catch (error) {
      
    }
    
  }

  function getUrlEdiarProduto(produto) {
    return "/produtos/" + produto.id
  }
  function actionBodyTemplate(rowData) {
    
    return (
        <React.Fragment>
            <Menu id="menuAcoes" model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-ellipsis-v" onClick={(e)=> showMenu(e, rowData)} aria-controls="popup_menu" aria-haspopup  className="p-button-rounded" />
        </React.Fragment>
    );
  }

  const confirmDialogDesativacao = () => {
    confirmDialog({
        message: 'Você tem certeza que deseja desativar o Produto?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => desabilitaProduto(),
        reject: () => console.log("fechou")
    });
  }

  async function desabilitaProduto() {
    var retorno = null;
    try {
      retorno = await produtoService.desabilitar(produtoExclusao.id);
      console.log(retorno)
      if (retorno) {
        showMessage("produto desativado com sucesso.");
        removeListaProduto();
      } else {
        showMessage("Erro ao tenta desabilitar produto.", "error");
      }
        
    } catch (error) {
      showMessage("Erro ao tenta desabilitar produto.");
    }
    
  }

  function removeListaProduto(){
    var indexExclusao = produtos.indexOf(produtoExclusao);
    var produtosAux = [] 
    produtos.splice(indexExclusao, 1);
    produtos.map((produto) => {
      produtosAux.push(produto);
    })
    
    setProdutos(produtosAux);
  }

  return (
    <div className="p-margin-formularios">
      <form id="formProduto" className="p-fluid" >
        <Panel header="Produtos">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-3">     
                <InputText id="descricao" type="text" value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição"  />
            </div>

            <div className="p-field p-col-12 p-md-5">     
                <InputText id="descricaoDetalhada" type="text" value={descricaoDetalhada} 
                  onChange={(e) => setDescricaoDetalhada(e.target.value)} placeholder="Descrição"  />
            </div>
            <div className="p-field p-col-12 p-md-2">
                <Dropdown value={status} options={statusFiltro} onChange={(e) => setStatus(e.value)} placeholder="Status"/>
            </div>
            <div className="p-field p-col-12 p-md-2">
              <Button icon="pi pi-search" onClick={pesquisar}/> 
            </div>
          </div>
          
          <DataTable value={produtos} className="p-datatable-responsive-demo" paginator rows={8}>
              <Column field="descricao" header="descrição"></Column>
              <Column field="preco" body={precoBodyTemplate} header="Preço"></Column>
              <Column body={actionBodyTemplate} header="Ações"  bodyStyle={{ textAlign: 'center' }}>
               
              </Column>
          </DataTable>
        </Panel>  
      </form>
    </div> 
    );
}

export default ListProduto;