const FILLS = {
  raised: '--saturn-raised',
  panel: '--saturn-panel',
  editor: '--saturn-editor',
  selection: '--saturn-selection',
  accent: '--saturn-accent',
  warning: '--saturn-warning',
  error: '--saturn-error',
};
const SELECT_ICON = '<path d="M6 3l12 9-5.5 1L15 19l-2.5 1-2.5-6L6 17z"/>';
const PALETTE = [
  { name: 'Basic', items: [
    { id: 'rect', title: 'Box', type: 'rect', key: 'R', icon: '<rect x="3" y="6" width="18" height="12"/>' },
    { id: 'round', title: 'Rounded box', type: 'round', key: 'O', icon: '<rect x="3" y="6" width="18" height="12" rx="4"/>' },
    { id: 'ellipse', title: 'Ellipse', type: 'ellipse', key: 'E', icon: '<ellipse cx="12" cy="12" rx="9" ry="6.5"/>' },
    { id: 'diamond', title: 'Diamond', type: 'diamond', key: 'D', icon: '<path d="M12 3l9 9-9 9-9-9z"/>' },
    { id: 'text', title: 'Text', type: 'text', key: 'T', icon: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>' },
    { id: 'note', title: 'Sticky note', type: 'note', size: [140, 100], style: { fill: 'warning' }, icon: '<path d="M4 4h16v11l-5 5H4zM15 20v-5h5"/>' },
    { id: 'image', title: 'Image from the project', type: 'image', key: 'I', icon: '<rect x="3" y="5" width="18" height="14"/><circle cx="9" cy="10" r="1.5"/><path d="M21 16l-5-5-9 8"/>' },
  ] },
  { name: 'Arrows', items: [
    { id: 'line', title: 'Straight arrow', key: 'A', arrow: 'straight', icon: '<path d="M5 19L18 6M11 6h7v7"/>' },
    { id: 'elbow', title: 'Right-angle arrow', key: 'L', arrow: 'elbow', icon: '<path d="M4 19h7V7h8M15 3l4 4-4 4"/>' },
    { id: 'line-dashed', title: 'Dashed arrow', arrow: 'straight', edgeStyle: { dashed: true }, icon: '<path d="M5 19l3-3M10 14l3-3M15 9l3-3M11 6h7v7"/>' },
    { id: 'line-plain', title: 'Line with no head', arrow: 'straight', edgeStyle: { arrowEnd: false }, icon: '<path d="M5 19L19 5"/>' },
    { id: 'elbow-dashed', title: 'Dashed right-angle arrow', arrow: 'elbow', edgeStyle: { dashed: true }, icon: '<path d="M4 19h3M9 19h2v-3M11 13v-3M11 7h3M16 7h3M15 3l4 4-4 4"/>' },
  ] },
  { name: 'Flowchart', items: [
    { id: 'terminal', title: 'Start or end', type: 'terminal', size: [140, 50], text: 'Start', icon: '<rect x="2" y="7" width="20" height="10" rx="5"/>' },
    { id: 'process', title: 'Process', type: 'rect', text: 'Process', icon: '<rect x="3" y="6" width="18" height="12"/>' },
    { id: 'decision', title: 'Decision', type: 'diamond', text: 'Decision?', icon: '<path d="M12 3l9 9-9 9-9-9z"/>' },
    { id: 'data', title: 'Input or output', type: 'data', size: [150, 60], text: 'Input', icon: '<path d="M7 6h15l-5 12H2z"/>' },
    { id: 'document', title: 'Document', type: 'document', size: [140, 80], text: 'Document', icon: '<path d="M4 4h16v13c-3-2-5 2-8 0s-5 2-8 0z"/>' },
    { id: 'stored', title: 'Stored data', type: 'cylinder', size: [100, 90], text: 'Data', icon: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5V6"/>' },
  ] },
  { name: 'Database', items: [
    { id: 'database', title: 'Database', type: 'cylinder', size: [100, 110], text: 'Database', icon: '<ellipse cx="12" cy="5" rx="8" ry="2.5"/><path d="M4 5v14c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/>' },
    { id: 'table', title: 'Table', type: 'table', size: [180, 130], text: 'users\nid: int\nname: text\nemail: text', icon: '<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M3 14h18M10 9v11"/>' },
    { id: 'view', title: 'View', type: 'table', size: [180, 100], text: 'active_users\nid: int\nname: text', style: { fill: 'selection' }, icon: '<rect x="3" y="4" width="18" height="16" stroke-dasharray="3 2"/><path d="M3 9h18"/>' },
    { id: 'one-one', title: 'One-to-one relationship', arrow: 'elbow', edgeStyle: { start: 'one', end: 'one' }, icon: '<path d="M2 12h20M5 8v8M19 8v8"/>' },
    { id: 'one-many', title: 'One-to-many relationship', arrow: 'elbow', edgeStyle: { start: 'one', end: 'many' }, icon: '<path d="M2 12h20M5 8v8M15 12l7-5M15 12l7 5"/>' },
    { id: 'many-many', title: 'Many-to-many relationship', arrow: 'elbow', edgeStyle: { start: 'many', end: 'many' }, icon: '<path d="M2 12h20M9 12L2 7M9 12l-7 5M15 12l7-5M15 12l7 5"/>' },
  ] },
  { name: 'User stories', items: [
    { id: 'actor', title: 'Actor', type: 'actor', size: [60, 100], text: 'User', icon: '<circle cx="12" cy="5" r="3"/><path d="M12 8v7M6 11h12M12 15l-4 6M12 15l4 6"/>' },
    { id: 'story', title: 'User story card', type: 'story', size: [220, 120], text: 'As a user\nI want to …\nso that …', icon: '<rect x="3" y="5" width="18" height="14"/><path d="M3 5v14" stroke-width="4"/><path d="M8 10h9M8 14h6"/>' },
    { id: 'epic', title: 'Epic', type: 'story', size: [240, 90], text: 'Epic: …', style: { fill: 'selection' }, icon: '<rect x="2" y="6" width="20" height="12"/><path d="M2 6v12" stroke-width="4"/><path d="M7 12h11"/>' },
    { id: 'usecase', title: 'Use case', type: 'ellipse', size: [160, 70], text: 'Use case', icon: '<ellipse cx="12" cy="12" rx="10" ry="6"/>' },
    { id: 'boundary', title: 'System boundary', type: 'rect', size: [320, 240], text: 'System', style: { fill: 'none', align: 'top' }, icon: '<rect x="2" y="3" width="20" height="18"/><path d="M5 7h6"/>' },
  ] },
];
const ITEMS = new Map(PALETTE.flatMap((section) => section.items).map((item) => [item.id, item]));
const SIDES = { top: [0.5, 0, 0, -1], right: [1, 0.5, 1, 0], bottom: [0.5, 1, 0, 1], left: [0, 0.5, -1, 0] };
const SIZES = { rect: [140, 60], round: [140, 60], ellipse: [120, 70], diamond: [140, 90], text: [120, 30], image: [160, 120] };
const GRID = 10;
const GAP = 20;

const stage = document.getElementById('stage');
const svg = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const palette = document.getElementById('palette');

let doc = null;
let view = { x: 40, y: 40, z: 1 };
let selection = new Set();
let tool = 'select';
let undoStack = [];
let redoStack = [];
let drag = null;
let editing = null;
let spaceDown = false;
let frame = 0;
let lastDown = null;
let lastToolbar = '';
let lastPalette = '';
let hover = null;
let arrowRoute = 'straight';
let placing = null;
const images = new Map();

load(INITIAL_TEXT, true);
stage.tabIndex = 0;
saturn.postMessage({ type: 'ready' });

function load(text, first) {
  try {
    doc = parseDiagram(text);
    hideProblem();
  } catch (error) {
    doc = null;
    showProblem(`This file isn't a diagram Saturn can read: ${error.message}. Fix it with Open as text, or undo the last change in git.`);
  }
  selection = new Set([...selection].filter(exists));
  if (first && doc) fit(false);
  render();
}

function showProblem(message) {
  let box = document.getElementById('problem');
  if (!box) {
    box = document.createElement('div');
    box.id = 'problem';
    stage.appendChild(box);
  }
  box.textContent = message;
}

function hideProblem() {
  document.getElementById('problem')?.remove();
}

saturn.onMessage((message) => {
  if (message.type === 'reload') {
    if (doc && serializeDiagram(doc) === message.text) return;
    undoStack = [];
    redoStack = [];
    load(message.text, false);
  } else if (message.type === 'undo') {
    undo();
  } else if (message.type === 'redo') {
    redo();
  } else if (message.type === 'theme') {
    render();
  } else if (message.type === 'image') {
    addImage(message.src, message.at);
  } else if (message.type === 'reveal') {
    saturn.postMessage({ type: 'revealed' });
    reveal(message.id);
  } else if (message.type === 'command') {
    runAction(message.name);
  }
});

function exists(id) {
  return !!(doc && (node(id) || edge(id) || group(id)));
}

function group(id) {
  return doc.groups.find((g) => g.id === id);
}

function moving() {
  const ids = new Set();
  for (const id of selection) {
    if (node(id)) ids.add(id);
    for (const child of group(id)?.children || []) ids.add(child);
  }
  return doc.nodes.filter((n) => ids.has(n.id));
}

function node(id) {
  return doc.nodes.find((n) => n.id === id);
}

function edge(id) {
  return doc.edges.find((e) => e.id === id);
}

function snapshot() {
  return JSON.stringify(doc);
}

function commit(before) {
  if (!doc || before === snapshot()) return;
  undoStack.push(before);
  if (undoStack.length > 200) undoStack.shift();
  redoStack = [];
  saturn.postMessage({ type: 'change', doc });
  render();
}

function change(fn) {
  if (!doc) return;
  const before = snapshot();
  fn();
  commit(before);
}

function undo() {
  if (!doc || !undoStack.length) return;
  redoStack.push(snapshot());
  doc = JSON.parse(undoStack.pop());
  afterHistory();
}

function redo() {
  if (!doc || !redoStack.length) return;
  undoStack.push(snapshot());
  doc = JSON.parse(redoStack.pop());
  afterHistory();
}

function afterHistory() {
  selection = new Set([...selection].filter(exists));
  saturn.postMessage({ type: 'change', doc });
  render();
}

function toWorld(event) {
  const box = stage.getBoundingClientRect();
  return { x: (event.clientX - box.left - view.x) / view.z, y: (event.clientY - box.top - view.y) / view.z };
}

function snap(value, free) {
  return free ? value : Math.round(value / GRID) * GRID;
}

function fillOf(n) {
  const fill = n.style?.fill;
  if (fill === 'none' || n.type === 'text') return 'none';
  return `var(${FILLS[fill] || FILLS.raised})`;
}

function textColour(n) {
  if (n.style?.fill === 'warning') return '#1f1f1f';
  return n.style?.fill === 'accent' || n.style?.fill === 'error' ? 'var(--saturn-on-accent)' : 'var(--saturn-text)';
}

function textBlock(lines, x, top, colour, size, anchor = 'start', boldFirst = false) {
  const spans = lines.map((line, i) => `<tspan x="${x}" y="${top + i * size * 1.35}"${boldFirst && i === 0 ? ' font-weight="600"' : ''}>${esc(line) || ' '}</tspan>`).join('');
  return `<text text-anchor="${anchor}" dominant-baseline="central" font-size="${size}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" fill="${colour}">${spans}</text>`;
}

function content(n) {
  if (editing?.id === n.id || !n.text) return '';
  const { x, y, w, h } = n;
  const colour = textColour(n);
  const lines = n.text.split('\n');
  if (n.type === 'table') {
    const rowRoom = Math.max(0, Math.floor((h - 28 - 4) / 16.2));
    const head = textBlock(wrap(lines[0], w - 16, 13, true, 1), x + w / 2, y + 14, colour, 13, 'middle', true);
    const rows = lines.slice(1, 1 + rowRoom).map((row) => wrap(row, w - 20, 12, false, 1)[0]);
    return head + textBlock(rows, x + 10, y + 28 + 11, colour, 12);
  }
  if (n.type === 'story') {
    const first = wrap(lines[0], w - 28, 13, true);
    const rest = wrap(lines.slice(1).join('\n'), w - 28, 13);
    const room = Math.max(1, Math.floor((h - 12) / (13 * 1.35)));
    const all = [...first, ...(lines.length > 1 ? rest : [])];
    const shown = all.length > room ? [...all.slice(0, room - 1), wrap(all.slice(room - 1).join(' '), w - 28, 13, false, 1)[0]] : all;
    return textBlock(shown, x + 18, y + 18, colour, 13, 'start', first.length > 0);
  }
  if (n.type === 'actor') return textBlock(wrap(n.text, Math.max(w, 140), 13, false, 2), x + w / 2, y + h - 8, colour, 13, 'middle');
  if (n.style?.align === 'top') return textBlock(wrap(n.text, w - 16, 13, true, 2), x + w / 2, y + 16, colour, 13, 'middle', true);
  const shift = n.type === 'cylinder' ? Math.min(12, h / 6) / 2 : 0;
  const { width, maxLines } = fitLines(n, 14);
  return label(n.text, x + w / 2, y + h / 2 + shift, colour, 14, width, maxLines);
}

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const measurer = document.createElement('canvas').getContext('2d');
const widths = new Map();

function textWidth(text, size, bold = false) {
  const key = `${size}|${bold}|${text}`;
  let width = widths.get(key);
  if (width === undefined) {
    measurer.font = `${bold ? 600 : 400} ${size}px ${FONT}`;
    width = measurer.measureText(text).width;
    if (widths.size > 5000) widths.clear();
    widths.set(key, width);
  }
  return width;
}

function wrap(text, width, size, bold = false, maxLines = Infinity) {
  const fits = (s) => textWidth(s, size, bold) <= width;
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (fits(next)) {
        line = next;
        continue;
      }
      if (line) out.push(line);
      let rest = word;
      while (rest.length > 1 && !fits(rest)) {
        let cut = 1;
        while (cut < rest.length - 1 && fits(rest.slice(0, cut + 1))) cut++;
        out.push(rest.slice(0, cut));
        rest = rest.slice(cut);
      }
      line = rest;
    }
    out.push(line);
  }
  if (out.length <= maxLines) return out;
  const kept = out.slice(0, Math.max(1, maxLines));
  let last = kept[kept.length - 1];
  while (last && !fits(`${last}…`)) last = last.slice(0, -1);
  kept[kept.length - 1] = `${last}…`;
  return kept;
}

function fitLines(n, size) {
  const { w, h } = n;
  const ry = Math.min(12, h / 6);
  const room = {
    ellipse: [w * 0.72, h * 0.72],
    diamond: [w * 0.55, h * 0.55],
    data: [w - 2 * Math.min(20, w * 0.15) - 8, h - 8],
    terminal: [w - h * 0.6, h - 6],
    document: [w - 16, h * 0.78],
    cylinder: [w - 12, h - 2 * ry - 6],
    note: [w - 22, h - 10],
    text: [w - 4, Infinity],
  }[n.type] || [w - 16, h - 8];
  return { width: Math.max(10, room[0]), maxLines: Math.max(1, Math.floor(room[1] / (size * 1.25))) };
}

function label(text, cx, cy, colour, size = 14, width = Infinity, maxLines = Infinity) {
  if (!text) return '';
  const lines = wrap(text, width, size, false, maxLines);
  const top = cy - ((lines.length - 1) * size * 1.25) / 2;
  const spans = lines.map((line, i) => `<tspan x="${cx}" y="${top + i * size * 1.25}">${esc(line) || ' '}</tspan>`).join('');
  return `<text text-anchor="middle" dominant-baseline="central" font-size="${size}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" fill="${colour}">${spans}</text>`;
}

function shape(n) {
  const fill = fillOf(n);
  const stroke = n.type === 'text' ? 'none' : `var(${n.style?.stroke ? FILLS[n.style.stroke] || '--saturn-border' : '--saturn-border'})`;
  const common = `fill="${fill}" stroke="${stroke}" stroke-width="1.5"`;
  const { x, y, w, h } = n;
  const hitBox = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent"/>`;
  if (n.type === 'text') return hitBox;
  if (n.type === 'ellipse') return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" ${common}/>`;
  if (n.type === 'diamond') return `<polygon points="${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}" ${common}/>`;
  if (n.type === 'terminal') return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" ${common}/>`;
  if (n.type === 'data') {
    const s = Math.min(20, w * 0.15);
    return `<polygon points="${x + s},${y} ${x + w},${y} ${x + w - s},${y + h} ${x},${y + h}" ${common}/>`;
  }
  if (n.type === 'document') {
    return `<path d="M${x} ${y} H${x + w} V${y + h * 0.85} C${x + w * 0.75} ${y + h * 0.65} ${x + w * 0.5} ${y + h * 1.05} ${x + w * 0.25} ${y + h * 0.9} S${x} ${y + h * 0.8} ${x} ${y + h * 0.85} Z" ${common}/>`;
  }
  if (n.type === 'cylinder') {
    const ry = Math.min(12, h / 6);
    return `<path d="M${x} ${y + ry} A${w / 2} ${ry} 0 0 0 ${x + w} ${y + ry} V${y + h - ry} A${w / 2} ${ry} 0 0 1 ${x} ${y + h - ry} Z" ${common}/>`
      + `<ellipse cx="${x + w / 2}" cy="${y + ry}" rx="${w / 2}" ry="${ry}" ${common}/>`;
  }
  if (n.type === 'note') {
    const f = Math.min(16, w / 4, h / 4);
    return `<polygon points="${x},${y} ${x + w},${y} ${x + w},${y + h - f} ${x + w - f},${y + h} ${x},${y + h}" ${common}/>`
      + `<path d="M${x + w} ${y + h - f} H${x + w - f} V${y + h}" fill="none" stroke="${stroke}" stroke-width="1.5"/>`;
  }
  if (n.type === 'table') {
    const head = Math.min(28, h);
    const rows = Math.max(0, (n.text || '').split('\n').length - 1);
    const lines = Array.from({ length: rows - 1 > 0 ? rows - 1 : 0 }, (_, i) => y + head + (i + 1) * 16.2 + 3)
      .filter((ly) => ly < y + h)
      .map((ly) => `<path d="M${x} ${ly} H${x + w}" stroke="var(--saturn-divider)" stroke-width="1"/>`).join('');
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${common}/>`
      + `<rect x="${x}" y="${y}" width="${w}" height="${head}" fill="var(--saturn-selection)" stroke="${stroke}" stroke-width="1.5"/>${lines}`;
  }
  if (n.type === 'story') {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${common}/><rect x="${x}" y="${y}" width="6" height="${h}" fill="var(--saturn-accent)"/>`;
  }
  if (n.type === 'actor') {
    const cx = x + w / 2;
    const r = Math.min(w, h) * 0.13;
    const body = y + 2 * r + 2;
    const hip = y + h * 0.55;
    const foot = y + h * 0.8;
    const ink = 'var(--saturn-text)';
    return hitBox + `<g fill="none" stroke="${ink}" stroke-width="1.5"><circle cx="${cx}" cy="${y + r + 1}" r="${r}"/>`
      + `<path d="M${cx} ${body} V${hip} M${x + w * 0.15} ${body + (hip - body) * 0.35} H${x + w * 0.85} M${cx} ${hip} L${x + w * 0.2} ${foot} M${cx} ${hip} L${x + w * 0.8} ${foot}"/></g>`;
  }
  if (n.type === 'image') {
    const data = images.get(n.src);
    if (typeof data === 'string' && data.startsWith('data:')) {
      return `<image href="${esc(data)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
    }
    requestImage(n.src);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--saturn-border)" stroke-dasharray="4 3"/>`
      + label(data === 'error' ? `Missing image\n${n.src}` : n.src, x + w / 2, y + h / 2, 'var(--saturn-muted)', 11, w - 12, Math.max(1, Math.floor((h - 8) / 14)));
  }
  const rx = n.type === 'round' ? Math.min(16, h / 2) : 0;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${common}/>`;
}

function requestImage(src) {
  if (!src || images.has(src)) return;
  images.set(src, 'loading');
  Promise.resolve(saturn.projectImage(src))
    .then((data) => images.set(src, data || 'error'))
    .catch(() => images.set(src, 'error'))
    .then(render);
}

function border(n, toward) {
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (!dx && !dy) return { x: cx, y: cy };
  const a = n.w / 2;
  const b = n.h / 2;
  let t;
  if (n.type === 'ellipse') t = 1 / Math.sqrt((dx * dx) / (a * a) + (dy * dy) / (b * b));
  else if (n.type === 'diamond') t = 1 / (Math.abs(dx) / a + Math.abs(dy) / b);
  else t = Math.min(dx ? a / Math.abs(dx) : Infinity, dy ? b / Math.abs(dy) : Infinity);
  return { x: cx + dx * t, y: cy + dy * t };
}

function centre(n) {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

function portPoint(n, side) {
  const [fx, fy, dx, dy] = SIDES[side];
  return { x: n.x + n.w * fx, y: n.y + n.h * fy, dx, dy, side };
}

function facing(n, toward) {
  const c = centre(n);
  const dx = toward.x - c.x;
  const dy = toward.y - c.y;
  if (Math.abs(dx) * n.h >= Math.abs(dy) * n.w) return dx >= 0 ? 'right' : 'left';
  return dy >= 0 ? 'bottom' : 'top';
}

function nearestPort(n, p, reach) {
  let best = null;
  for (const side of Object.keys(SIDES)) {
    const q = portPoint(n, side);
    const d = Math.hypot(q.x - p.x, q.y - p.y);
    if (d <= reach && (!best || d < best.d)) best = { side, d };
  }
  return best?.side ?? null;
}

function orthogonal(s, e) {
  const s1 = { x: s.x + s.dx * GAP, y: s.y + s.dy * GAP };
  const e1 = { x: e.x + e.dx * GAP, y: e.y + e.dy * GAP };
  const sh = s.dx !== 0;
  const eh = e.dx !== 0;
  let mid;
  if (sh && eh) {
    const x = (s1.x + e1.x) / 2;
    mid = s.dx === -e.dx && (e.x - s.x) * s.dx > 2 * GAP ? [{ x, y: s.y }, { x, y: e.y }] : [s1, { x: s1.x, y: (s1.y + e1.y) / 2 }, { x: e1.x, y: (s1.y + e1.y) / 2 }, e1];
  } else if (!sh && !eh) {
    const y = (s1.y + e1.y) / 2;
    mid = s.dy === -e.dy && (e.y - s.y) * s.dy > 2 * GAP ? [{ x: s.x, y }, { x: e.x, y }] : [s1, { x: (s1.x + e1.x) / 2, y: s1.y }, { x: (s1.x + e1.x) / 2, y: e1.y }, e1];
  } else if (sh) {
    mid = [s1, { x: e1.x, y: s1.y }, e1];
  } else {
    mid = [s1, { x: s1.x, y: e1.y }, e1];
  }
  return tidy([s, ...mid, e]);
}

function tidy(points) {
  const out = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.x - p.x) < 0.01 && Math.abs(last.y - p.y) < 0.01) continue;
    const prev = out[out.length - 2];
    if (prev && last && ((Math.abs(prev.x - last.x) < 0.01 && Math.abs(last.x - p.x) < 0.01) || (Math.abs(prev.y - last.y) < 0.01 && Math.abs(last.y - p.y) < 0.01))) out.pop();
    out.push(p);
  }
  return out;
}

function midpoint(points) {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let half = lengths.reduce((sum, l) => sum + l, 0) / 2;
  for (let i = 0; i < lengths.length; i++) {
    if (half <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] ? half / lengths[i] : 0;
      return { x: points[i].x + (points[i + 1].x - points[i].x) * t, y: points[i].y + (points[i + 1].y - points[i].y) * t };
    }
    half -= lengths[i];
  }
  return points[0];
}

function route(a, b, elbow, fromPort, toPort) {
  let points;
  if (elbow) {
    const s = portPoint(a, fromPort || facing(a, toPort ? portPoint(b, toPort) : centre(b)));
    const e = portPoint(b, toPort || facing(b, fromPort ? portPoint(a, fromPort) : centre(a)));
    points = orthogonal(s, e);
  } else {
    const aim = toPort ? portPoint(b, toPort) : centre(b);
    const s = fromPort ? portPoint(a, fromPort) : border(a, aim);
    const e = toPort ? portPoint(b, toPort) : border(b, fromPort ? s : centre(a));
    points = [s, e];
  }
  const m = midpoint(points);
  return { points, line: 'M' + points.map((p) => `${p.x} ${p.y}`).join(' L'), mx: m.x, my: m.y };
}

function edgeRoute(e, byId) {
  const get = (id) => (byId ? byId.get(id) : node(id));
  return route(get(e.from), get(e.to), e.style?.route === 'elbow', e.fromPort, e.toPort);
}

function edgeMarkup(e, selected, byId) {
  const a = byId.get(e.from);
  const b = byId.get(e.to);
  if (!a || !b || a === b) return '';
  const { line, mx, my } = edgeRoute(e, byId);
  const colour = selected ? 'var(--saturn-accent)' : 'var(--saturn-muted)';
  const on = selected ? '-on' : '';
  const ends = { one: 'one', many: 'many' };
  const head = ends[e.style?.end] ? `${ends[e.style.end]}${on}` : e.style?.arrowEnd === false ? '' : `arrow${on}`;
  const tail = ends[e.style?.start] ? `${ends[e.style.start]}${on}` : '';
  const arrow = (head ? ` marker-end="url(#${head})"` : '') + (tail ? ` marker-start="url(#${tail})"` : '');
  const dash = e.style?.dashed ? ' stroke-dasharray="6 4"' : '';
  let text = '';
  if (e.label) {
    const lines = wrap(e.label, 160, 12, false, 4);
    const w = Math.max(...lines.map((l) => textWidth(l, 12))) + 12;
    const h = lines.length * 15 + 6;
    text = `<rect x="${mx - w / 2}" y="${my - h / 2}" width="${w}" height="${h}" fill="var(--saturn-editor)"/>` + label(e.label, mx, my, 'var(--saturn-text)', 12, 160, 4);
  }
  return `<g data-kind="edge" data-id="${esc(e.id)}"><path d="${line}" stroke="transparent" stroke-width="12" fill="none"/><path d="${line}" stroke="${colour}" stroke-width="1.5" fill="none"${dash}${arrow}/>${text}</g>`;
}

function groupBox(g, byId) {
  const members = g.children.map((id) => (byId ? byId.get(id) : node(id))).filter(Boolean);
  return members.length ? bounds(members, 24) : null;
}

function groupMarkup(g, selected, byId) {
  const box = groupBox(g, byId);
  if (!box) return '';
  const colour = selected ? 'var(--saturn-accent)' : 'var(--saturn-divider)';
  return `<g data-kind="group" data-id="${esc(g.id)}"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="none" stroke="transparent" stroke-width="10" pointer-events="stroke"/>`
    + `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="none" stroke="${colour}" stroke-dasharray="6 4" pointer-events="none"/>`
    + (editing?.id === g.id ? '' : `<text x="${box.x + 8}" y="${box.y + 16}" font-size="12" font-family="system-ui, sans-serif" fill="var(--saturn-muted)">${esc(g.label || 'Group')}</text>`)
    + '</g>';
}

function markers() {
  const out = [];
  for (const [suffix, colour] of [['', '--saturn-muted'], ['-on', '--saturn-accent']]) {
    out.push(`<marker id="arrow${suffix}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(${colour})"/></marker>`);
    out.push(`<marker id="one${suffix}" viewBox="0 0 16 16" refX="16" refY="8" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M8 1 V15" fill="none" stroke="var(${colour})" stroke-width="1.5"/></marker>`);
    out.push(`<marker id="many${suffix}" viewBox="0 0 16 16" refX="16" refY="8" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M2 8 L16 1 M2 8 L16 8 M2 8 L16 15 M2 1 V15" fill="none" stroke="var(${colour})" stroke-width="1.5"/></marker>`);
  }
  return out.join('');
}

function drawing(withSelection) {
  const parts = [];
  const byId = new Map(doc.nodes.map((n) => [n.id, n]));
  for (const g of doc.groups) parts.push(groupMarkup(g, withSelection && selection.has(g.id), byId));
  for (const e of doc.edges) parts.push(edgeMarkup(e, withSelection && selection.has(e.id), byId));
  for (const n of doc.nodes) {
    parts.push(`<g data-kind="node" data-id="${esc(n.id)}">${shape(n)}${content(n)}</g>`);
  }
  return parts.join('');
}

function render() {
  if (!frame) frame = requestAnimationFrame(draw);
}

function draw() {
  frame = 0;
  renderPalette();
  renderToolbar();
  stage.className = spaceDown || drag?.kind === 'pan' ? 'pan' : tool !== 'select' ? 'draw' : '';
  const size = GRID * 2 * view.z;
  stage.style.backgroundSize = `${size}px ${size}px`;
  stage.style.backgroundPosition = `${view.x}px ${view.y}px`;
  if (!doc) {
    svg.innerHTML = '';
    return;
  }
  const extra = [];
  for (const id of selection) {
    const n = node(id);
    if (!n) continue;
    extra.push(`<rect x="${n.x - 3}" y="${n.y - 3}" width="${n.w + 6}" height="${n.h + 6}" fill="none" stroke="var(--saturn-accent)" stroke-width="${1 / view.z}" pointer-events="none"/>`);
    if (selection.size === 1) {
      const s = 8 / view.z;
      extra.push(`<rect data-handle="${esc(n.id)}" x="${n.x + n.w - s / 2}" y="${n.y + n.h - s / 2}" width="${s}" height="${s}" fill="var(--saturn-accent)"/>`);
    }
  }
  const preview = linkPreview();
  if (preview) extra.push(`<path d="${preview}" fill="none" stroke="var(--saturn-accent)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrow-on)" pointer-events="none"/>`);
  const portsOn = drag?.kind === 'link' || drag?.kind === 'relink' ? drag.over : !drag && (tool === 'select' || ITEMS.get(tool)?.arrow) ? hover : null;
  const target = portsOn && node(portsOn);
  if (target) {
    const r = 5 / view.z;
    if (drag) extra.push(`<rect x="${target.x - 3}" y="${target.y - 3}" width="${target.w + 6}" height="${target.h + 6}" fill="none" stroke="var(--saturn-accent)" stroke-width="${2 / view.z}" pointer-events="none"/>`);
    for (const side of Object.keys(SIDES)) {
      const p = portPoint(target, side);
      const on = drag?.overPort === side;
      extra.push(`<circle data-port="${esc(target.id)}:${side}" cx="${p.x}" cy="${p.y}" r="${on ? r * 1.4 : r}" fill="${on ? 'var(--saturn-accent)' : 'var(--saturn-editor)'}" stroke="var(--saturn-accent)" stroke-width="${1.5 / view.z}"/>`);
    }
  }
  const lone = selection.size === 1 && !drag ? edge([...selection][0]) : null;
  if (lone && node(lone.from) && node(lone.to)) {
    const { points } = edgeRoute(lone);
    const r = 5 / view.z;
    for (const [end, p] of [['from', points[0]], ['to', points[points.length - 1]]]) {
      extra.push(`<circle data-end="${esc(lone.id)}:${end}" cx="${p.x}" cy="${p.y}" r="${r}" fill="var(--saturn-accent)" stroke="var(--saturn-editor)" stroke-width="${1.5 / view.z}"/>`);
    }
  }
  if (placing?.at && placing.item.type) {
    const [w, h] = placing.item.size || SIZES[placing.item.type] || SIZES.rect;
    extra.push(`<rect x="${placing.at.x - w / 2}" y="${placing.at.y - h / 2}" width="${w}" height="${h}" fill="var(--saturn-selection)" fill-opacity="0.35" stroke="var(--saturn-accent)" stroke-dasharray="4 3" stroke-width="${1 / view.z}" pointer-events="none"/>`);
  }
  if (drag?.kind === 'marquee' && drag.box) {
    const b = drag.box;
    extra.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="var(--saturn-selection)" fill-opacity="0.4" stroke="var(--saturn-accent)" stroke-width="${1 / view.z}" pointer-events="none"/>`);
  }
  svg.innerHTML = `<defs>${markers()}</defs><g transform="translate(${view.x} ${view.y}) scale(${view.z})">${drawing(true)}${extra.join('')}</g>`;
  placeEditor();
}

function linkPreview() {
  if (!drag || (drag.kind !== 'link' && drag.kind !== 'relink') || !drag.to) return null;
  const elbow = drag.route === 'elbow';
  const loose = { id: '', type: 'rect', x: drag.to.x, y: drag.to.y, w: 0, h: 0 };
  const over = drag.over ? node(drag.over) : null;
  const other = over || loose;
  const otherPort = over ? drag.overPort : null;
  if (drag.kind === 'link') {
    const a = node(drag.from);
    if (!a || other === a) return null;
    return route(a, other, elbow, drag.fromPort, otherPort).line;
  }
  const e = edge(drag.id);
  const fixed = e && node(drag.end === 'to' ? e.from : e.to);
  if (!fixed || other === fixed) return null;
  return drag.end === 'to'
    ? route(fixed, other, elbow, e.fromPort, otherPort).line
    : route(other, fixed, elbow, otherPort, e.toPort).line;
}

function paletteState() {
  try {
    return JSON.parse(localStorage.getItem('diagrams.palette') || '{}');
  } catch {
    return paletteMemory;
  }
}

function setPaletteState(state) {
  paletteMemory = state;
  try {
    localStorage.setItem('diagrams.palette', JSON.stringify(state));
  } catch {}
}

let paletteMemory = {};

function icon(paths) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${paths}</svg>`;
}

function renderPalette() {
  if (!palette) return;
  const closed = paletteState();
  const parts = [`<button class="tool${tool === 'select' ? ' on' : ''}" data-tool="select" title="Select (V)"${doc ? '' : ' disabled'}>${icon(SELECT_ICON)}<span>Select</span></button>`];
  for (const section of PALETTE) {
    const open = !closed[section.name];
    parts.push(`<div class="section"><button class="heading" data-section="${esc(section.name)}" aria-expanded="${open}"><span class="chevron">${open ? '▾' : '▸'}</span>${esc(section.name)}</button>`);
    if (open) {
      parts.push('<div class="grid">');
      for (const item of section.items) {
        const title = item.key ? `${item.title} (${item.key})` : item.title;
        parts.push(`<button class="item${tool === item.id ? ' on' : ''}" data-tool="${item.id}" title="${esc(title)}" aria-label="${esc(item.title)}"${doc ? '' : ' disabled'}>${icon(item.icon)}</button>`);
      }
      parts.push('</div>');
    }
    parts.push('</div>');
  }
  const markup = parts.join('');
  if (markup !== lastPalette) palette.innerHTML = lastPalette = markup;
}

function button(action, text, title, options = {}) {
  return `<button data-action="${action}" title="${esc(title)}"${options.on ? ' class="on"' : ''}${options.disabled ? ' disabled' : ''}>${esc(text)}</button>`;
}

function renderToolbar() {
  const has = selection.size > 0;
  const nodesSelected = [...selection].some((id) => doc && node(id));
  const parts = [];
  parts.push(button('delete', 'Delete', 'Delete selection (Delete)', { disabled: !has }));
  parts.push(button('duplicate', 'Duplicate', 'Duplicate (Cmd/Ctrl+D)', { disabled: !nodesSelected }));
  parts.push(button('selectAll', 'Select All', 'Select all (Cmd/Ctrl+A)', { disabled: !doc }));
  parts.push(button('group', 'Group', 'Group the selected shapes (Cmd/Ctrl+G)', { disabled: [...selection].filter((id) => doc && node(id)).length < 2 }));
  parts.push(button('ungroup', 'Ungroup', 'Remove the selected group, keeping its shapes (Shift+Cmd/Ctrl+G)', { disabled: ![...selection].some((id) => doc && group(id)) }));
  if (nodesSelected) {
    parts.push('<span class="sep"></span>');
    for (const [name, variable] of Object.entries(FILLS)) {
      parts.push(`<button class="swatch" data-action="fill:${name}" title="Fill: ${name}" style="background: var(${variable})"></button>`);
    }
    parts.push(button('fill:none', '∅', 'No fill'));
  }
  const edges = [...selection].map((id) => doc && edge(id)).filter(Boolean);
  if (edges.length) {
    const elbow = edges.every((e) => e.style?.route === 'elbow');
    parts.push('<span class="sep"></span>');
    parts.push(button('route:straight', 'Straight', 'Straight line from shape to shape', { on: edges.every((e) => e.style?.route !== 'elbow') }));
    parts.push(button('route:elbow', 'Right angles', 'Only horizontal and vertical lines', { on: elbow }));
    parts.push(button('toggleDashed', '┄', 'Dashed line on or off', { on: edges.every((e) => e.style?.dashed) }));
    const kind = (e) => (e.style?.start || e.style?.end ? `${e.style.start || 'none'}-${e.style.end || 'none'}` : e.style?.arrowEnd === false ? 'line' : 'arrow');
    for (const [id, text, title] of [['arrow', '→', 'Arrow head'], ['line', '—', 'No ends'], ['one-one', '1–1', 'One-to-one'], ['one-many', '1–n', 'One-to-many'], ['many-many', 'n–n', 'Many-to-many']]) {
      parts.push(button(`ends:${id}`, text, title, { on: edges.every((e) => kind(e) === id) }));
    }
    if (edges.some((e) => e.style?.start || e.style?.end)) parts.push(button('flipEnds', '⇄', 'Swap the two ends'));
  }
  parts.push('<span class="sep"></span>');
  parts.push(button('undo', 'Undo', 'Undo (Cmd/Ctrl+Z)', { disabled: !undoStack.length }));
  parts.push(button('redo', 'Redo', 'Redo (Shift+Cmd/Ctrl+Z)', { disabled: !redoStack.length }));
  parts.push('<span class="sep"></span>');
  parts.push(button('zoomOut', '−', 'Zoom out (-)'));
  parts.push(`<span class="zoom">${Math.round(view.z * 100)}%</span>`);
  parts.push(button('zoomIn', '+', 'Zoom in (+)'));
  parts.push(button('zoomToFit', 'Fit', 'Zoom to fit (0)', { disabled: !doc }));
  parts.push('<span class="sep"></span>');
  parts.push(button('exportSvg', 'SVG', 'Export as SVG', { disabled: !doc }));
  parts.push(button('exportPng', 'PNG', 'Export as PNG', { disabled: !doc }));
  parts.push(button('copyPng', 'Copy Image', 'Copy the diagram as an image', { disabled: !doc }));
  const markup = parts.join('');
  if (markup !== lastToolbar) toolbar.innerHTML = lastToolbar = markup;
}

toolbar.addEventListener('click', (event) => {
  const target = event.target.closest('button[data-action]');
  if (!target || target.disabled) return;
  runAction(target.dataset.action);
  stage.focus();
});

function runAction(action) {
  const [name, arg] = action.split(':');
  if (name === 'tool') {
    tool = arg;
    render();
  } else if (name === 'delete') {
    removeSelection();
  } else if (name === 'duplicate') {
    duplicate();
  } else if (name === 'selectAll') {
    selectAll();
  } else if (name === 'fill') {
    change(() => {
      for (const id of selection) {
        const n = node(id);
        if (n) n.style = { ...(n.style || {}), fill: arg === 'raised' ? undefined : arg };
      }
    });
  } else if (name === 'group') {
    groupSelection();
  } else if (name === 'ungroup') {
    ungroupSelection();
  } else if (name === 'ends' || name === 'flipEnds') {
    change(() => {
      for (const id of selection) {
        const e = edge(id);
        if (!e) continue;
        const style = { ...(e.style || {}) };
        if (name === 'flipEnds') {
          [style.start, style.end] = [style.end, style.start];
        } else {
          const [start, end] = arg.includes('-') ? arg.split('-') : [undefined, undefined];
          style.start = start;
          style.end = end;
          style.arrowEnd = arg === 'line' ? false : undefined;
        }
        for (const key of ['start', 'end', 'arrowEnd']) if (style[key] === undefined) delete style[key];
        e.style = style;
      }
    });
  } else if (name === 'route' || name === 'toggleArrow' || name === 'toggleDashed') {
    change(() => {
      for (const id of selection) {
        const e = edge(id);
        if (!e) continue;
        const style = { ...(e.style || {}) };
        if (name === 'route') style.route = arg === 'elbow' ? 'elbow' : undefined;
        else if (name === 'toggleArrow') style.arrowEnd = style.arrowEnd === false ? undefined : false;
        else style.dashed = style.dashed ? undefined : true;
        e.style = style;
      }
    });
    if (name === 'route') arrowRoute = arg;
  } else if (name === 'undo') {
    undo();
  } else if (name === 'redo') {
    redo();
  } else if (name === 'zoomIn') {
    zoomAt(1.25);
  } else if (name === 'zoomOut') {
    zoomAt(0.8);
  } else if (name === 'zoomToFit') {
    fit(true);
  } else if (name === 'exportSvg') {
    saturn.postMessage({ type: 'export', format: 'svg', data: exportSvg() });
  } else if (name === 'exportPng') {
    toPng().then((data) => saturn.postMessage({ type: 'export', format: 'png', data })).catch(reportError);
  } else if (name === 'copyPng') {
    toPng().then((data) => saturn.clipboard.writeImage(data)).catch(reportError);
  }
}

function reportError(error) {
  saturn.postMessage({ type: 'error', message: `Diagrams: ${error.message || error}` });
}

function groupSelection() {
  const ids = doc.nodes.filter((n) => selection.has(n.id)).map((n) => n.id);
  if (ids.length < 2) return;
  const id = nextId(doc, 'g_');
  change(() => {
    for (const g of doc.groups) g.children = g.children.filter((child) => !ids.includes(child));
    doc.groups = doc.groups.filter((g) => g.children.length);
    doc.groups.push({ id, label: 'Group', children: ids });
    selection = new Set([id]);
  });
  startEdit(id);
}

function ungroupSelection() {
  const picked = doc.groups.filter((g) => selection.has(g.id));
  if (!picked.length) return;
  change(() => {
    doc.groups = doc.groups.filter((g) => !selection.has(g.id));
    selection = new Set(picked.flatMap((g) => g.children));
  });
}

function removeSelection() {
  if (!selection.size) return;
  change(() => {
    const doomed = new Set(moving().map((n) => n.id));
    for (const id of selection) doomed.add(id);
    doc.groups = doc.groups.filter((g) => !doomed.has(g.id));
    doc.nodes = doc.nodes.filter((n) => !doomed.has(n.id));
    const alive = new Set(doc.nodes.map((n) => n.id));
    doc.edges = doc.edges.filter((e) => !doomed.has(e.id) && alive.has(e.from) && alive.has(e.to));
    for (const g of doc.groups) g.children = g.children.filter((id) => alive.has(id));
    doc.groups = doc.groups.filter((g) => g.children.length);
    selection.clear();
  });
}

function selectAll() {
  if (!doc) return;
  selection = new Set(doc.nodes.map((n) => n.id));
  render();
}

function duplicate() {
  const picked = doc.nodes.filter((n) => selection.has(n.id));
  if (!picked.length) return;
  paste({ nodes: picked, edges: doc.edges.filter((e) => selection.has(e.from) && selection.has(e.to)) });
}

function paste(clip) {
  change(() => {
    const ids = new Map();
    selection = new Set();
    for (const n of clip.nodes) {
      const copy = { ...JSON.parse(JSON.stringify(n)), id: nextId(doc, 'n_'), x: n.x + 20, y: n.y + 20 };
      ids.set(n.id, copy.id);
      doc.nodes.push(copy);
      selection.add(copy.id);
    }
    for (const e of clip.edges || []) {
      if (!ids.has(e.from) || !ids.has(e.to)) continue;
      doc.edges.push({ ...JSON.parse(JSON.stringify(e)), id: nextId(doc, 'e_'), from: ids.get(e.from), to: ids.get(e.to) });
    }
  });
}

async function copySelection(cut) {
  const nodes = doc.nodes.filter((n) => selection.has(n.id));
  if (!nodes.length) return;
  const edges = doc.edges.filter((e) => selection.has(e.from) && selection.has(e.to));
  await saturn.clipboard.writeText(JSON.stringify({ saturnDiagram: 1, nodes, edges }));
  if (cut) removeSelection();
}

async function pasteClipboard() {
  const text = await saturn.clipboard.readText();
  if (!text) return;
  try {
    const clip = JSON.parse(text);
    if (clip?.saturnDiagram === 1 && Array.isArray(clip.nodes)) {
      paste(clip);
      return;
    }
  } catch {}
  const centreView = toWorld({ clientX: stage.getBoundingClientRect().left + stage.clientWidth / 2, clientY: stage.getBoundingClientRect().top + stage.clientHeight / 2 });
  addNode('text', centreView, text.slice(0, 2000));
}

function addNode(type, at, text = '', extra = {}, size = null) {
  const [w, h] = size || SIZES[type] || SIZES.rect;
  const id = nextId(doc, 'n_');
  change(() => {
    doc.nodes.push({ id, type, x: snap(at.x - w / 2), y: snap(at.y - h / 2), w, h, text, ...extra });
    selection = new Set([id]);
  });
  return id;
}

function addImage(src, at) {
  if (!doc) return;
  const spot = at || toWorld({ clientX: stage.getBoundingClientRect().left + stage.clientWidth / 2, clientY: stage.getBoundingClientRect().top + stage.clientHeight / 2 });
  addNode('image', spot, '', { src });
}

function bounds(list, pad = 0) {
  const xs = list.flatMap((n) => [n.x, n.x + n.w]);
  const ys = list.flatMap((n) => [n.y, n.y + n.h]);
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y };
}

function fit(draw) {
  if (!doc) return;
  if (!doc.nodes.length) {
    view = { x: 40, y: 40, z: 1 };
  } else {
    const box = bounds(doc.nodes, 40);
    const width = stage.clientWidth || 800;
    const height = stage.clientHeight || 600;
    const z = Math.min(width / box.w, height / box.h, 1.5);
    view = { z, x: (width - box.w * z) / 2 - box.x * z, y: (height - box.h * z) / 2 - box.y * z };
  }
  if (draw) render();
}

function zoomAt(factor, point) {
  const p = point || { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
  const z = Math.min(4, Math.max(0.1, view.z * factor));
  view = { z, x: p.x - ((p.x - view.x) * z) / view.z, y: p.y - ((p.y - view.y) * z) / view.z };
  render();
}

function reveal(id) {
  const n = doc && node(id);
  if (!n) return;
  selection = new Set([id]);
  view.x = stage.clientWidth / 2 - (n.x + n.w / 2) * view.z;
  view.y = stage.clientHeight / 2 - (n.y + n.h / 2) * view.z;
  render();
}

function hit(event) {
  const port = event.target.closest?.('[data-port]');
  if (port) {
    const [id, side] = port.dataset.port.split(':');
    return { kind: 'port', id, side };
  }
  const end = event.target.closest?.('[data-end]');
  if (end) {
    const [id, which] = end.dataset.end.split(':');
    return { kind: 'end', id, end: which };
  }
  const handle = event.target.closest?.('[data-handle]');
  if (handle) return { kind: 'handle', id: handle.dataset.handle };
  const item = event.target.closest?.('[data-kind]');
  return item ? { kind: item.dataset.kind, id: item.dataset.id } : null;
}

function nodeNear(at, margin = 0) {
  for (let i = doc.nodes.length - 1; i >= 0; i--) {
    const n = doc.nodes[i];
    if (at.x >= n.x - margin && at.x <= n.x + n.w + margin && at.y >= n.y - margin && at.y <= n.y + n.h + margin) return n.id;
  }
  return null;
}

function aim(at) {
  drag.to = at;
  drag.over = nodeNear(at, 6 / view.z);
  drag.overPort = drag.over ? nearestPort(node(drag.over), at, 18 / view.z) : null;
}

function startLink(from, fromPort, at) {
  const item = ITEMS.get(tool)?.arrow ? ITEMS.get(tool) : null;
  drag = { kind: 'link', from, fromPort, to: at, over: null, overPort: null, route: item ? item.arrow : arrowRoute, edgeStyle: item?.edgeStyle || {} };
}

function placeItem(item, at) {
  if (item.type === 'image') {
    saturn.postMessage({ type: 'pickImage', at });
    return null;
  }
  const extra = item.style ? { style: { ...item.style } } : {};
  return addNode(item.type, at, item.text || '', extra, item.size);
}

palette?.addEventListener('pointerdown', (event) => {
  const heading = event.target.closest('[data-section]');
  if (heading) {
    const state = { ...paletteState() };
    state[heading.dataset.section] = !state[heading.dataset.section];
    setPaletteState(state);
    render();
    return;
  }
  const button = event.target.closest('[data-tool]');
  if (!button || button.disabled || !doc) return;
  event.preventDefault();
  placing = { id: button.dataset.tool, item: ITEMS.get(button.dataset.tool) || {}, x: event.clientX, y: event.clientY, moved: false, at: null };
});

document.addEventListener('pointermove', (event) => {
  if (!placing) return;
  if (Math.hypot(event.clientX - placing.x, event.clientY - placing.y) > 4) placing.moved = true;
  const box = stage.getBoundingClientRect();
  const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
  placing.at = placing.moved && inside && placing.item.type ? toWorld(event) : null;
  render();
});

document.addEventListener('pointerup', () => {
  if (!placing) return;
  const { id, item, moved, at } = placing;
  placing = null;
  if (moved && at) {
    const created = placeItem(item, at);
    tool = 'select';
    if (created && item.type === 'text') startEdit(created);
  } else if (!moved || item.arrow) {
    tool = !moved && tool === id && id !== 'select' ? 'select' : id;
    if (item.arrow) arrowRoute = item.arrow;
  }
  stage.focus();
  render();
});

stage.addEventListener('pointerdown', (event) => {
  if (!doc) return;
  if (editing) finishEdit(true);
  stage.focus();
  const at = toWorld(event);
  const target = hit(event);
  const now = performance.now();
  const twice = event.button === 0 && lastDown && now - lastDown.time < 450 && Math.hypot(event.clientX - lastDown.x, event.clientY - lastDown.y) < 6 && lastDown.id === target?.id;
  lastDown = twice ? null : { time: now, x: event.clientX, y: event.clientY, id: target?.id };
  if (twice && !spaceDown) {
    drag = null;
    tool = 'select';
    if (target?.kind === 'node' || target?.kind === 'edge' || target?.kind === 'group') startEdit(target.id);
    else if (!target) startEdit(addNode('text', at));
    event.preventDefault();
    return;
  }
  if (event.button === 1 || spaceDown) {
    drag = { kind: 'pan', start: { x: event.clientX, y: event.clientY }, view: { ...view } };
  } else if (event.button !== 0) {
    return;
  } else if (target?.kind === 'port') {
    startLink(target.id, target.side, at);
  } else if (target?.kind === 'end') {
    const e = edge(target.id);
    drag = { kind: 'relink', id: e.id, end: target.end, to: at, over: null, overPort: null, route: e.style?.route === 'elbow' ? 'elbow' : 'straight' };
  } else if (target?.kind === 'handle') {
    const n = node(target.id);
    drag = { kind: 'resize', id: n.id, before: snapshot(), start: at, size: { w: n.w, h: n.h } };
  } else if (ITEMS.get(tool)?.arrow) {
    const from = target?.kind === 'node' ? target.id : nodeNear(at, 6 / view.z);
    if (from) startLink(from, nearestPort(node(from), at, 18 / view.z), at);
  } else if (ITEMS.get(tool)?.type) {
    const item = ITEMS.get(tool);
    tool = 'select';
    const id = placeItem(item, at);
    if (id && item.type === 'text') startEdit(id);
  } else if (target) {
    const narrow = !event.shiftKey && selection.has(target.id) && selection.size > 1 ? target.id : null;
    if (event.shiftKey) {
      if (selection.has(target.id)) selection.delete(target.id);
      else selection.add(target.id);
    } else if (!selection.has(target.id)) {
      selection = new Set([target.id]);
    }
    if ((target.kind === 'node' || target.kind === 'group') && selection.has(target.id)) {
      drag = { kind: 'move', before: snapshot(), start: at, narrow, origin: new Map(moving().map((n) => [n.id, { x: n.x, y: n.y }])) };
    } else if (narrow) {
      selection = new Set([narrow]);
    }
  } else {
    if (!event.shiftKey) selection = new Set();
    drag = { kind: 'marquee', start: at, keep: new Set(selection) };
  }
  if (drag) stage.setPointerCapture(event.pointerId);
  render();
});

stage.addEventListener('pointermove', (event) => {
  if (!doc) return;
  const at = toWorld(event);
  if (!drag) {
    const near = placing ? null : nodeNear(at, 10 / view.z);
    if (near !== hover) {
      hover = near;
      render();
    }
    return;
  }
  if (drag.kind === 'link' || drag.kind === 'relink') {
    aim(at);
    render();
    return;
  }
  if (drag.kind === 'pan') {
    view.x = drag.view.x + event.clientX - drag.start.x;
    view.y = drag.view.y + event.clientY - drag.start.y;
  } else if (drag.kind === 'move') {
    const dx = at.x - drag.start.x;
    const dy = at.y - drag.start.y;
    for (const [id, origin] of drag.origin) {
      const n = node(id);
      n.x = snap(origin.x + dx, event.altKey);
      n.y = snap(origin.y + dy, event.altKey);
    }
  } else if (drag.kind === 'resize') {
    const n = node(drag.id);
    n.w = Math.max(20, snap(drag.size.w + at.x - drag.start.x, event.altKey));
    n.h = Math.max(20, snap(drag.size.h + at.y - drag.start.y, event.altKey));
  } else if (drag.kind === 'marquee') {
    const box = { x: Math.min(at.x, drag.start.x), y: Math.min(at.y, drag.start.y), w: Math.abs(at.x - drag.start.x), h: Math.abs(at.y - drag.start.y) };
    drag.box = box;
    selection = new Set(drag.keep);
    for (const n of doc.nodes) {
      if (n.x >= box.x && n.y >= box.y && n.x + n.w <= box.x + box.w && n.y + n.h <= box.y + box.h) selection.add(n.id);
    }
  }
  render();
});

stage.addEventListener('pointerup', (event) => {
  if (!drag) return;
  const finished = drag;
  drag = null;
  if (finished.kind === 'move' && finished.narrow && finished.before === snapshot()) {
    selection = new Set([finished.narrow]);
  } else if (finished.kind === 'move' || finished.kind === 'resize') {
    commit(finished.before);
  } else if (finished.kind === 'link') {
    const { from, fromPort, over, overPort, edgeStyle } = finished;
    if (over && over !== from) {
      change(() => {
        const id = nextId(doc, 'e_');
        const style = {};
        if (finished.route === 'elbow') style.route = 'elbow';
        if (edgeStyle.dashed) style.dashed = true;
        if (edgeStyle.arrowEnd === false) style.arrowEnd = false;
        if (edgeStyle.start) style.start = edgeStyle.start;
        if (edgeStyle.end) style.end = edgeStyle.end;
        doc.edges.push({ id, from, fromPort: fromPort || undefined, to: over, toPort: overPort || undefined, style });
        selection = new Set([id]);
      });
    }
  } else if (finished.kind === 'relink') {
    const e = edge(finished.id);
    const fixed = e && (finished.end === 'to' ? e.from : e.to);
    if (e && finished.over && finished.over !== fixed) {
      change(() => {
        e[finished.end] = finished.over;
        e[`${finished.end}Port`] = finished.overPort || undefined;
      });
    }
  }
  drag = null;
  render();
});

stage.addEventListener('pointerleave', () => {
  if (drag || !hover) return;
  hover = null;
  render();
});

stage.addEventListener('pointercancel', () => {
  if (drag?.before) {
    doc = JSON.parse(drag.before);
  }
  drag = null;
  render();
});

stage.addEventListener('wheel', (event) => {
  event.preventDefault();
  if (event.ctrlKey || event.metaKey) {
    const box = stage.getBoundingClientRect();
    zoomAt(Math.exp(-event.deltaY * 0.01), { x: event.clientX - box.left, y: event.clientY - box.top });
  } else {
    view.x -= event.deltaX;
    view.y -= event.deltaY;
    render();
  }
}, { passive: false });

function startEdit(id) {
  const item = node(id) || edge(id) || group(id);
  if (!item) return;
  finishEdit(true);
  const textarea = document.createElement('textarea');
  textarea.id = 'editor';
  textarea.value = (node(id) ? item.text : item.label) || '';
  editing = { id, textarea, before: snapshot() };
  stage.appendChild(textarea);
  textarea.addEventListener('keydown', (event) => {
    event.stopPropagation();
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      finishEdit(true);
      stage.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      finishEdit(false);
      stage.focus();
    }
  });
  textarea.addEventListener('blur', () => finishEdit(true));
  render();
  textarea.focus();
  textarea.select();
}

function placeEditor() {
  if (!editing) return;
  const n = node(editing.id);
  const e = edge(editing.id);
  const g = group(editing.id);
  let box;
  if (n) {
    box = { x: n.x, y: n.y, w: Math.max(n.w, 80), h: Math.max(n.h, 30) };
  } else if (e && node(e.from) && node(e.to)) {
    const { mx, my } = edgeRoute(e);
    box = { x: mx - 60, y: my - 16, w: 120, h: 32 };
  } else if (g && groupBox(g)) {
    const gb = groupBox(g);
    box = { x: gb.x, y: gb.y, w: 160, h: 26 };
  } else {
    return;
  }
  const style = editing.textarea.style;
  style.left = `${view.x + box.x * view.z}px`;
  style.top = `${view.y + box.y * view.z}px`;
  style.width = `${box.w * view.z}px`;
  style.height = `${box.h * view.z}px`;
  style.fontSize = `${(n ? 14 : 12) * view.z}px`;
}

function finishEdit(keep) {
  if (!editing) return;
  const { id, textarea, before } = editing;
  editing = null;
  textarea.remove();
  if (keep) {
    const value = textarea.value.replace(/\s+$/, '');
    const n = node(id);
    const e = edge(id);
    if (n) n.text = value;
    if (e) e.label = value || undefined;
    const g = group(id);
    if (g) g.label = value || 'Group';
    if (n && n.type === 'text' && !value) {
      doc.nodes = doc.nodes.filter((item) => item.id !== id);
      selection.delete(id);
    }
    commit(before);
  } else {
    doc = JSON.parse(before);
    const n = node(id);
    if (n && n.type === 'text' && !n.text) {
      doc.nodes = doc.nodes.filter((item) => item.id !== id);
      commit(before);
    }
    selection = new Set([...selection].filter(exists));
  }
  render();
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ' && !event.repeat && !isTyping(event)) {
    spaceDown = true;
    event.preventDefault();
    render();
    return;
  }
  if (!doc || isTyping(event)) return;
  const mod = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();
  const handled = () => event.preventDefault();
  if (event.key === 'Delete' || event.key === 'Backspace') {
    handled();
    removeSelection();
  } else if (event.key.startsWith('Arrow') && selection.size) {
    handled();
    const step = event.shiftKey ? GRID : 1;
    const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
    const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
    change(() => {
      for (const n of moving()) {
        n.x += dx;
        n.y += dy;
      }
    });
  } else if (mod && key === 'g') {
    handled();
    if (event.shiftKey) ungroupSelection();
    else groupSelection();
  } else if (mod && key === 'a') {
    handled();
    selectAll();
  } else if (mod && key === 'd') {
    handled();
    duplicate();
  } else if (mod && (key === 'c' || key === 'x')) {
    handled();
    copySelection(key === 'x').catch(reportError);
  } else if (mod && key === 'v') {
    handled();
    pasteClipboard().catch(reportError);
  } else if (mod) {
    return;
  } else if (event.key === 'Escape') {
    tool = 'select';
    selection = new Set();
    render();
  } else if (event.key === 'Enter' && selection.size === 1) {
    handled();
    startEdit([...selection][0]);
  } else if (event.key === '+' || event.key === '=') {
    zoomAt(1.25);
  } else if (event.key === '-') {
    zoomAt(0.8);
  } else if (event.key === '0') {
    fit(true);
  } else if (key === 'v') {
    tool = 'select';
    render();
  } else {
    const match = [...ITEMS.values()].find((item) => item.key?.toLowerCase() === key);
    if (match) {
      tool = match.id;
      if (match.arrow) arrowRoute = match.arrow;
      render();
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === ' ') {
    spaceDown = false;
    render();
  }
});

window.addEventListener('blur', () => {
  spaceDown = false;
});

window.addEventListener('resize', render);

function isTyping(event) {
  const target = event.target;
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
}

function exportSvg() {
  const box = doc.nodes.length ? bounds(doc.nodes, 30) : { x: 0, y: 0, w: 200, h: 100 };
  const styles = getComputedStyle(document.documentElement);
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(box.w)}" height="${Math.ceil(box.h)}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">`
    + `<defs>${markers()}</defs><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="var(--saturn-editor)"/>${drawing(false)}</svg>`;
  return markup.replace(/var\((--saturn-[a-z-]+)\)/g, (_, name) => styles.getPropertyValue(name).trim() || '#888');
}

function toPng() {
  const text = exportSvg();
  const width = Number(text.match(/width="(\d+)"/)[1]);
  const height = Number(text.match(/height="(\d+)"/)[1]);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => reject(new Error('Could not draw the diagram as an image.'));
    image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
  });
}
