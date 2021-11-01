import React, {useState, useRef } from "react";
import { Panel } from 'primereact/panel';
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { InputNumber } from 'primereact/inputnumber';
import {Button} from "primereact/button"
import { Menu } from 'primereact/menu';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';

import mesaService from "../../services/MesaService";

function ListMesa(props)  {
  const [mesas, setMesas] = useState([]);
  const [numero, setNumero] = useState();
  const [id, setId] = useState();
  const [status, setStatus] = useState("ATIVO");
  const statusFiltro = ["ATIVO", "CANCELADO"];
  const toast = useRef(null);
  const menu =useState(null);
  const [items, setItems] = useState([
    {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: ''},
    {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogDesativacao()}
  ]);
  const [mesaExclusao, setMesaExlusao] = useState(null);

  const showMessage = (mensagem, tipo = "success", titulo = "Operação") => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  async function pesquisar(e)  {
    e.preventDefault();
    setMesas(await mesaService.pesquisar(id, numero, status));
  } 
  
  function getUrlEdiarMesa(mesa) {
    return "/mesas/" + mesa.id
  }

  const confirmDialogDesativacao = () => {
    confirmDialog({
        message: 'Você tem certeza que deseja desativar o Produto?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => desabilitaMesa(),
        reject: () => console.log("fechou")
    });
  }

  function showMenu(e,rowData) {
    e.preventDefault();
    
    setItems([
      {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: getUrlEdiarMesa(rowData)},
      {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogDesativacao()}
    ])
    setMesaExlusao(rowData);
    try {
      menu.current.toggle(e);
    } catch (error) {
      
    }
    
  }

  async function desabilitaMesa() {
    var retorno = null;
    try {
      retorno = await mesaService.desabilitar(mesaExclusao.id);
      console.log(retorno)
      if (retorno) {
        showMessage("mesa desativado com sucesso.");
        removeListaProduto();
      } else {
        showMessage("Erro ao tenta desabilitar mesa.", "error");
      }
        
    } catch (error) {
      showMessage("Erro ao tenta desabilitar mesa.");
    }
    
  }

  function removeListaProduto(){
    var indexExclusao = mesas.indexOf(mesaExclusao);
    var mesasAux = [] 
    mesas.splice(indexExclusao, 1);
    mesas.map((mesa) => {
      mesasAux.push(mesa);
    })
    
    setMesas(mesasAux);
  }

  function actionBodyTemplate(rowData) {
    
    return (
        <React.Fragment>
            <Menu id="menuAcoes" model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-ellipsis-v" onClick={(e)=> showMenu(e, rowData)} aria-controls="popup_menu" aria-haspopup  className="p-button-rounded" />
        </React.Fragment>
    );
  }

  return (
    <div className="p-margin-formularios">
      <form id="formMesas" className="p-fluid" >
        <Panel header="Mesas">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-3"> 
              <InputNumber inputId="minmax-buttons" value={id} 
                onValueChange={(e) => setId(e.value)} mode="decimal" showButtons min={0} placeholder="Id" />        
            </div>

            <div className="p-field p-col-12 p-md-5">     
              <InputNumber inputId="minmax-buttons" value={numero} 
                  onValueChange={(e) => setNumero(e.value)} showButtons min={0} placeholder="Número" /> 
            </div>
            <div className="p-field p-col-12 p-md-2">
                <Dropdown value={status} options={statusFiltro} onChange={(e) => setStatus(e.value)} placeholder="Status"/>
            </div>
            <div className="p-field p-col-12 p-md-2">
              <Button icon="pi pi-search" onClick={pesquisar}/> 
            </div>
          </div>
          
          <DataTable value={mesas} className="p-datatable-responsive-demo" paginator rows={8}>
              <Column field="id" header="Id"></Column>
              <Column field="numero"  header="Número"></Column>
              <Column body={actionBodyTemplate} header="Ações"  bodyStyle={{ textAlign: 'center' }}>
               
              </Column>
          </DataTable>
        </Panel>  
      </form>
    </div> 
  );
}

export default ListMesa;