import React, {useState, useEffect, Fragment, useRef } from "react";

import auth from "../../auth";
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { PanelMenu } from 'primereact/panelmenu';
import { Toolbar } from 'primereact/toolbar';
import { ReactComponent as Logo } from '../../assets/logo-branca.svg' ; 
import {Link} from 'react-router-dom';
import { Image } from 'primereact/image';
import "./style.css";

import usuarioService from "../../services/UsuarioService";

function Layout() {
  const menu = useRef(null);
  const items = [
    {
        label:'Pedidos',
        icon:'pi pi-fw pi-file',
        items:[
            {
              label:'Novo',
              icon:'pi pi-fw pi-plus',
              command: function() {
                window.location.href="/pedidos/add"; 
              }
            },
            {
              label:'Listar',
              icon:'pi pi-fw pi-search',
              command: function() {
                window.location.href="/pedidos";  
              }
            },
            {
              label:'Relatórios',
              icon:'pi pi-fw pi-file-pdf',
              command: function() {
                window.location.href="/pedidos/relatorio"; 
              }
            }
                
        ]
    },

    {
      label:'Produtos',
      icon:'pi pi-fw pi-file',
      items:[
          {
            label:'Novo',
            icon:'pi pi-fw pi-plus',
            url: "/produtos/add"
            
          },
          {
            label:'Listar',
            icon:'pi pi-fw pi-search',
            url: "/produtos"
          }
              
      ]
    },

    {
      label:'Mesas',
      icon:'pi pi-fw pi-file',
      items:[
          {
            label:'Novo',
            icon:'pi pi-fw pi-plus',
            url: "/mesas/add"
          },
          {
            label:'Listar',
            icon:'pi pi-fw pi-search',
            url: "/mesas"
          }
              
      ]
    },
    {
      label:'Usuarios',
      icon:'pi pi-fw pi-file',
      items:[
          {
            label:'Novo',
            icon:'pi pi-fw pi-plus',
            url: "/usuarios/add"
          },
          {
            label:'Listar',
            icon:'pi pi-fw pi-search',
            url: "/usuarios"
          }
              
      ]
    },
    {
      label:'Logout',
      icon:'pi pi-fw pi-power-off',
      separator: true,
      command: function() {
      
        auth.logout();
      }  
    }    
  ];

  const [imagemUsuario, setImagemUsuario] = useState('');

  const leftContents = (
    <React.Fragment>
     <Button id="button-logo"  onClick={() => setVisibleSidebar(true)}><Logo /></Button>   
      <Link className="link-menu" to="/">Pedido Legal</Link> 
    </React.Fragment>
  );

  const rightContents = (
    <React.Fragment>
      <Image src={imagemUsuario} className="img-toolbar" />      
    </React.Fragment>
  );
  
  const [visibleSidebar, setVisibleSidebar] = useState(true);
  async function logout(e) {
      e.preventDefault();
      const retorno = await auth.logout();
  }
  useEffect(async (e) => {
    //setImagemUsuario(await usuarioService.getImagemUsuarioLogado());
    setImagemUsuario(auth.getImagemUsuarioLogadoCache());
  }, []);
  return (
    <div>
      <Sidebar visible={visibleSidebar} onHide={() => setVisibleSidebar(false)}>
        <h3>Telas</h3>
        <div className="card"><PanelMenu model={items} style={{ width: '100%' }}/></div>
      </Sidebar>
      <Toolbar  left={leftContents} right={rightContents}/>
    </div>
    
  );
}

export default Layout;