export function layout(nodes, edges, direction = 'TD') {
  const rank = new Map();
  const incoming = new Map([...nodes.keys()].map((id) => [id, 0]));
  for (const e of edges) if (incoming.has(e.to)) incoming.set(e.to, incoming.get(e.to) + 1);
  const visit = (roots) => {
    const queue = [...roots];
    for (const id of queue) if (!rank.has(id)) rank.set(id, 0);
    for (let i = 0; i < queue.length; i++) {
      const id = queue[i];
      for (const e of edges) {
        if (e.from !== id || rank.has(e.to) || !nodes.has(e.to)) continue;
        rank.set(e.to, rank.get(id) + 1);
        queue.push(e.to);
      }
    }
  };
  visit([...nodes.keys()].filter((id) => incoming.get(id) === 0));
  for (const id of nodes.keys()) if (!rank.has(id)) visit([id]);

  const layers = [];
  for (const [id, r] of rank) (layers[r] ||= []).push(id);
  const across = direction === 'LR' || direction === 'RL';
  const flip = direction === 'BT' || direction === 'RL';
  layers.forEach((layer, r) => {
    const step = flip ? layers.length - 1 - r : r;
    layer.forEach((id, i) => {
      const node = nodes.get(id);
      const main = step * (across ? 260 : 140);
      const cross = (i - (layer.length - 1) / 2) * (across ? 120 : 220);
      node.x = Math.round((across ? main : cross) - node.w / 2);
      node.y = Math.round((across ? cross : main) - node.h / 2);
    });
  });
  const list = [...nodes.values()];
  if (!list.length) return;
  const left = Math.min(...list.map((n) => n.x));
  const top = Math.min(...list.map((n) => n.y));
  for (const n of list) {
    n.x = Math.round((n.x - left + 40) / 10) * 10;
    n.y = Math.round((n.y - top + 40) / 10) * 10;
  }
}

export function sizeFor(text, type) {
  const longest = Math.max(...String(text).split('\n').map((line) => line.length));
  const w = Math.max(120, Math.min(260, longest * 8 + 40));
  return type === 'diamond' ? { w: w + 40, h: 80 } : { w, h: 60 };
}

export function slug(text) {
  return String(text).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'node';
}
