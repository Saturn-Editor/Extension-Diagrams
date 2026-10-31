import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyDiagram, nextId, parseDiagram, serializeDiagram } from '../lib/format.js';

test('an empty file becomes an empty diagram', () => {
  assert.deepEqual(parseDiagram(''), emptyDiagram());
  assert.deepEqual(parseDiagram('  \n'), emptyDiagram());
});

test('saving puts one item per line, sorted by id', () => {
  const doc = emptyDiagram();
  doc.nodes.push({ id: 'n_10', type: 'rect', x: 0, y: 0, w: 100, h: 50, text: 'Ten' });
  doc.nodes.push({ id: 'n_2', type: 'rect', x: 0, y: 0, w: 100, h: 50, text: 'Two' });
  const lines = serializeDiagram(doc).split('\n');
  const two = lines.findIndex((line) => line.includes('"n_2"'));
  const ten = lines.findIndex((line) => line.includes('"n_10"'));
  assert.ok(two > 0 && ten > two);
  assert.ok(lines[two].trim().startsWith('{"id":"n_2"'));
});

test('positions and sizes are rounded and empty fields are left out', () => {
  const doc = emptyDiagram();
  doc.nodes.push({ id: 'n_1', type: 'rect', x: 10.6, y: 4.2, w: 99.5, h: 50.1, text: '', style: {} });
  const text = serializeDiagram(doc);
  assert.match(text, /"x":11,"y":4,"w":100,"h":50/);
  assert.doesNotMatch(text, /"text"/);
  assert.doesNotMatch(text, /"style"/);
});

test('keys are written in a fixed order', () => {
  const doc = emptyDiagram();
  doc.nodes.push({ text: 'A', h: 50, w: 100, y: 0, x: 0, type: 'rect', id: 'n_1' });
  assert.match(serializeDiagram(doc), /\{"id":"n_1","type":"rect","x":0,"y":0,"w":100,"h":50,"text":"A"\}/);
});

test('saving, reading and saving again gives the same text', () => {
  const doc = emptyDiagram();
  doc.nodes.push({ id: 'n_1', type: 'ellipse', x: 0, y: 0, w: 100, h: 50, text: 'Line one\nLine "two"', style: { fill: 'accent' } });
  doc.nodes.push({ id: 'n_2', type: 'image', x: 200, y: 0, w: 100, h: 50, src: 'assets/logo.png' });
  doc.edges.push({ id: 'e_1', from: 'n_1', to: 'n_2', label: 'uses', style: { route: 'elbow', dashed: true } });
  doc.groups.push({ id: 'g_1', label: 'Both', children: ['n_2', 'n_1'] });
  const first = serializeDiagram(doc);
  assert.equal(serializeDiagram(parseDiagram(first)), first);
});

test('broken items are dropped when reading', () => {
  const doc = parseDiagram(JSON.stringify({
    version: 1,
    nodes: [
      { id: 'n_1', type: 'blob', x: 'left', w: 1 },
      { id: 'n_1', type: 'rect' },
      { type: 'rect' },
    ],
    edges: [
      { id: 'e_1', from: 'n_1', to: 'n_9' },
      { id: 'e_2', from: 'n_1', to: 'n_1' },
    ],
    groups: [{ id: 'g_1', children: ['n_1', 'n_9'] }],
  }));
  assert.equal(doc.nodes.length, 1);
  assert.equal(doc.nodes[0].type, 'rect');
  assert.equal(doc.nodes[0].x, 0);
  assert.equal(doc.nodes[0].w, 10);
  assert.deepEqual(doc.edges.map((e) => e.id), ['e_2']);
  assert.deepEqual(doc.groups[0].children, ['n_1']);
});

test('arrow ends keep their side, and unknown sides are dropped', () => {
  const doc = parseDiagram(JSON.stringify({
    version: 1,
    nodes: [{ id: 'n_1', type: 'table' }, { id: 'n_2', type: 'actor' }],
    edges: [
      { id: 'e_1', from: 'n_1', fromPort: 'right', to: 'n_2', toPort: 'left', style: { route: 'elbow' } },
      { id: 'e_2', from: 'n_1', fromPort: 'middle', to: 'n_2' },
    ],
  }));
  assert.deepEqual(doc.nodes.map((n) => n.type), ['table', 'actor']);
  assert.equal(doc.edges[0].fromPort, 'right');
  assert.equal(doc.edges[0].toPort, 'left');
  assert.equal(doc.edges[1].fromPort, undefined);
  assert.match(serializeDiagram(doc), /\{"id":"e_1","from":"n_1","fromPort":"right","to":"n_2","toPort":"left","style":\{"route":"elbow"\}\}/);
});

test('newer versions and non-objects are refused', () => {
  assert.throws(() => parseDiagram('{"version": 2}'), /newer/);
  assert.throws(() => parseDiagram('[]'), /JSON object/);
  assert.throws(() => parseDiagram('{oops'));
});

test('nextId skips ids already used by any item', () => {
  const doc = emptyDiagram();
  doc.nodes.push({ id: 'n_1' }, { id: 'n_2' });
  doc.edges.push({ id: 'e_1' });
  assert.equal(nextId(doc, 'n_'), 'n_3');
  assert.equal(nextId(doc, 'e_'), 'e_2');
  assert.equal(nextId(doc, 'g_'), 'g_1');
});
