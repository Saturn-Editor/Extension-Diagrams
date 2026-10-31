import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mermaidToDiagram } from '../lib/mermaid.js';
import { plantumlToDiagram } from '../lib/plantuml.js';
import { convert } from '../lib/import.js';
import { layout } from '../lib/layout.js';

const byText = (doc) => Object.fromEntries(doc.nodes.map((n) => [n.text, n]));
const link = (doc, from, to) => {
  const nodes = byText(doc);
  return doc.edges.find((e) => e.from === nodes[from].id && e.to === nodes[to].id);
};

test('Mermaid shapes, labels and links', () => {
  const doc = mermaidToDiagram('graph LR\nA[Start] --> B{Ok?}\nB -->|yes| C(Done)\nB -- no --> A\nC --- D((End))\nD -.-> A');
  const nodes = byText(doc);
  assert.equal(nodes.Start.type, 'rect');
  assert.equal(nodes['Ok?'].type, 'diamond');
  assert.equal(nodes.Done.type, 'round');
  assert.equal(nodes.End.type, 'ellipse');
  assert.equal(link(doc, 'Ok?', 'Done').label, 'yes');
  assert.equal(link(doc, 'Ok?', 'Start').label, 'no');
  assert.equal(link(doc, 'Done', 'End').style.arrowEnd, false);
  assert.equal(link(doc, 'End', 'Start').style.dashed, true);
});

test('Mermaid & links every node on each side', () => {
  const doc = mermaidToDiagram('flowchart TD\nA & B --> C & D');
  assert.equal(doc.edges.length, 4);
  assert.ok(link(doc, 'B', 'D'));
});

test('Mermaid names with dashes and links without spaces', () => {
  const doc = mermaidToDiagram('graph TD\nweb-app-->api\napi==>db');
  assert.deepEqual(doc.nodes.map((n) => n.id).sort(), ['n_api', 'n_db', 'n_web_app']);
  assert.equal(doc.edges.length, 2);
});

test('Mermaid subgraphs become groups', () => {
  const doc = mermaidToDiagram('graph TD\nsubgraph back [Backend]\napi --> db\nend\nweb --> api');
  assert.deepEqual(doc.groups, [{ id: 'g_back', label: 'Backend', children: ['n_api', 'n_db'] }]);
});

test('Mermaid diagrams other than flowcharts are refused', () => {
  assert.throws(() => mermaidToDiagram('sequenceDiagram\nA->>B: hi'), /flowcharts/);
});

test('PlantUML declarations, aliases, packages and arrows', () => {
  const doc = plantumlToDiagram(`@startuml
left to right direction
actor User
package "Backend" {
  [API] as api
  database "Main DB" as db
  cache as "Redis Cache"
}
User --> api : HTTPS
api ..> db : SQL
db <-- [Worker]
(Login) - User
@enduml`);
  const nodes = byText(doc);
  assert.equal(nodes.User.type, 'ellipse');
  assert.equal(nodes['Main DB'].type, 'round');
  assert.equal(nodes.Login.type, 'ellipse');
  assert.ok(nodes['Redis Cache']);
  assert.equal(link(doc, 'User', 'API').label, 'HTTPS');
  assert.equal(link(doc, 'API', 'Main DB').style.dashed, true);
  assert.ok(link(doc, 'Worker', 'Main DB'));
  assert.equal(link(doc, 'Login', 'User').style.arrowEnd, false);
  assert.deepEqual(doc.groups[0].label, 'Backend');
  assert.deepEqual([...doc.groups[0].children].sort(), ['n_api', 'n_cache', 'n_db']);
});

test('PlantUML sequence diagrams keep the participants and messages', () => {
  const doc = plantumlToDiagram('@startuml\nparticipant Alice\nAlice -> Bob : hello\nBob --> Alice : hi\nnote left of Bob : ignored\n@enduml');
  assert.equal(doc.nodes.length, 2);
  assert.equal(doc.edges.length, 2);
});

test('convert picks the right importer', () => {
  assert.equal(convert('graph TD\nA-->B', '.mmd').edges.length, 1);
  assert.equal(convert('@startuml\nA -> B\n@enduml', '.txt').edges.length, 1);
  assert.equal(convert('# Notes\n```plantuml\nA -> B\nB -> C\n```\n', '.md').edges.length, 2);
  assert.equal(convert('```mermaid\ngraph TD\nA-->B\n```\n```plantuml\nX -> Y\n```', '.md').nodes[0].text, 'A');
  assert.throws(() => convert('# Nothing here', '.md'), /No ```mermaid/);
});

test('layout keeps every shape apart and on the grid, even with loops', () => {
  const nodes = new Map(['a', 'b', 'c', 'd'].map((id) => [id, { id, w: 120, h: 60 }]));
  layout(nodes, [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'a' }, { from: 'a', to: 'd' }], 'TD');
  const list = [...nodes.values()];
  for (const n of list) {
    assert.equal(n.x % 10, 0);
    assert.ok(n.x >= 40 && n.y >= 40);
  }
  for (const a of list) for (const b of list) {
    if (a === b) continue;
    const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y;
    assert.ok(apart, `${a.id} overlaps ${b.id}`);
  }
});
