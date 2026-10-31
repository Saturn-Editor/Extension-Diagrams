import { mermaidToDiagram } from './mermaid.js';
import { plantumlToDiagram } from './plantuml.js';

export function convert(source, extension) {
  const plant = source.match(/```(?:plantuml|puml)\s*\n([\s\S]*?)```/);
  const mermaid = source.match(/```mermaid\s*\n([\s\S]*?)```/);
  if (extension === '.md') {
    if (mermaid && (!plant || mermaid.index < plant.index)) return mermaidToDiagram(mermaid[1]);
    if (plant) return plantumlToDiagram(plant[1]);
    throw new Error('No ```mermaid or ```plantuml block was found.');
  }
  if (['.puml', '.plantuml', '.pu', '.iuml'].includes(extension) || /^\s*@start/m.test(source)) return plantumlToDiagram(source);
  return mermaidToDiagram(source);
}
