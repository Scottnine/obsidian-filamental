# 3D Filamental Graph for Obsidian

Explore your vault as a **living 3D knowledge graph** - right inside Obsidian. Every note becomes a node. Every wikilink becomes a connection. Physics pulls related notes together and pushes unrelated ones apart, so your vault's hidden structure reveals itself.

No import. No export. No duplicate files. Your markdown stays exactly where it is.

---

## What you get

### Full 3D graph inside Obsidian
Open the graph in any Obsidian tab. Your entire vault renders in three dimensions, driven by a real physics simulation. Notes cluster naturally by how they link to each other.

### Physics that thinks
Nodes repel each other and spring toward their connections. The simulation settles on its own. Drag any node to a new position and it sticks - saved permanently to `.filamental/positions.json`.

### Type-coloured nodes
Use Filamental entity types and every node glows with its assigned colour. Node size scales with connection count, so the most-connected notes are instantly visible.

### Navigation that feels natural
- **Arrow keys** to pan
- **Ctrl + scroll** or **trackpad pinch** to zoom
- **Two-finger trackpad swipe** to pan
- **Click any node** to open that note in Obsidian
- **Drag nodes** to rearrange the layout

### Sidebar panel
Shows the active note's entity type, colour dot, and total link count at a glance. Launch the 3D graph or jump to the Filamental desktop app from one place.

### Shared layout with Filamental desktop
Positions sync through `.filamental/positions.json` in your vault. Open the same vault in Filamental and your layout carries over exactly.

### Open in Filamental
One click launches the Filamental desktop app with your vault already loaded - no setup, no prompts.

---

## Getting started

1. Install **3D Filamental Graph** from the Obsidian community plugins list
2. Open any vault you want to explore
3. Click the Filamental icon in the ribbon, or run the command **Open 3D Filamental Graph**
4. The graph appears in a new tab and begins simulating

That's it. If you want deeper features - node classification, connector types, themes, and full 3D editing - download the Filamental desktop app.

---

## Filamental desktop app

Filamental is a standalone 3D knowledge graph app that reads the same markdown files as Obsidian. Both apps stay in sync automatically.

- Node types and colour themes
- Named connector types (not just wikilinks)
- Drone export and AI integration
- Works with any vault size

**Free to try for 30 days.** [Download at filamental.space](https://filamental.space)

---

## Settings

| Setting | Default | Description |
|---|---|---|
| Auto-launch 3D graph | Off | Opens the graph automatically when Obsidian starts |

---

## Requirements

- Obsidian 1.7.2 or later
- Desktop only (uses the local filesystem)
- Windows supported now - macOS coming soon

---

## Notes

- Node positions are written to `.filamental/positions.json` inside your vault. This file is shared with the Filamental desktop app.
- Entity type colours are read from `.filamental/entity_types.json` if present.
- The simulation pauses automatically once the graph settles. Drag a node to restart it.
