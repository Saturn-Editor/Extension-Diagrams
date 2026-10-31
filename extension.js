import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emptyDiagram, parseDiagram, serializeDiagram } from './lib/format.js';
import { convert } from './lib/import.js';

const DOCUMENT = 'diagrams.board';
const BOARDS = 'diagrams.boards';
const PROJECT_TYPE = 'diagrams';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

let saturn;
let pageSource;
const pendingReveal = new Map();
let boardsTimer;

export function activate(api) {
  saturn = api;

  saturn.documents.registerEditor(DOCUMENT, { html, onMessage });
  saturn.projectTypes.onCreate(PROJECT_TYPE, createProject);
  saturn.projects.onDidOpen((ctx) => openFirstBoard(ctx).catch(() => {}));

  saturn.commands.register('diagrams.newBoard', newBoard);
  saturn.commands.register('diagrams.import', importDiagram);
  saturn.commands.register('diagrams.exportSvg', (ctx) => sendCommand(ctx, 'exportSvg'));
  saturn.commands.register('diagrams.exportPng', (ctx) => sendCommand(ctx, 'exportPng'));
  saturn.commands.register('diagrams.copyPng', (ctx) => sendCommand(ctx, 'copyPng'));
  saturn.commands.register('diagrams.zoomToFit', (ctx) => sendCommand(ctx, 'zoomToFit'));

  saturn.search.registerProvider({ search, open: openResult });

  saturn.panels.registerTree(BOARDS, { getChildren: boardItems, onAction: boardAction });
  saturn.workspace.onDidChangeFiles(() => {
    clearTimeout(boardsTimer);
    boardsTimer = setTimeout(() => saturn.panels.refresh(BOARDS), 300);
  });
}

async function boardItems(parentId, ctx) {
  if (parentId) return [];
  const files = (await saturn.workspace.findFiles(ctx.projectPath, '**/*.diagram'))
    .map((file) => path.resolve(ctx.projectPath, file))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  const items = files.map((file) => {
    const folder = path.relative(ctx.projectPath, path.dirname(file));
    return {
      id: file,
      label: path.basename(file, '.diagram'),
      description: folder && folder !== 'boards' ? folder : undefined,
      hasChildren: false,
      open: { path: file },
      actions: [
        { id: 'rename', label: 'Rename…' },
        { id: 'duplicate', label: 'Duplicate' },
      ],
    };
  });
  return [{ id: 'new', label: 'New Board…', hasChildren: false, actions: [{ id: 'new', label: 'New Board…' }] }, ...items];
}

async function boardAction(actionId, item, ctx) {
  if (actionId === 'new') return newBoard(ctx);
  if (actionId === 'rename') {
    const name = await saturn.window.showInput(ctx.projectPath, { title: 'Rename Board', value: item.label });
    if (!name?.trim() || name.trim() === item.label) return;
    await saturn.workspace.renameFile(ctx.projectPath, item.id, fileName(name) + '.diagram');
  } else if (actionId === 'duplicate') {
    const target = await freePath(path.dirname(item.id), `${item.label} copy`, '.diagram');
    await fs.copyFile(item.id, target);
    await saturn.workspace.openFile(ctx.projectPath, target);
  }
  saturn.panels.refresh(BOARDS);
}

export function deactivate() {
  clearTimeout(boardsTimer);
  pendingReveal.clear();
}

async function loadPage() {
  if (pageSource) return pageSource;
  const [format, script, css] = await Promise.all([
    fs.readFile(path.join(HERE, 'lib', 'format.js'), 'utf8'),
    fs.readFile(path.join(HERE, 'page', 'page.js'), 'utf8'),
    fs.readFile(path.join(HERE, 'page', 'page.css'), 'utf8'),
  ]);
  pageSource = { script: format.replace(/^export /gm, '') + '\n' + script, css };
  return pageSource;
}

async function html(ctx) {
  const { script, css } = await loadPage();
  const initial = JSON.stringify(ctx.text ?? '').replace(/</g, '\\u003c');
  return `<style>${css}</style>
<div id="toolbar"></div>
<div id="main"><nav id="palette" aria-label="Shapes"></nav><div id="stage"><svg id="canvas" xmlns="http://www.w3.org/2000/svg"></svg></div></div>
<script>const INITIAL_TEXT = ${initial};
${script.replace(/<\/script/gi, '<\\/script')}</script>`;
}

async function onMessage(message, ctx) {
  try {
    if (message.type === 'change') {
      saturn.documents.setText(ctx.path, serializeDiagram(parseDiagram(JSON.stringify(message.doc))));
    } else if (message.type === 'ready') {
      const id = pendingReveal.get(ctx.path);
      pendingReveal.delete(ctx.path);
      if (id) saturn.documents.postMessage(ctx.path, { type: 'reveal', id });
    } else if (message.type === 'revealed') {
      pendingReveal.delete(ctx.path);
    } else if (message.type === 'export') {
      await exportFile(message, ctx);
    } else if (message.type === 'pickImage') {
      await pickImage(message, ctx);
    } else if (message.type === 'error') {
      saturn.window.showMessage(message.message, { kind: 'error', projectPath: ctx.projectPath });
    }
  } catch (error) {
    saturn.window.showMessage(`Diagrams: ${error.message}`, { kind: 'error', projectPath: ctx.projectPath });
  }
}

function sendCommand(ctx, name) {
  if (!ctx.path) return;
  saturn.documents.postMessage(ctx.path, { type: 'command', name });
}

async function exportFile(message, ctx) {
  const base = path.basename(ctx.path, '.diagram');
  const inProject = await exists(path.join(ctx.projectPath, 'diagrams.json'));
  const defaultFolder = inProject ? path.join(ctx.projectPath, 'exports') : path.dirname(ctx.path);
  if (inProject) await fs.mkdir(defaultFolder, { recursive: true });
  const target = await saturn.window.showSaveDialog(ctx.projectPath, {
    title: `Export ${base}`,
    defaultName: path.relative(ctx.projectPath, path.join(defaultFolder, `${base}.${message.format}`)).split(path.sep).join('/'),
    defaultFolder,
    filters: [{ name: message.format.toUpperCase(), extensions: [message.format] }],
  });
  if (!target) return;
  const data = message.format === 'png'
    ? Buffer.from(message.data.replace(/^data:image\/png;base64,/, ''), 'base64')
    : message.data;
  await fs.writeFile(target, data);
  saturn.window.showMessage(`Exported ${path.basename(target)}`, { projectPath: ctx.projectPath });
}

async function pickImage(message, ctx) {
  const picked = await saturn.window.showOpenDialog(ctx.projectPath, {
    title: 'Insert Image',
    filters: [{ name: 'Images', extensions: IMAGE_EXTENSIONS }],
  });
  if (!picked?.length) return;
  const relative = path.relative(ctx.projectPath, picked[0]);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    saturn.window.showMessage('Pick an image inside the project folder, for example in assets/.', { kind: 'warning', projectPath: ctx.projectPath });
    return;
  }
  saturn.documents.postMessage(ctx.path, { type: 'image', src: relative.split(path.sep).join('/'), at: message.at });
}

async function createProject(ctx) {
  await fs.mkdir(path.join(ctx.projectPath, 'boards'), { recursive: true });
  await fs.mkdir(path.join(ctx.projectPath, 'assets'), { recursive: true });
  const board = emptyDiagram();
  board.nodes.push({ id: 'n_1', type: 'round', x: 80, y: 80, w: 200, h: 70, text: ctx.name || 'Start here', style: { fill: 'accent' } });
  await fs.writeFile(path.join(ctx.projectPath, 'boards', 'main.diagram'), serializeDiagram(board));
  await writeMarker(ctx.projectPath, { version: 1, defaultBoard: 'boards/main.diagram', firstOpen: true });
  await fs.writeFile(path.join(ctx.projectPath, '.gitignore'), 'exports/\n');
}

async function openFirstBoard(ctx) {
  let marker;
  try {
    marker = JSON.parse(await fs.readFile(path.join(ctx.projectPath, 'diagrams.json'), 'utf8'));
  } catch {
    return;
  }
  if (!marker?.firstOpen) return;
  delete marker.firstOpen;
  await writeMarker(ctx.projectPath, marker);
  if (marker.defaultBoard) await saturn.workspace.openFile(ctx.projectPath, path.join(ctx.projectPath, marker.defaultBoard));
}

function writeMarker(projectPath, marker) {
  return fs.writeFile(path.join(projectPath, 'diagrams.json'), JSON.stringify(marker, null, 2) + '\n');
}

async function newBoard(ctx) {
  const name = await saturn.window.showInput(ctx.projectPath, { title: 'New Board', placeholder: 'Board name' });
  if (!name?.trim()) return;
  const folder = path.join(ctx.projectPath, 'boards');
  await fs.mkdir(folder, { recursive: true });
  const target = await freePath(folder, fileName(name), '.diagram');
  await fs.writeFile(target, serializeDiagram(emptyDiagram()));
  await saturn.workspace.openFile(ctx.projectPath, target);
}

async function importDiagram(ctx) {
  const picked = await saturn.window.showOpenDialog(ctx.projectPath, {
    title: 'Import Diagram',
    filters: [{ name: 'Mermaid or PlantUML', extensions: ['mmd', 'mermaid', 'puml', 'plantuml', 'pu', 'iuml', 'md'] }],
  });
  if (!picked?.length) return;
  try {
    const doc = convert(await fs.readFile(picked[0], 'utf8'), path.extname(picked[0]).toLowerCase());
    const inProject = await exists(path.join(ctx.projectPath, 'diagrams.json'));
    const folder = inProject ? path.join(ctx.projectPath, 'boards') : path.dirname(picked[0]);
    await fs.mkdir(folder, { recursive: true });
    const target = await freePath(folder, fileName(path.basename(picked[0]).replace(/\.[^.]+$/, '')), '.diagram');
    await fs.writeFile(target, serializeDiagram(doc));
    await saturn.workspace.openFile(ctx.projectPath, target);
  } catch (error) {
    saturn.window.showMessage(`Couldn't import ${path.basename(picked[0])}: ${error.message}`, { kind: 'error', projectPath: ctx.projectPath });
  }
}

async function search(query, ctx) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const files = await saturn.workspace.findFiles(ctx.projectPath, '**/*.diagram');
  const results = [];
  for (const file of files) {
    const full = path.resolve(ctx.projectPath, file);
    const board = path.basename(full, '.diagram');
    if (board.toLowerCase().includes(needle)) results.push({ id: full, label: board, detail: 'Board' });
    let doc;
    try {
      doc = parseDiagram(await fs.readFile(full, 'utf8'));
    } catch {
      continue;
    }
    for (const node of doc.nodes) {
      if (node.text && node.text.toLowerCase().includes(needle)) {
        results.push({ id: `${full}#${node.id}`, label: node.text.split('\n')[0], detail: board });
      }
    }
    if (results.length >= 50) break;
  }
  return results.slice(0, 50);
}

async function openResult(id, ctx) {
  const [file, nodeId] = id.split('#');
  if (nodeId) {
    pendingReveal.set(file, nodeId);
    saturn.documents.postMessage(file, { type: 'reveal', id: nodeId });
  }
  await saturn.workspace.openFile(ctx.projectPath, file);
}

function fileName(name) {
  return name.trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ') || 'Board';
}

async function freePath(folder, base, extension) {
  let candidate = path.join(folder, base + extension);
  for (let i = 2; await exists(candidate); i++) candidate = path.join(folder, `${base} ${i}${extension}`);
  return candidate;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}
