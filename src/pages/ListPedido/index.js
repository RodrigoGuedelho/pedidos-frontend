import React, {useState, useRef } from "react";
import { Panel } from 'primereact/panel';
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import {Button} from "primereact/button"
import { Menu } from 'primereact/menu';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

import pedidoService from "../../services/PedidoSerice";
import util from '../../utils/Util';

function ListPedido(props)  {
  const [pedidos, setPedidos] = useState([]);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [status, setStatus] = useState("ABERTO");
  const statusFiltro = ["ABERTO", "FINALIZADO", "CANCELADO"];
  const toast = useRef(null);
  const menu =useState(null);
  const [items, setItems] = useState([
    {label: 'Visualizar', icon: 'pi pi-fw pi-print',url: ''},
    {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: ''},
    {label: 'Finalizar', icon: 'pi pi-check-circle', command : ()=> confirmDialogFinalizar()},
    {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogCancelar()}
  ]);
  const [pedidoExclusao, setPedidoExlusao] = useState(null);

  const showMessage = (mensagem, tipo = "success", titulo = "Operação") => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  async function pesquisar(e)  {
    e.preventDefault();
    setPedidos(await pedidoService.pesquisar(dataInicio, dataFim, status));
  } 
  
  function getUrlEdiarPedido(pedido) {
    return "/pedidos/" + pedido.id
  }

  const confirmDialogCancelar = () => {
    confirmDialog({
        message: 'Você tem certeza que deseja cancelar o Pedido?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => cancelarPedido(),
        reject: () => console.log("fechou")
    });
  }

  const confirmDialogFinalizar = () => {
    confirmDialog({
        message: 'Você tem certeza que deseja Finalizar o Pedido?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => finalizarPedido(),
        reject: () => console.log("fechou")
    });
  }


  function showMenu(e,rowData) {
    e.preventDefault();
    
    setItems([
      {label: 'Visualizar', icon: 'pi pi-fw pi-print', command : ()=> gerarRelatorioVisualizar()},
      {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: getUrlEdiarPedido(rowData)},
      {label: 'Finalizar', icon: 'pi pi-check-circle', command : ()=> confirmDialogFinalizar()},
      {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogCancelar()}
    ])
    setPedidoExlusao(rowData);
    console.log("pedido", rowData)
    try {
      menu.current.toggle(e);
    } catch (error) {
      
    }
    
  }

  async function finalizarPedido() {
    var retorno = null;
    try {
      console.log(">>>>finalizarPedido", pedidoExclusao)
      retorno = await pedidoService.finalizar(pedidoExclusao.id);
      console.log(retorno)
      if (retorno) {
        showMessage("Pedido Finalizado com sucesso.");
        removeListaPedido();
      } else {
        showMessage("Erro ao tenta Finalizar pedido.", "error");
      }
        
    } catch (error) {
      showMessage("Erro ao tenta Finalizar pedido.", 'error');
    }
    
  }
  async function cancelarPedido() {
    var retorno = null;
    try {
      console.log(">>>>cancelarPedido", pedidoExclusao)
      retorno = await pedidoService.cancelar(pedidoExclusao.id);
      console.log(retorno)
      if (retorno) {
        showMessage("Pedido Cancelado com sucesso.");
        removeListaPedido();
      } else {
        showMessage("Erro ao tenta cancelar pedido.", "error");
      }
        
    } catch (error) {
      showMessage("Erro ao tenta cancelar pedido.");
    }
    
  }

  function removeListaPedido(){
    var indexExclusao = pedidos.indexOf(pedidoExclusao);
    var pedidosAux = [] 
    pedidos.splice(indexExclusao, 1);
    pedidos.map((pedido) => {
      pedidosAux.push(pedido);
    })
    
    setPedidos(pedidosAux);
  }

  async function gerarRelatorioVisualizar(e){
    //e.preventDefault();
    const relatorio = await pedidoService.gerarRelatorioVisualizar(pedidoExclusao.id);

    let pdfWindow = window.open("")
    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + relatorio + "'></iframe>")
  }

  function actionBodyTemplate(rowData) {
    
    return (
        <React.Fragment>
            <Menu id="menuAcoes" model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-ellipsis-v" onClick={(e)=> showMenu(e, rowData)} aria-controls="popup_menu" aria-haspopup  className="p-button-rounded" />
        </React.Fragment>
    );
  }

  function valorTotalBodyTemplate(rowData){
    return new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(rowData.valorTotal);
  }

  function dataFormatadaBodyTemplate(rowData){
    return util.formatarData(rowData.dataPedido);
  }

  return (
    <div className="p-margin-formularios">
      <form id="formPedidos" className="p-fluid" >
        <Panel header="Pedidos">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-4">
            <Calendar id="icon" value={dataInicio} onChange={(e) => setDataInicio(e.value)} showIcon dateFormat="dd/mm/yy"/>
          </div>
          <div className="p-field p-col-12 p-md-4">
            <Calendar id="icon" value={dataFim} onChange={(e) => setDataFim(e.value)} showIcon dateFormat="dd/mm/yy"/>
          </div>
            <div className="p-field p-col-12 p-md-2">
              <Dropdown value={status} options={statusFiltro} onChange={(e) => setStatus(e.value)} placeholder="Status"/>
            </div>
            <div className="p-field p-col-12 p-md-2">
              <Button icon="pi pi-search" onClick={pesquisar}/> 
            </div>
          </div>
          
          <DataTable value={pedidos} className="p-datatable-responsive-demo" paginator rows={8}>
              <Column field="id" header="Id"></Column>
              <Column body={dataFormatadaBodyTemplate} field="dataPedido"  header="Data"></Column>
              <Column field="numeroMesa"  header="Mesa"></Column>
              <Column field="valorTotal" body={valorTotalBodyTemplate} header="Total"></Column>
              <Column body={actionBodyTemplate} header="Ações"   bodyStyle={{ textAlign: 'center' }}>
               
              </Column>
          </DataTable>
        </Panel>  
      </form>
    </div> 
  );
}

export default ListPedido;