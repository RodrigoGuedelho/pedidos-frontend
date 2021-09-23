import React, {useState, useRef, useEffect } from "react";
import { Panel } from 'primereact/panel';

import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import {Link} from 'react-router-dom';
import { Toast } from "primereact/toast";
import mesaService from "../../services/MesaService";
import util from "../../utils/Util";
//import "./style.css";


function CadMesa(props) {
  const [numero, setNumero] = useState(0);
  const [idMesa, setIdMesa] = useState(0);
  const toast = useRef(null);
  const {match} = props;
  const {id} = match.params;
  

  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  useEffect(async () => {
    if(id !== undefined){
      const mesa = await mesaService.getMesa(id);
      if(mesa) {
        setNumero(mesa.numero);
        setIdMesa(mesa.id);
      } 
    }
  }, []);

  async function salvar(e) {
    try {
      e.preventDefault();
      if (!await validarSalvar())
        return;
      const body = {
        numero : numero,
        id : idMesa ? idMesa : undefined
      }
      
      const retorno = await mesaService.salvar(body);
      console.log("retorno", retorno)
      if (retorno.status >= 200 && retorno.status < 300)
        showMessage("Operação realizada com sucesso.", "success", "Operação")
      else 
        showMessage("Erro ao tenta salvar.", "error", "Operação");
    } catch (error) {
      console.log("erro:", error)
      showMessage("Erro ao tenta salvar.", "error", "Operação")
    }
  }

  async function validarSalvar() {
    let retorno = true;
    if (util.isEmptyNumber(numero)) {
      await showMessage("Descrição não informada.", "error", "Operação");
      retorno = false;
    }
    
    var mesaAuxiliar = await mesaService.pesquisar(null, numero);
    console.log("Mesas", mesaAuxiliar)
    if (!util.isEmptyNumber(numero) && mesaAuxiliar.length > 0) {
      await showMessage("Já existe uma mesa com esse número.", "error", "Operação");
      retorno = false;
    }

    return retorno;
  }

  return (
    <div className="p-margin-formularios">
      <form id="formMesas" className="p-fluid" >
        <Panel header="Cadastro de Mesas">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="firstname6">Número</label>
                  <InputNumber inputId="minmax" value={numero} onValueChange={(e) => setNumero(e.value)} mode="decimal" min={1} max={1000} />
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

export default CadMesa;