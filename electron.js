const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");

// ── Banco de dados com sql.js ────────────────────────────────────────────────
let db;
let SQL;
const dbPath = path.join(app.getPath("userData"), "protecontrol.db");

async function initDB() {
  const initSqlJs = require("sql.js");
  SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS dentista (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT
    );
    CREATE TABLE IF NOT EXISTS trabalho (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      valor REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente TEXT NOT NULL,
      dentista_id INTEGER,
      trabalho_id INTEGER,
      status TEXT DEFAULT 'EM_PRODUCAO',
      data_entrega TEXT,
      pago INTEGER DEFAULT 0,
      cor TEXT,
      observacao TEXT
    );
  `);

  saveDB();
}

function saveDB() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function query(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDB();
  return db.exec("SELECT last_insert_rowid() as id")[0]?.values[0][0];
}

// ── Janela principal ─────────────────────────────────────────────────────────
let mainWindow;

async function createWindow() {
  await initDB();

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    title: "ProteControl",
    show: false,
  });

  // 🔥 CORREÇÃO AQUI (IMPORTANTE)
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ── Dentistas ─────────────────────────────────────────────────────────────────
ipcMain.handle("dentistas:listar", () => {
  return query("SELECT * FROM dentista ORDER BY nome");
});

ipcMain.handle("dentistas:criar", (_, { nome, telefone, email }) => {
  const id = run(
    "INSERT INTO dentista (nome, telefone, email) VALUES (?,?,?)",
    [nome, telefone || null, email || null]
  );
  return query("SELECT * FROM dentista WHERE id=?", [id])[0];
});

ipcMain.handle("dentistas:atualizar", (_, { id, nome, telefone, email }) => {
  run(
    "UPDATE dentista SET nome=?,telefone=?,email=? WHERE id=?",
    [nome, telefone || null, email || null, id]
  );
  return query("SELECT * FROM dentista WHERE id=?", [id])[0];
});

ipcMain.handle("dentistas:deletar", (_, id) => {
  run("DELETE FROM dentista WHERE id=?", [id]);
  return { ok: true };
});

// ── Trabalhos ─────────────────────────────────────────────────────────────────
ipcMain.handle("trabalhos:listar", () => {
  return query("SELECT * FROM trabalho ORDER BY descricao");
});

ipcMain.handle("trabalhos:criar", (_, { descricao, valor }) => {
  const id = run(
    "INSERT INTO trabalho (descricao, valor) VALUES (?,?)",
    [descricao, valor]
  );
  return query("SELECT * FROM trabalho WHERE id=?", [id])[0];
});

ipcMain.handle("trabalhos:atualizar", (_, { id, descricao, valor }) => {
  run(
    "UPDATE trabalho SET descricao=?,valor=? WHERE id=?",
    [descricao, valor, id]
  );
  return query("SELECT * FROM trabalho WHERE id=?", [id])[0];
});

ipcMain.handle("trabalhos:deletar", (_, id) => {
  run("DELETE FROM trabalho WHERE id=?", [id]);
  return { ok: true };
});

// ── Pedidos ───────────────────────────────────────────────────────────────────
ipcMain.handle("pedidos:listar", () => {
  const rows = query(`
    SELECT p.*,
      d.id as d_id, d.nome as d_nome, d.telefone as d_telefone, d.email as d_email,
      t.id as t_id, t.descricao as t_descricao, t.valor as t_valor
    FROM pedido p
    LEFT JOIN dentista d ON p.dentista_id = d.id
    LEFT JOIN trabalho t ON p.trabalho_id = t.id
    ORDER BY p.id DESC
  `);

  return rows.map(p => ({
    id: p.id,
    paciente: p.paciente,
    status: p.status,
    dataEntrega: p.data_entrega,
    pago: p.pago === 1,
    cor: p.cor,
    observacao: p.observacao,
    dentista: p.d_id
      ? { id: p.d_id, nome: p.d_nome, telefone: p.d_telefone, email: p.d_email }
      : null,
    trabalho: p.t_id
      ? { id: p.t_id, descricao: p.t_descricao, valor: p.t_valor }
      : null,
  }));
});

ipcMain.handle("pedidos:criar", (_, { paciente, dentistaId, trabalhoId, dataEntrega, cor, observacao }) => {
  const id = run(
    "INSERT INTO pedido (paciente,dentista_id,trabalho_id,data_entrega,cor,observacao) VALUES (?,?,?,?,?,?)",
    [paciente, dentistaId, trabalhoId, dataEntrega || null, cor || null, observacao || null]
  );
  return { id };
});

ipcMain.handle("pedidos:atualizar", (_, { id, paciente, dentistaId, trabalhoId, dataEntrega, cor, observacao }) => {
  run(
    "UPDATE pedido SET paciente=?,dentista_id=?,trabalho_id=?,data_entrega=?,cor=?,observacao=? WHERE id=?",
    [paciente, dentistaId, trabalhoId, dataEntrega || null, cor || null, observacao || null, id]
  );
  return { ok: true };
});

ipcMain.handle("pedidos:status", (_, { id, status }) => {
  run("UPDATE pedido SET status=? WHERE id=?", [status, id]);
  return { ok: true };
});

ipcMain.handle("pedidos:pago", (_, { id, pago }) => {
  run("UPDATE pedido SET pago=? WHERE id=?", [pago ? 1 : 0, id]);
  return { ok: true };
});

ipcMain.handle("pedidos:deletar", (_, id) => {
  run("DELETE FROM pedido WHERE id=?", [id]);
  return { ok: true };
});