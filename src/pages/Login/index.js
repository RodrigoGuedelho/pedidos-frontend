import React, {useState, useEffect, Fragment, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from "primereact/button";
import { Toast } from "primereact/toast";
import auth from "../../auth";
import "./style.css";
import { ReactComponent as Logo } from '../../assets/logo.svg' ; 

function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const toast = useRef(null);


    const showError = () => {
      toast.current.show({severity:'error', summary: 'Error Message', detail:'Login ou senha inválidas', life: 3000});
    }

    async function login(e) {
      console.log("teste")
      e.preventDefault();
      const retorno = await auth.login(userName, password);
      if (retorno)
        window.location.href ='/';
      else
        showError();
    }
   
    return (
      <div class="p-d-flex p-jc-center margin-login"  >
        
        <form id="formLogin" className="p-fluid" onSubmit={login} >
          <Toast ref={toast} position="top-right" />
          <div className="" >
            <div className="p-d-flex p-jc-center"><Logo /></div>
            <h1 className="p-d-flex p-jc-center">Pedido Legal</h1>
          </div>
            <div className="p-field ">
                <label htmlFor="username" className="p-d-block">Username</label>
                <InputText id="username" aria-describedby="username2-help" value={userName}   
                  onChange={e => setUserName(e.target.value)}/>
            </div>
            <div className="p-field">
                <label htmlFor="senha" className="p-d-block">Senha</label>
                <Password id="senha" aria-describedby="username2-help" 
                  onChange={e => setPassword(e.target.value)} toggleMask feedback={false}/>
            </div>

            
            <div className="p-field">
              <Button id="btnSalvarLogin" label="Login" />
            </div>

        </form>
      </div>
    );
  //}
}

export default Login;