const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const axios = require("axios");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:8100");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../www/index.html"));
  }
}

app.whenReady().then(createWindow);

ipcMain.handle("login", async (_event, { email, password }) => {
  try {
    const res = await axios.post("http://localhost:3000/login", { email, password });
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Error de conexión" };
  }
});

ipcMain.handle("getReservas", async (_event, { token, params }) => {
  try {
    const res = await axios.get("http://localhost:3000/reservas", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Error de conexión" };
  }
});

ipcMain.handle("updateReserva", async (_event, { token, id, data }) => {
  try {
    const res = await axios.put(`http://localhost:3000/reserva/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Error de conexión" };
  }
});

ipcMain.handle("deleteReserva", async (_event, { token, id }) => {
  try {
    const res = await axios.delete(`http://localhost:3000/reserva/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (e) {
    return { success: false, message: e.response?.data?.message || "Error de conexión" };
  }
});
