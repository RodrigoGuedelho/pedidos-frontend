import React, {useState, useRef } from "react";
import { Panel } from 'primereact/panel';
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from "primereact/button"
import produtoService from "../../services/ProdutoService";
import { Menu } from 'primereact/menu';
//import "./style.css";


function ListProduto(props) {
  const [produtos, setProdutos] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [descricaoDetalhada, setDescricaoDetalhada] = useState("");
  const toast = useRef(null);
  const menu = useRef(null);
  let items = [
    {label: 'Editar', icon: 'pi pi-fw pi-pencil'},
    {label: 'Cancelar', icon: 'pi pi-fw pi-trash'}
  ];

  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  async function pesquisar(e) {
    e.preventDefault();
    setProdutos(await produtoService.pesquisar(descricao, descricaoDetalhada));
  }

  function precoBodyTemplate(rowData){
    return new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(rowData.preco);
  }

  function showMenu(e) {
    e.preventDefault()
    menu.current.toggle(e);
  }
  function actionBodyTemplate(rowData) {
    return (
        <React.Fragment>
            <Menu model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-ellipsis-v" onClick={showMenu} aria-controls="popup_menu" aria-haspopup  className="p-button-rounded" />
        </React.Fragment>
    );
}
  return (
    <div className="p-margin-formularios">
      <form id="formProduto" className="p-fluid" >
        <Panel header="Produtos">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-5">     
                <InputText id="descricao" type="text" value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição"  />
            </div>

            <div className="p-field p-col-12 p-md-5">     
                <InputText id="descricaoDetalhada" type="text" value={descricaoDetalhada} 
                  onChange={(e) => setDescricaoDetalhada(e.target.value)} placeholder="Descrição"  />
            </div>
            <div className="p-field p-col-12 p-md-2">
              <Button icon="pi pi-search" onClick={pesquisar}/> 
            </div>
          </div>
          
          <DataTable value={produtos} className="p-datatable-responsive-demo" paginator rows={8} header="Responsive">
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