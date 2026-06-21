import {
  addIcon,
  App,
  FileSystemAdapter,
  ItemView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  WorkspaceLeaf,
} from 'obsidian';
import * as fs from 'fs';
import * as path from 'path';

// ── Constants ────────────────────────────────────────────────────────────────

const VIEW_TYPE = 'filamental-panel';
const FILAMENTAL_PURPLE = '#7c6af7';
const FILAMENTAL_SCHEME = 'filamental';

// Filamental triangle mark — registered as a custom Obsidian icon
const FILAMENTAL_ICON_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"
     stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="50,8 94,88 6,88"/>
  <line x1="50" y1="8"  x2="50" y2="88"/>
  <line x1="28" y1="48" x2="72" y2="48"/>
  <circle cx="50" cy="8"  r="5" fill="currentColor" stroke="none"/>
  <circle cx="94" cy="88" r="5" fill="currentColor" stroke="none"/>
  <circle cx="6"  cy="88" r="5" fill="currentColor" stroke="none"/>
</svg>`.trim();

// ── Types ─────────────────────────────────────────────────────────────────────

interface FilamentalSettings {
  autoLaunch: boolean;
  showStatusBar: boolean;
}

interface EntityTypeConfig {
  label: string;
  colour: string;
  icon: string;
}

interface Relationship {
  target: string;
  type: string;
  direction: string;
  influence: string;
}

interface NodeFrontmatter {
  id?: string;
  name?: string;
  type?: string;
  relationships?: Relationship[];
  [key: string]: unknown;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: FilamentalSettings = {
  autoLaunch: false,
  showStatusBar: true,
};

// ── Sidebar view ──────────────────────────────────────────────────────────────

class FilamentalView extends ItemView {
  plugin: FilamentalPlugin;
  private _boundOnActiveLeafChange: () => void;
  private _boundOnMetaChange: (file: TFile) => void;

  constructor(leaf: WorkspaceLeaf, plugin: FilamentalPlugin) {
    super(leaf);
    this.plugin = plugin;
    this._boundOnActiveLeafChange = () => { void this.refresh(); };
    this._boundOnMetaChange = () => { void this.refresh(); };
  }

  getViewType(): string { return VIEW_TYPE; }
  getDisplayText(): string { return 'Filamental'; }
  getIcon(): string { return 'filamental'; }

  async onOpen() {
    this.app.workspace.on('active-leaf-change', this._boundOnActiveLeafChange);
    this.app.metadataCache.on('changed', this._boundOnMetaChange);
    await this.refresh();
  }

  async onClose() {
    this.app.workspace.off('active-leaf-change', this._boundOnActiveLeafChange);
    this.app.metadataCache.off('changed', this._boundOnMetaChange);
  }

  async refresh() {
    await this.renderForFile(this.app.workspace.getActiveFile());
  }

  async renderForFile(file: TFile | null) {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.setCssStyles({ overflow: 'auto' });

    const panel = root.createEl('div', { cls: 'filamental-panel' });

    // Header
    const header = panel.createEl('div', { cls: 'filamental-header' });
    header.createEl('span', { cls: 'filamental-header-logo', text: '◈' });
    header.createEl('span', { cls: 'filamental-header-title', text: 'Filamental' });

    if (!file) {
      panel.createEl('p', { text: 'Open a note to see its graph position and connections.', cls: 'filamental-empty' });
      this.renderOpenButton(panel);
      return;
    }

    const cache = this.app.metadataCache.getFileCache(file);
    const fm = (cache?.frontmatter ?? {}) as NodeFrontmatter;

    if (!fm.type) {
      // Not yet part of a Filamental world — nudge them to open the graph
      panel.createEl('p', {
        text: 'This note is not yet in the graph. Open your project vault in Filamental to add it.',
        cls: 'filamental-empty',
      });
      this.renderOpenButton(panel);
      return;
    }

    // Entity type badge
    const typeRow = panel.createEl('div', { cls: 'filamental-type-row' });
    const dot = typeRow.createEl('span', { cls: 'filamental-type-dot' });
    dot.setCssStyles({ background: this.plugin.getTypeColour(fm.type) });
    typeRow.createEl('span', {
      text: fm.type.replace(/_/g, ' '),
      cls: 'filamental-type-label',
    });

    // Connection count
    const relationships = fm.relationships ?? [];
    const countRow = panel.createEl('div', { cls: 'filamental-conn-count' });
    countRow.createEl('span', { text: String(relationships.length), cls: 'filamental-conn-number' });
    countRow.createEl('span', {
      text: ` connection${relationships.length !== 1 ? 's' : ''}`,
      cls: 'filamental-conn-label',
    });

    // Connection list
    if (relationships.length > 0) {
      const list = panel.createEl('div', { cls: 'filamental-conn-list' });
      const visible = relationships.slice(0, 12);

      for (const rel of visible) {
        const resolvedFile = this.plugin.resolveNodeFile(rel.target);
        const displayName = resolvedFile
          ? (this.app.metadataCache.getFileCache(resolvedFile)?.frontmatter?.name as string | undefined)
            ?? resolvedFile.basename
          : rel.target.slice(0, 8) + '…';

        const item = list.createEl('div', { cls: 'filamental-conn-item' });
        item.createEl('span', { cls: 'filamental-conn-type' });
        item.createEl('span', { text: displayName, cls: 'filamental-conn-name' });

        if (resolvedFile) {
          item.addClass('filamental-conn-clickable');
          item.onclick = () => {
            const leaf = this.app.workspace.getLeaf(false);
            void leaf.openFile(resolvedFile);
          };
        }
      }

      if (relationships.length > 12) {
        list.createEl('div', {
          text: `+ ${relationships.length - 12} more in Filamental`,
          cls: 'filamental-conn-more',
        });
      }
    }

    this.renderOpenButton(panel);
  }

  private renderOpenButton(panel: HTMLElement) {
    const actions = panel.createEl('div', { cls: 'filamental-actions' });
    const btn = actions.createEl('button', {
      text: 'Open 3D Graph',
      cls: 'filamental-btn filamental-btn--primary',
    });
    btn.onclick = () => this.plugin.openVaultInFilamental();
  }
}

// ── Settings tab ─────────────────────────────────────────────────────────────

class FilamentalSettingTab extends PluginSettingTab {
  plugin: FilamentalPlugin;

  constructor(app: App, plugin: FilamentalPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Show status bar')
      .setDesc('Display entity type and connection count in the Obsidian status bar.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showStatusBar).onChange(async (value) => {
          this.plugin.settings.showStatusBar = value;
          await this.plugin.saveSettings();
          this.plugin.updateStatusBar();
        })
      );

    new Setting(containerEl)
      .setName('Auto-launch Filamental')
      .setDesc('Open Filamental automatically when Obsidian starts.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.autoLaunch).onChange(async (value) => {
          this.plugin.settings.autoLaunch = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName('About Filamental')
      .setDesc(
        'Filamental is a 3D knowledge graph desktop app. It reads the same markdown files as Obsidian, so your notes stay in sync automatically — no import needed. ' +
        'Best suited for focused project vaults rather than large personal knowledge bases. ' +
        'Free forever for one project vault. Pro is for professional and commercial use.'
      )
      .addButton((btn) =>
        btn
          .setButtonText('Download Filamental')
          .onClick(() => {
            void this.plugin.openExternal('https://filamental.space');
          })
      );
  }
}

// ── Main plugin ───────────────────────────────────────────────────────────────

export default class FilamentalPlugin extends Plugin {
  settings!: FilamentalSettings;
  private statusBarEl: HTMLElement | null = null;
  private entityTypes: Record<string, EntityTypeConfig> = {};
  // UUID → TFile index, built lazily on first lookup and refreshed on vault change
  private uuidIndex: Map<string, TFile> | null = null;

  async onload() {
    addIcon('filamental', FILAMENTAL_ICON_SVG);

    await this.loadSettings();
    this.loadEntityTypes();
    this.registerView(VIEW_TYPE, (leaf) => new FilamentalView(leaf, this));

    // Ribbon
    this.addRibbonIcon('filamental', 'View project in 3D (Filamental)', () => this.openVaultInFilamental());

    // Commands
    this.addCommand({
      id: 'open-vault',
      name: 'View project vault in 3D',
      callback: () => this.openVaultInFilamental(),
    });

    this.addCommand({
      id: 'show-panel',
      name: 'Show panel',
      callback: () => this.activateView(),
    });

    // Status bar
    if (this.settings.showStatusBar) {
      this.statusBarEl = this.addStatusBarItem();
      this.statusBarEl.addClass('filamental-status');
      this.registerEvent(
        this.app.workspace.on('active-leaf-change', () => this.updateStatusBar())
      );
      this.registerEvent(
        this.app.metadataCache.on('changed', () => this.updateStatusBar())
      );
    }

    // Invalidate UUID index when vault changes
    this.registerEvent(
      this.app.vault.on('create', () => { this.uuidIndex = null; })
    );
    this.registerEvent(
      this.app.vault.on('delete', () => { this.uuidIndex = null; })
    );
    this.registerEvent(
      this.app.vault.on('rename', () => { this.uuidIndex = null; })
    );

    // Settings tab
    this.addSettingTab(new FilamentalSettingTab(this.app, this));

    // After layout is ready: open panel + status bar + optional auto-launch
    this.app.workspace.onLayoutReady(async () => {
      await this.activateView();
      this.updateStatusBar();
      if (this.settings.autoLaunch) await this.openVaultInFilamental();
    });
  }

  onunload() {
    this.uuidIndex = null;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<FilamentalSettings>);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // ── Vault path ─────────────────────────────────────────────────────────────

  getVaultPath(): string | null {
    const adapter = this.app.vault.adapter;
    if (adapter instanceof FileSystemAdapter) {
      return adapter.getBasePath();
    }
    return null;
  }

  // ── Filamental launch ──────────────────────────────────────────────────────

  async openVaultInFilamental() {
    const vaultPath = this.getVaultPath();
    if (!vaultPath) {
      new Notice('Filamental requires a local vault on disk.');
      return;
    }
    const url = `${FILAMENTAL_SCHEME}://open?vault=${encodeURIComponent(vaultPath)}`;
    try {
      await this.openExternal(url);
    } catch {
      new Notice(
        'Filamental is not installed.\nDownload free at filamental.space',
        6000,
      );
    }
  }

  async openExternal(url: string): Promise<void> {
    const electron = (window as unknown as Record<string, unknown>)
      .require?.('electron') as { shell?: { openExternal: (u: string) => Promise<void> } } | undefined;
    if (electron?.shell) {
      await electron.shell.openExternal(url);
    } else {
      window.open(url);
    }
  }

  // ── Entity types ───────────────────────────────────────────────────────────

  loadEntityTypes() {
    const vaultPath = this.getVaultPath();
    if (!vaultPath) return;
    const typesFile = path.join(vaultPath, '.filamental', 'entity_types.json');
    try {
      if (fs.existsSync(typesFile)) {
        const raw = fs.readFileSync(typesFile, 'utf-8');
        this.entityTypes = JSON.parse(raw) as Record<string, EntityTypeConfig>;
      }
    } catch {
      // Not a Filamental vault yet — ignore
    }
  }

  getTypeColour(typeKey: string): string {
    return this.entityTypes[typeKey]?.colour ?? FILAMENTAL_PURPLE;
  }

  // ── UUID index ─────────────────────────────────────────────────────────────

  private buildUuidIndex(): Map<string, TFile> {
    const index = new Map<string, TFile>();
    for (const file of this.app.vault.getMarkdownFiles()) {
      const fm = this.app.metadataCache.getFileCache(file)?.frontmatter as NodeFrontmatter | undefined;
      if (fm?.id) index.set(fm.id, file);
    }
    return index;
  }

  resolveNodeFile(uuid: string): TFile | null {
    if (!this.uuidIndex) this.uuidIndex = this.buildUuidIndex();
    return this.uuidIndex.get(uuid) ?? null;
  }

  // ── Status bar ─────────────────────────────────────────────────────────────

  updateStatusBar() {
    if (!this.statusBarEl || !this.settings.showStatusBar) return;
    const file = this.app.workspace.getActiveFile();
    if (!file) { this.statusBarEl.setText(''); return; }
    const fm = this.app.metadataCache.getFileCache(file)?.frontmatter as NodeFrontmatter | undefined;
    if (!fm?.type) { this.statusBarEl.setText(''); return; }
    const label = fm.type.replace(/_/g, ' ');
    const count = fm.relationships?.length ?? 0;
    this.statusBarEl.setText(`◈ ${label} · ${count}`);
  }

  // ── Sidebar view ───────────────────────────────────────────────────────────

  async activateView() {
    const { workspace } = this.app;
    const existing = workspace.getLeavesOfType(VIEW_TYPE);
    if (existing.length > 0) {
      await workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
      await workspace.revealLeaf(leaf);
    }
  }
}
