const { contextBridge, ipcRenderer } = require("electron");

let token = null;

contextBridge.exposeInMainWorld("api", {
  login: async (email, password) => {
    const data = await ipcRenderer.invoke("login", { email, password });
    if (data.success && data.token) token = data.token;
    return data;
  },

  getReservas: async (params = {}) => {
    if (!token) return { success: false, message: "No autenticado" };
    return await ipcRenderer.invoke("getReservas", { token, params });
  },

  updateReserva: async (id, data) => {
    if (!token) return { success: false, message: "No autenticado" };
    return await ipcRenderer.invoke("updateReserva", { token, id, data });
  },

  deleteReserva: async (id) => {
    if (!token) return { success: false, message: "No autenticado" };
    return await ipcRenderer.invoke("deleteReserva", { token, id });
  },
});

// console.log("✅ Preload cargado correctamente y window.api disponible");
