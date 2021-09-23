import React, {useState, useRef, useEffect } from "react";
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import {Link} from 'react-router-dom';
import { Toast } from "primereact/toast";
import pedidoService from "../../services/PedidoSerice";
import util from "../../utils/Util";

//import "./style.css";


function RelatorioPedido(props) {
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const toast = useRef(null);
  

  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  async function gerarRelatorio(e){
    e.preventDefault();
    const relatorio = await pedidoService.gerarRelatorio(dataInicio,  dataFim);

    let pdfWindow = window.open("")
    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + relatorio + "'></iframe>")
  }

  return (
    <div className="p-margin-formularios">
      <form id="formMesas" className="p-fluid" >
        <Panel header="Relatório de Pedidos">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="firstname6">Data Início</label>
                  <Calendar id="icon" value={dataInicio} onChange={(e) => setDataInicio(e.value)} showIcon dateFormat="dd/mm/yyyy"/>
              </div>
              <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="firstname6">Data Fim</label>
                  <Calendar id="icon" value={dataFim} onChange={(e) => setDataFim(e.value)} showIcon dateFormat="dd/mm/yyyy"/>
              </div>
              <div className="p-field p-col-12 p-md-8 "/>
              <div className="p-field p-col-12 p-md-2">
                <Button id="salvarProduto" label="Imprimir" onClick={gerarRelatorio}/>
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

export default RelatorioPedido;