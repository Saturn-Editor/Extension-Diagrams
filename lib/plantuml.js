import { emptyDiagram } from './format.js';
import { layout, sizeFor, slug } from './layout.js';

const KINDS = {
  actor: 'ellipse',
  usecase: 'ellipse',
  boundary: 'ellipse',
  control: 'ellipse',
  database: 'round',
  cloud: 'round',
  node: 'round',
  queue: 'round',
  storage: 'round',
  component: 'rect',
  rectangle: 'rect',
  class: 'rect',
  interface: 'rect',
  entity: 'rect',
  enum: 'rect',
  abstract: 'rect',
  participant: 'rect',
  card: 'rect',
  agent: 'rect',
  file: 'rect',
  artifact: 'rect',
  frame: 'rect',
  folder: 'rect',
  package: 'rect',
  collections: 'rect',
};
const CONTAINERS = ['package', 'rectangle', 'frame', 'folder', 'node', 'cloud', 'database', 'namespace', 'together'];
const END = String.raw`("[^"]+"|\[[^\]]+\]|\([^)]+\)|:[^:]+:|[A-Za-z0-9_.]+)`;
const ARROW = String.raw`([<o*|}#+]*[-.=]+(?:\[[^\]]*\])?(?:left|right|up|down|le|ri|do)?[-.=]*[>o*|{#+]*)`;
const LINK = new RegExp(String.raw`^${END}\s*(?:"[^"]*"\s*)?${ARROW}\s*(?:"[^"]*"\s*)?${END}(?:\s*:\s*(.*))?$`);
const BARE = new RegExp(String.raw`^${END}(?:\s+as\s+("[^"]+"|\S+))?$`);
const DECLARE =new RegExp(String.raw`^(${Object.keys(KINDS).concat('namespace', 'together').join('|')})\s+(.*?)\s*(\{)?\s*$`);

export function plantumlToDiagram(source) {
  const all = source.split(/\r?\n/);
  const start = all.findIndex((line) => /^\s*@start\w+/.test(line));
  const stop = all.findIndex((line, i) => i > start && /^\s*@end\w+/.test(line));
  const lines = all.slice(start + 1, stop === -1 ? undefined : stop).map((line) => line.trim()).filter((line) => line && !line.startsWith("'"));
  if (start !== -1 && /^\s*@start(mindmap|gantt|json|yaml|salt|wbs)/.test(all[start])) {
    throw new Error('Only PlantUML component, use case, class, deployment and sequence diagrams can be imported so far.');
  }
  const nodes = new Map();
  const aliases = new Map();
  const edges = [];
  const groups = [];
  const stack = [];
  let direction = 'TD';
  let skipping = 0;

  const add = (raw, alias, kind) => {
    const { label, type } = endpoint(raw, kind);
    const key = alias || raw;
    if (aliases.has(key)) {
      const existing = nodes.get(aliases.get(key));
      if (kind) Object.assign(existing, { type, text: label, ...sizeFor(label, type) });
      return existing.id;
    }
    let id = `n_${slug(alias || label)}`;
    for (let i = 2; nodes.has(id); i++) id = `n_${slug(alias || label)}_${i}`;
    nodes.set(id, { id, type, x: 0, y: 0, ...sizeFor(label, type), text: label });
    aliases.set(key, id);
    if (alias) aliases.set(raw, id);
    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(id);
    return id;
  };

  for (const line of lines) {
    if (skipping) {
      skipping += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      continue;
    }
    if (/^left to right direction$/i.test(line)) {
      direction = 'LR';
      continue;
    }
    if (/^top to bottom direction$/i.test(line)) {
      direction = 'TD';
      continue;
    }
    if (/^(skinparam|title|caption|header|footer|legend|hide|show|scale|!|note|end note|autonumber|activate|deactivate|return|alt|else|opt|loop|par|group|end\b|==|\.\.\.|\|\|\|)/i.test(line)) {
      if (/^skinparam\b.*\{$/.test(line)) skipping = 1;
      continue;
    }
    if (line === '}') {
      stack.pop();
      continue;
    }
    const link = line.match(LINK);
    if (link) {
      const [, left, arrow, right, label] = link;
      const back = arrow.startsWith('<') && !arrow.endsWith('>');
      const from = add(back ? right : left);
      const to = add(back ? left : right);
      const style = {};
      if (arrow.includes('.')) style.dashed = true;
      if (!/[<>]/.test(arrow)) style.arrowEnd = false;
      edges.push({ from, to, label: label?.trim() || undefined, style });
      continue;
    }
    const bare = line.match(BARE);
    if (bare && !/^[A-Za-z0-9_.]+$/.test(line)) {
      add(...naming(bare[1], bare[2]), null);
      continue;
    }
    const declare = line.match(DECLARE);
    if (declare) {
      const [, kind, rest, open] = declare;
      const named = rest.replace(/\s*<<[^>]*>>/g, '').replace(/\s*#\S+$/, '').match(/^(.*?)(?:\s+as\s+(\S+))?$/);
      const [name, alias] = naming(named[1] || named[2] || kind, named[2]);
      if (open && CONTAINERS.includes(kind)) {
        const label = clean(name);
        let id = `g_${slug(alias || label)}`;
        for (let i = 2; groups.some((g) => g.id === id); i++) id = `g_${slug(alias || label)}_${i}`;
        const g = { id, label, children: [] };
        groups.push(g);
        stack.push(g);
      } else {
        add(name, alias, kind);
        if (open) skipping = 1;
      }
    }
  }

  const doc = emptyDiagram();
  layout(nodes, edges, direction);
  doc.nodes = [...nodes.values()];
  doc.edges = edges.map((e, i) => ({ id: `e_${i + 1}`, ...e }));
  doc.groups = groups.filter((g) => g.children.length);
  return doc;
}

function naming(name, alias) {
  if (alias && /^".*"$/.test(alias)) return [alias, name];
  return [name, alias];
}

function endpoint(raw, kind) {
  let type = KINDS[kind] || 'rect';
  if (/^\(.*\)$/.test(raw) || /^:.*:$/.test(raw)) type = 'ellipse';
  return { label: clean(raw), type };
}

function clean(raw) {
  return String(raw).trim().replace(/^"(.*)"$/, '$1').replace(/^\[(.*)\]$/, '$1').replace(/^\((.*)\)$/, '$1').replace(/^:(.*):$/, '$1').replace(/\\n/g, '\n');
}
