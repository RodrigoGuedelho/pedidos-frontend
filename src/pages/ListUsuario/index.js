import React, {useState, useRef } from "react";
import { Panel } from 'primereact/panel';
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { InputText } from 'primereact/inputtext';
import {Button} from "primereact/button"
import { Menu } from 'primereact/menu';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';

import usuarioService from '../../services/UsuarioService';

function ListUsuario(props) {
  const [login, setLogin] = useState('');
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState("ATIVO");
  const [usuarios, setUsuarios] = useState([]);
  const statusFiltro = ["ATIVO", "CANCELADO"];
  
  const toast = useRef(null);
  const menu =useState(null);
  const [items, setItems] = useState([
    {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: ''},
    {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogDesativacao()}
  ]);
  const [usuarioExclusao, setUsuarioExlusao] = useState(null);

  const showMessage = (mensagem, tipo = "success", titulo = "Operação") => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  async function pesquisar(e)  {
    e.preventDefault();
    console.log("teste")
    setUsuarios(await usuarioService.pesquisar(login, nome, undefined, status));
  } 

  const confirmDialogDesativacao = () => {
    confirmDialog({
        message: 'Você tem certeza que deseja desativar o Usuário?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => desabilitaUsuario(),
        reject: () => console.log("fechou")
    });
  }

  async function desabilitaUsuario() {
    var retorno = null;
    try {
      retorno = await usuarioService.cancelar(usuarioExclusao.id);
      console.log(retorno)
      if (retorno) {
        showMessage("usuário desativado com sucesso.");
        removeListaUsuario();
      } else {
        showMessage("Erro ao tenta desabilitar usuário.", "error");
      }
        
    } catch (error) {
      showMessage("Erro ao tenta desabilitar usuário.");
    }
    
  }

  function removeListaUsuario(){
    var indexExclusao = usuarios.indexOf(usuarioExclusao);
    var usuariosAux = [] 
    usuarios.splice(indexExclusao, 1);
    usuarios.map((usuario) => {
      usuariosAux.push(usuario);
    })
    
    setUsuarios(usuariosAux);
  }

  function actionBodyTemplate(rowData) {
    
    return (
        <React.Fragment>
            <Menu id="menuAcoes" model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-ellipsis-v" onClick={(e)=> showMenu(e, rowData)} aria-controls="popup_menu" aria-haspopup  className="p-button-rounded" />
        </React.Fragment>
    );
  }

  function showMenu(e,rowData) {
    e.preventDefault();
    
    setItems([
      {label: 'Editar', icon: 'pi pi-fw pi-pencil',url: getUrlEdiarUsuario(rowData)},
      {label: 'Cancelar', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogDesativacao()}
    ])
    setUsuarioExlusao(rowData);
    try {
      menu.current.toggle(e);
    } catch (error) {
      
    }
    
  }

  function getUrlEdiarUsuario(usuario) {
    return "/usuarios/" + usuario.id
  }

  return (
    <div className="p-margin-formularios">
      <form id="formUsuarios" className="p-fluid" >
        <Panel header="Mesas">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-3">
              <InputText id="inputLogin" type="text"  value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login"/>
            </div>
            <div className="p-field p-col-12 p-md-3">
              <InputText id="inputNome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome"/>
            </div>
            <div className="p-field p-col-12 p-md-2">
              <Dropdown value={status} options={statusFiltro} onChange={(e) => setStatus(e.value)} placeholder="Status"/>
            </div>
            <div className="p-field p-col-12 p-md-2">
              <Button icon="pi pi-search" onClick={pesquisar}/> 
            </div>
          </div>
          
          <div className="card">
          <DataTable value={usuarios} className="p-datatable-responsive-demo" paginator rows={8} responsiveLayout="stack" >
              <Column field="id"  header="Id"></Column>
              <Column field="login" header="Login"></Column>
              <Column field="nome"  header="Nome"></Column>
              <Column field="numero"  header="Número"></Column>
              <Column body={actionBodyTemplate} header="Ações"  bodyStyle={{ textAlign: 'center' }}>
               
              </Column>
          </DataTable>
          </div>
        </Panel>  
      </form>
    </div> 
  );
}

export default ListUsuario;