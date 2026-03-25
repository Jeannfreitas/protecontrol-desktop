const { contextBridge, ipcRenderer } = require("electron");

// Expõe funções seguras para o React usar
contextBridge.exposeInMainWorld("api", {
  // Dentistas
  listarDentistas:   ()      => ipcRenderer.invoke("dentistas:listar"),
  criarDentista:     (data)  => ipcRenderer.invoke("dentistas:criar", data),
  atualizarDentista: (data)  => ipcRenderer.invoke("dentistas:atualizar", data),
  deletarDentista:   (id)    => ipcRenderer.invoke("dentistas:deletar", id),

  // Trabalhos
  listarTrabalhos:   ()      => ipcRenderer.invoke("trabalhos:listar"),
  criarTrabalho:     (data)  => ipcRenderer.invoke("trabalhos:criar", data),
  atualizarTrabalho: (data)  => ipcRenderer.invoke("trabalhos:atualizar", data),
  deletarTrabalho:   (id)    => ipcRenderer.invoke("trabalhos:deletar", id),

  // Pedidos
  listarPedidos:     ()      => ipcRenderer.invoke("pedidos:listar"),
  criarPedido:       (data)  => ipcRenderer.invoke("pedidos:criar", data),
  atualizarPedido:   (data)  => ipcRenderer.invoke("pedidos:atualizar", data),
  atualizarStatus:   (data)  => ipcRenderer.invoke("pedidos:status", data),
  marcarPago:        (data)  => ipcRenderer.invoke("pedidos:pago", data),
  deletarPedido:     (id)    => ipcRenderer.invoke("pedidos:deletar", id),
});
