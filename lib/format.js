export const NODE_TYPES = ['rect', 'round', 'ellipse', 'diamond', 'text', 'image', 'note', 'terminal', 'data', 'document', 'cylinder', 'table', 'actor', 'story'];
export const PORTS = ['top', 'right', 'bottom', 'left'];

const NODE_KEYS = ['id', 'type', 'x', 'y', 'w', 'h', 'text', 'src', 'style'];
const EDGE_KEYS = ['id', 'from', 'fromPort', 'to', 'toPort', 'label', 'style'];
const GROUP_KEYS = ['id', 'label', 'children'];

export function emptyDiagram() {
  return { version: 1, canvas: { grid: 10 }, nodes: [], edges: [], groups: [] };
}

export function parseDiagram(text) {
  const doc = emptyDiagram();
  if (!text || !text.trim()) return doc;
  const raw = JSON.parse(text);
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) throw new Error('A diagram file must hold a JSON object.');
  if (raw.version && raw.version > 1) throw new Error(`This diagram uses version ${raw.version}, which is newer than this extension supports.`);
  if (raw.canvas && typeof raw.canvas === 'object') doc.canvas = { ...doc.canvas, ...raw.canvas };
  const ids = new Set();
  for (const n of Array.isArray(raw.nodes) ? raw.nodes : []) {
    if (!n || typeof n.id !== 'string' || ids.has(n.id)) continue;
    ids.add(n.id);
    doc.nodes.push({
      ...n,
      type: NODE_TYPES.includes(n.type) ? n.type : 'rect',
      x: num(n.x, 0),
      y: num(n.y, 0),
      w: Math.max(10, num(n.w, 120)),
      h: Math.max(10, num(n.h, 60)),
      text: typeof n.text === 'string' ? n.text : '',
    });
  }
  for (const e of Array.isArray(raw.edges) ? raw.edges : []) {
    if (!e || typeof e.id !== 'string' || ids.has(e.id) || !ids.has(e.from) || !ids.has(e.to)) continue;
    ids.add(e.id);
    const kept = { ...e };
    if (!PORTS.includes(kept.fromPort)) delete kept.fromPort;
    if (!PORTS.includes(kept.toPort)) delete kept.toPort;
    doc.edges.push(kept);
  }
  for (const g of Array.isArray(raw.groups) ? raw.groups : []) {
    if (!g || typeof g.id !== 'string' || ids.has(g.id)) continue;
    ids.add(g.id);
    doc.groups.push({ ...g, children: (Array.isArray(g.children) ? g.children : []).filter((c) => ids.has(c)) });
  }
  return doc;
}

export function serializeDiagram(doc) {
  const lines = ['{', '  "version": 1,', `  "canvas": ${JSON.stringify(ordered(doc.canvas, ['grid', 'background']))},`];
  const lists = [
    ['nodes', doc.nodes, NODE_KEYS, (n) => ({ ...n, x: Math.round(n.x), y: Math.round(n.y), w: Math.round(n.w), h: Math.round(n.h) })],
    ['edges', doc.edges, EDGE_KEYS, (e) => e],
    ['groups', doc.groups, GROUP_KEYS, (g) => ({ ...g, children: [...g.children].sort(byId) })],
  ];
  lists.forEach(([name, items, keys, tidy], i) => {
    const comma = i < lists.length - 1 ? ',' : '';
    const sorted = [...items].sort((a, b) => byId(a.id, b.id));
    if (!sorted.length) {
      lines.push(`  "${name}": []${comma}`);
      return;
    }
    lines.push(`  "${name}": [`);
    sorted.forEach((item, j) => lines.push(`    ${JSON.stringify(ordered(clean(tidy(item)), keys))}${j < sorted.length - 1 ? ',' : ''}`));
    lines.push(`  ]${comma}`);
  });
  lines.push('}');
  return lines.join('\n') + '\n';
}

export function nextId(doc, prefix) {
  const used = new Set([...doc.nodes, ...doc.edges, ...doc.groups].map((item) => item.id));
  let i = 1;
  while (used.has(`${prefix}${i}`)) i++;
  return `${prefix}${i}`;
}

function byId(a, b) {
  return String(a).localeCompare(String(b), 'en', { numeric: true });
}

function num(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clean(item) {
  const out = {};
  for (const [key, value] of Object.entries(item)) {
    if (value === undefined || value === '' || value === null) continue;
    if (key === 'style' && typeof value === 'object' && !Object.keys(value).length) continue;
    out[key] = value;
  }
  return out;
}

function ordered(item, keys) {
  const out = {};
  for (const key of keys) if (key in item) out[key] = item[key];
  for (const key of Object.keys(item).sort()) if (!(key in out)) out[key] = item[key];
  return out;
}
