import React, {useState, useRef, useEffect } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import {Link} from 'react-router-dom';
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { AutoComplete } from 'primereact/autocomplete';
import { confirmDialog } from 'primereact/confirmdialog';
import produtoService from '../../services/ProdutoService';
import pedidoService from "../../services/PedidoSerice";
import mesaService from "../../services/MesaService";
import util from "../../utils/Util";

function CadProduto(props) {
  const [mesasAbertas, setMesasAbertas] = useState();
  const [mesa, setMesa] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [itemPedidos, setItemPedidos] =  useState([]);
  const [idProdutoItemPedido, setIdProdutoItemPedido] = useState();
  const [descricaoProdutoItemPedido, setDescricaoProdutoItemPedido] = useState();
  const [produto, setProduto] = useState();
  const [produtos, setProdutos] = useState();
  const [quantidadeItemPedido, setQuantidadeItemPedido] = useState(0);
  const [valorItemPedido, setValorItemPedido] = useState();
  const [subtotalItemPedido, setSubtotalItemPedido] = useState();
  const toast = useRef(null);
  const {match} = props;
  const {id} = match.params;
  const menu =useState(null);
  const [items, setItems] = useState([
    {label: 'Excluir', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogRemoverItemPedido()}
  ]);
  const [itemPedidoExclusao, setItemPedidoExclusao] = useState();

  const showMessage = (mensagem, tipo, titulo) => {
    toast.current.show({severity:tipo, summary: titulo, detail:mensagem, life: 3000});
  }

  function addItemPedido(e) {
    e.preventDefault();
    if (!validaAddItemPedido())
      return;
    var itemPedidosAux = []

    itemPedidos.map((item)=> {
      itemPedidosAux.push(item)
    });

    itemPedidosAux.push({
      produtoId : produto.id, 
      descricao : produto.descricao,
      quantidade : quantidadeItemPedido ? quantidadeItemPedido : 0,
      preco : produto.preco,
      subtotalItemPedido : produto.preco * quantidadeItemPedido
    });

    setItemPedidos(itemPedidosAux);
    limparCamposItemPedido();
  }

  const confirmDialogRemoverItemPedido = () => {
    confirmDialog({
        message: 'Você tem certeza que deseja remover um item do Pedido?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => removerItemPedido(),
        reject: () => console.log("fechou")
    });
  }

  function removerItemPedido(){
    var indexExclusao = itemPedidos.indexOf(itemPedidoExclusao);
    var itensPedidosAux = [] 
    itemPedidos.splice(indexExclusao, 1);
    itemPedidos.map((item) => {
      itensPedidosAux.push(item);
    })
    
    setItemPedidos(itensPedidosAux);
  }

  function showMenu(e,rowData) {
    e.preventDefault();
    
    setItems([   
      {label: 'Excluir', icon: 'pi pi-fw pi-trash', command : ()=> confirmDialogRemoverItemPedido()}
    ])
    setItemPedidoExclusao(rowData);
    console.log("pedido", rowData)
    try {
      menu.current.toggle(e);
    } catch (error) {
      
    }
    
  }

  function validaAddItemPedido() {
    if (produto == undefined) {
      showMessage("Informe o produto.", "error", "Operação");
      return false;
    } else if (quantidadeItemPedido <= 0) {
      showMessage("Informe uma quantidade maior que Zero.", "error", "Operação");
      return false;
    }
    return true;
  }

  const pesquisarProdutos = async (event) => {
    if(event.query.toLowerCase() === "")  {
      const response = await produtoService.pesquisar('', '', 'ATIVO');
      console.log("Produtos", response.data)
      setProdutos(response);
    } else  {
      const response = await produtoService.pesquisar(event.query.toLowerCase(), '', 'ATIVO');
      setProdutos(response);
    }
    
  }

  const pesquisarMesasAbertas = async (event) => {
    if(event.query.toLowerCase() === "")  {
      const response = await mesaService.pesquisarMesasAbertas(0);
      console.log("mesas", response)
      setMesasAbertas(response);
    } else  {
      const response = await produtoService.pesquisar(event.query.toLowerCase());
      setMesasAbertas(response);
    }
    
  }

  async function salvar(e) {
    e.preventDefault();
    var retorno = null;
    if (!validarSalvar())
      return;
    try {
      var retorno = null;
      if (!util.isEmptyNumber(id) && id >0) 
        retorno = await pedidoService.editar(getBodyPedido());
      else 
        retorno = await pedidoService.salvar(getBodyPedido());
      
        
      console.log("teste", retorno)
      if (retorno.status >= 200 && retorno.status < 300)
        showMessage("Operação realizada com sucesso.", "success", "Operação")
      else 
        showMessage("Erro ao tenta salvar.", "error", "Operação");
    } catch (error) {
      showMessage("Erro ao tenta salvar.", "error", "Operação")
    }
  }

  function getBodyPedido() {
    return {
      id : !util.isEmptyNumber(id) && id >0  ? id : null,
      mesaId : mesa.id,
      observacao: observacao,
      itensPedido : itemPedidos
    }
  }

  function validarSalvar() {
    if (mesa == null) {
      showMessage("Informe o número da mesa.", "error", "Operação");
      return false; 
    } else if (util.isEmptyNumber(mesa.id)) {
      showMessage("Informe o número da mesa.", "error", "Operação");
      return false; 
    } else if (itemPedidos.length == 0) {
      showMessage("Informe os itens do pedido.", "error", "Operação");
      return false; 
    }
    return true;
  }

  function selecionaProduto(produto) {
    setProduto(produto);
    if (produto != undefined)
      setValorItemPedido(produto.preco)
  }

  function selecionaQuantidade(quantidade) {
    setQuantidadeItemPedido(quantidade);
    if (quantidade != undefined && produto.id != undefined) {
      setSubtotalItemPedido(quantidade * produto.preco)
    }
      
  }

  function limparCamposItemPedido() {
    setProduto(undefined);
    setQuantidadeItemPedido(0);
    setValorItemPedido(0);
    setSubtotalItemPedido(0);
  }
  async function carregaDadosEditar(id) {
    const pedido = await pedidoService.getPedido(id);
      if(pedido) {
        setObservacao(pedido.observacao);
        setMesa({id: pedido.mesaId, numero: pedido.mesaNumero})
        var itensPedidosAuxiliar = []
        pedido.itensPedido.map(itemPedido=> {
          itensPedidosAuxiliar.push({
            id: itemPedido.id,
            produtoId : itemPedido.produtoId,
            descricao : itemPedido.produtoDescricao,
            quantidade : itemPedido.quantidade,
            preco : itemPedido.preco,
            subtotalItemPedido : itemPedido.preco * itemPedido.quantidade
          })
        });
        setItemPedidos(itensPedidosAuxiliar);
      }
  } 
  function actionBodyTemplate(rowData) {
    return (
        <React.Fragment>
            <Menu id="menuAcoes" model={items} popup ref={menu} id="popup_menu" />
            <Button icon="pi pi-ellipsis-v" onClick={(e)=> showMenu(e, rowData)} aria-controls="popup_menu" aria-haspopup  className="p-button-rounded" />
        </React.Fragment>
    );
  }

  useEffect(async () => {
    if(id !== undefined){
      carregaDadosEditar(id);
    }
  }, []);

  return (
    <div className="p-margin-formularios">
      <form id="formProduto" className="p-fluid" >
        <Panel header="Cadastro de Produtos">
          <Toast ref={toast} position="top-right" />
          <div className="p-fluid p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-2">
                  <label htmlFor="labelNumeroMesa">Número Mesa:</label>
                  <AutoComplete id="autocompleteMesa" value={mesa} suggestions={mesasAbertas} completeMethod={pesquisarMesasAbertas} 
                        field="numero" dropdown forceSelection onChange={(e) => setMesa(e.value)} />
              </div>
              <div className="p-field p-col-12">
                  <label htmlFor="labelObservacao">Observação</label>
                  <InputTextarea id="edtObservacao" type="text" rows="4" 
                     value={observacao} onChange={(e) => setObservacao(e.target.value)} />
              </div>
              <Panel header="Itens do pedido">
                <div className="p-fluid p-formgrid p-grid">
                  <div className="p-field p-col-12 p-md-3">
                      <label htmlFor="labelIdProduto">Id Produto:</label>
                      <AutoComplete value={produto} suggestions={produtos} completeMethod={pesquisarProdutos} 
                        field="descricao" dropdown forceSelection onChange={(e) => selecionaProduto(e.value)} />
                  </div>

                  <div className="p-field p-col-12 p-md-1">
                      <label htmlFor="labelQuantidade">Quantidade:</label>
                      <InputNumber inputId="locale-user" value={quantidadeItemPedido} 
                        onChange={(e) => selecionaQuantidade(e.value)}  mode="decimal" minFractionDigits={2} />
                  </div>

                  <div className="p-field p-col-12 p-md-1">
                      <label htmlFor="labelValor">Valor:</label>
                      <InputNumber inputId="locale-user" value={valorItemPedido} mode="decimal" minFractionDigits={2} disabled={true}/>
                  </div>

                  <div className="p-field p-col-12 p-md-1">
                      <label htmlFor="labbelSubtotal">Subtotal:</label>
                      <InputNumber inputId="locale-user" value={subtotalItemPedido} mode="decimal" minFractionDigits={2} disabled="true"/>
                  </div>

                  <div className="p-field p-col-12 p-md-1">
                      <label htmlFor="labbelSubtotal">Adicionar</label>
                      <Button id="salvarProduto" onClick={addItemPedido} >
                        <i className="pi pi-check" ></i>
                        Add
                      </Button>
                  </div>
                  <div className="p-field p-col-12 p-md-12">
                    <DataTable value={itemPedidos} className="p-datatable-responsive-demo" paginator rows={8}>
                      <Column field="descricao"  header="Descrição"></Column>
                      <Column field="quantidade"  header="Qtd"></Column>
                      
                      <Column field="subtotalItemPedido"  header="Subtotal"></Column>
                      <Column  header="Ações" body={actionBodyTemplate}  bodyStyle={{ textAlign: 'center' }}>
                      
                      </Column>
                    </DataTable>
                  </div>
                  
                </div>
              </Panel>

              <div className="p-field p-col-12 p-md-8 "/>
              <div className="p-field p-col-12 p-md-2">
                <Button id="salvarProduto" label="Salvar" onClick={salvar}/>
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