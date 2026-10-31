import { emptyDiagram } from './format.js';
import { layout, sizeFor, slug } from './layout.js';

const SHAPES = [
  [/^\(\((.*)\)\)$/, 'ellipse'],
  [/^\(\[(.*)\]\)$/, 'round'],
  [/^\((.*)\)$/, 'round'],
  [/^\{(.*)\}$/, 'diamond'],
  [/^\[(.*)\]$/, 'rect'],
  [/^>(.*)\]$/, 'rect'],
];

const NODE = /^([A-Za-z0-9_]+(?:-[A-Za-z0-9_]+)*)\s*((?:\(\(.*?\)\))|(?:\(\[.*?\]\))|(?:\(.*?\))|(?:\{.*?\})|(?:\[.*?\])|(?:>.*?\]))?/;
const ARROW = /^\s*(?:(-\.->|-\.-|==>|===|-->|---|--[ox])\s*(?:\|([^|]*)\|)?|--\s+(.+?)\s+-->|-\.\s+(.+?)\s+\.->|==\s+(.+?)\s+==>)\s*/;

export function mermaidToDiagram(source) {
  const lines = source.split(/\r?\n/).map((line) => line.replace(/%%.*$/, '').trim()).filter(Boolean);
  const header = lines.shift() || '';
  const match = header.match(/^(?:graph|flowchart)\s*(TB|TD|BT|RL|LR)?/i);
  if (!match) throw new Error('Only Mermaid flowcharts (graph or flowchart) can be imported so far.');
  const direction = (match[1] || 'TD').toUpperCase();
  const nodes = new Map();
  const edges = [];
  const groups = [];
  let group = null;

  for (const raw of lines.flatMap((line) => line.split(';')).map((line) => line.trim()).filter(Boolean)) {
    const sub = raw.match(/^subgraph\s+(.+)$/);
    if (sub) {
      const named = sub[1].match(/^(\S+)\s*\[(.*)\]$/);
      group = { id: `g_${slug(named ? named[1] : sub[1])}`, label: (named ? named[2] : sub[1]).replace(/^"|"$/g, ''), children: [] };
      groups.push(group);
      continue;
    }
    if (raw === 'end') {
      group = null;
      continue;
    }
    if (/^(style|classDef|class|click|linkStyle|direction)\b/.test(raw)) continue;
    let rest = raw;
    let prev = [];
    let link = null;
    while (rest) {
      const current = [];
      while (rest) {
        const node = rest.match(NODE);
        if (!node) break;
        const id = addNode(nodes, node[1], node[2]);
        if (group && !group.children.includes(id)) group.children.push(id);
        current.push(id);
        rest = rest.slice(node[0].length);
        const and = rest.match(/^\s*&\s*/);
        if (!and) break;
        rest = rest.slice(and[0].length);
      }
      if (!current.length) break;
      for (const from of prev) for (const to of current) edges.push({ from, to, ...link });
      const arrow = rest.match(ARROW);
      if (!arrow) break;
      const kind = arrow[1] || (arrow[4] ? '-.->' : '-->');
      link = {
        label: (arrow[2] || arrow[3] || arrow[4] || arrow[5] || '').trim() || null,
        dashed: kind.startsWith('-.'),
        noArrow: kind === '---' || kind === '-.-' || kind === '===',
      };
      prev = current;
      rest = rest.slice(arrow[0].length);
    }
  }

  const doc = emptyDiagram();
  layout(nodes, edges, direction);
  doc.nodes = [...nodes.values()];
  doc.edges = edges.map((e, i) => {
    const style = {};
    if (e.dashed) style.dashed = true;
    if (e.noArrow) style.arrowEnd = false;
    return { id: `e_${i + 1}`, from: e.from, to: e.to, label: e.label || undefined, style };
  });
  doc.groups = groups.filter((g) => g.children.length);
  return doc;
}

function addNode(nodes, name, shape) {
  const id = `n_${slug(name)}`;
  const existing = nodes.get(id);
  if (existing && !shape) return id;
  let type = 'rect';
  let text = name;
  if (shape) {
    for (const [pattern, kind] of SHAPES) {
      const m = shape.match(pattern);
      if (m) {
        type = kind;
        text = m[1].replace(/^"|"$/g, '').replace(/<br\s*\/?>/gi, '\n');
        break;
      }
    }
  }
  nodes.set(id, { ...(existing || {}), id, type, x: 0, y: 0, ...sizeFor(text, type), text });
  return id;
}
