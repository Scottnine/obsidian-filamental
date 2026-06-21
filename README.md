# Filamental for Obsidian

View your project vault in 3D using [Filamental](https://filamental.space) — a 3D knowledge graph desktop app that reads the same markdown files as Obsidian.

Both apps stay in sync automatically. There is no import, no export, and no duplicate files. Edit in Obsidian, see the graph update in Filamental. Move nodes in Filamental, open the note in Obsidian.

## What it does

- **Ribbon button and command** — open your current vault in Filamental with one click
- **Sidebar panel** — shows the entity type, connection count, and linked notes for whichever note is active in the editor
- **Status bar** — displays entity type and connection count at a glance
- **Clickable connections** — click any linked note in the panel to open it in Obsidian

## Requirements

Filamental desktop app must be installed. [Download free at filamental.space](https://filamental.space)

Filamental is free forever for one project vault. Pro is for professional and commercial use.

## How to use

1. Install the plugin
2. Open a vault that you want to visualise
3. Click the Filamental icon in the ribbon (or run the command "View project vault in 3D")
4. Filamental opens with your vault loaded

If Filamental is not installed, a notice will appear with a link to download it.

## Settings

| Setting | Default | Description |
|---|---|---|
| Show status bar | On | Display entity type and connection count in the status bar |
| Auto-launch Filamental | Off | Open Filamental automatically when Obsidian starts |

## Notes

- Desktop only (requires the Filamental desktop app)
- Works best with focused project vaults
- The sidebar panel reads entity types and connections from `.filamental/entity_types.json` if present
