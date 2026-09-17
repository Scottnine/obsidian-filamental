# 3D Filamental Graph for Obsidian

Explore your vault as a **living 3D knowledge graph**, right inside Obsidian. Every note becomes a node, every connection between them becomes an edge, and physics pulls related notes together while pushing unrelated ones apart, so your vault's hidden structure reveals itself.

No import. No export. No duplicate files. Your markdown stays exactly where it is.

**Free, with no account and nothing to sign up for.**

---

## What you get

### Full 3D graph inside Obsidian

Open the graph in any Obsidian tab. Your entire vault renders in three dimensions, driven by a real physics simulation, and notes cluster by how they actually link rather than by where you filed them.

### It reads what your vault already holds

The wikilinks between your notes, and, where a vault holds a Filamental space, the connections written in each note's front matter as well. Nothing has to be prepared first, and nothing is added to your files to make it work.

### Physics that settles

Nodes repel each other and spring toward their connections, and the simulation settles on its own. Drag any node somewhere deliberate and it stays there, saved to `.filamental/positions.json` inside your vault.

### Type-coloured nodes

If your notes carry Filamental entity types, every node takes its category colour, read from `.filamental/entity_types.json` if that file is present.

### Navigation that feels natural

- **Arrow keys** to pan
- **Ctrl + scroll** or **trackpad pinch** to zoom
- **Two-finger trackpad swipe** to pan
- **Click any node** to open that note in Obsidian
- **Drag nodes** to rearrange the layout

### Sidebar panel

Shows the active note's entity type, its colour dot, its link count and the connections recorded in its front matter. Launch the 3D graph or jump to the Filamental desktop app from the same place.

### Shared layout with Filamental desktop

Positions sync through `.filamental/positions.json` in your vault, so open the same vault in Filamental and the layout you arranged carries over exactly.

### Open in Filamental

One click launches the Filamental desktop app with your vault already loaded, with no setup and no prompts.

---

## What the graph does not show

Every connection is drawn as a plain line, which is the honest limit of a quick view. It can show you that two notes are connected, and not that one supersedes another, or blocks it, or reports to it.

Connection types, directions and labels live in the Filamental desktop app, which reads the same folder at the same time. This plugin is the quick look; the app is where a structure gets built.

---

## Getting started

1. Install **3D Filamental Graph** from the Obsidian community plugins list
2. Open any vault you want to explore
3. Click the Filamental icon in the ribbon, or run the command **Open 3D Filamental Graph**
4. The graph appears in a new tab and begins simulating

That is it. If you want the rest of it, meaning classifications, connector types, properties and themes, the desktop app reads the same folder and nothing needs migrating.

---

## Filamental desktop app

Filamental is a standalone 3D knowledge graph app that reads the same markdown files as Obsidian. Both can be open on one folder at once, with no conflict and no second copy.

- Custom categories and structured properties
- Custom connector types with directional arrows, labels, colours and weights
- 2D and 3D views of the same structure
- Attach a file of any type to the thing it concerns
- Folder bridges to jump between spaces
- A local MCP connection and bring-your-own-key AI, so you are never pushed onto a rebranded model
- Wikilink and Mermaid compatibility
- Publishing, which sends a space as a link or a single HTML file
- All local. Your data stays on your machine, and we have no way to see it

**Free forever, with paid options.** The free Personal plan needs no account and no card, and holds unlimited spaces of twenty nodes each with free bridges between them. The paid tier adds sending a space to somebody who does not have Filamental.

Available on **Windows, macOS and Linux**. [Get it at filamental.space](https://filamental.space)

---

## Settings

| Setting | Default | Description |
|---|---|---|
| Auto-launch 3D graph | Off | Opens the graph automatically when Obsidian starts |

---

## Requirements

- Obsidian 1.7.2 or later
- Desktop only (uses the local filesystem)
- Available on Windows, macOS and Linux

---

## Notes

- Node positions are written to `.filamental/positions.json` inside your vault. This file is shared with the Filamental desktop app.
- Entity type colours are read from `.filamental/entity_types.json` if present.
- The simulation pauses automatically once the graph settles. Drag a node to restart it.
