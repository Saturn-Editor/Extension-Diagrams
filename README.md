# Diagrams

A Saturn extension for diagrams and whiteboards. It adds a **Diagrams** project type and opens `.diagram` files as boards, in Diagrams projects and in normal code projects.

Needs Saturn API 1.0.

## Using it

* **New Diagrams project** from the Welcome screen. It starts with `boards/main.diagram`.
* Pick a tool from the toolbar (or press its letter) and click the canvas to place a shape.
* Use the Arrow tool and drag from one shape to another to connect them.
* Double-click a shape or arrow to edit its text. Double-click the canvas to add a note.
* Scroll to move around, pinch or Cmd/Ctrl+scroll to zoom, or hold Space and drag.
* Delete, Duplicate, Select All, Undo and Redo are on the toolbar and also work from the keyboard.
* Select shapes and press Group (Cmd/Ctrl+G) to put a labelled frame around them. Drag the frame to move them all; Ungroup (Shift+Cmd/Ctrl+G) removes it.
* Select an arrow to switch it between straight and elbow, dashed or solid, and with or without a head.
* Export as SVG or PNG, or copy the board as an image.
* **Diagram: Import Mermaid or PlantUML…** turns a diagram into a new board, laid out for you. It reads `.mmd`, `.mermaid`, `.puml`, `.plantuml`, `.pu` and `.iuml` files, or the first ```` ```mermaid ```` or ```` ```plantuml ```` block in a `.md` file.
  * Mermaid: flowcharts, with subgraphs, `A --> B & C`, dotted (`-.->`), thick (`==>`) and plain (`---`) links, and link labels.
  * PlantUML: component, use case, class, deployment and sequence diagrams, as shapes and arrows. Packages and similar blocks become groups. Notes, styling and sequence blocks are skipped.
* Action search finds boards and shape text.

## A Diagrams project

```
my-board/
  diagrams.json      marks the folder as a Diagrams project
  boards/            .diagram files
  assets/            images used on boards
  exports/           exported images (ignored by git)
```

## The .diagram format

Plain JSON, saved so that git diffs stay small and readable:

* one shape or arrow per line, sorted by id
* ids such as `n_3` and `e_2` never change once made
* positions and sizes are whole numbers
* colours are theme names (`accent`, `panel`, `warning` and so on), so boards follow the theme
* zoom, scroll and selection are not saved in the file

```json
{
  "version": 1,
  "canvas": {"grid":10},
  "nodes": [
    {"id":"n_1","type":"rect","x":80,"y":80,"w":140,"h":60,"text":"API"},
    {"id":"n_2","type":"ellipse","x":320,"y":80,"w":120,"h":70,"text":"Database","style":{"fill":"accent"}}
  ],
  "edges": [
    {"id":"e_1","from":"n_1","to":"n_2","label":"SQL"}
  ],
  "groups": []
}
```

Shape types are `rect`, `round`, `ellipse`, `diamond`, `text` and `image` (with `src`, a path inside the project). Arrows can set `"style"` to any of `{"arrowEnd": false}`, `{"dashed": true}` and `{"route": "elbow"}`. A group is a labelled frame around its `children`, and a shape belongs to one group at most.

## Tests

```
npm test
```

The tests cover the file format and the importers. They need Node 20 or newer and nothing else.
