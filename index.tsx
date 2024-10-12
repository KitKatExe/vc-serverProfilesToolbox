/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import React, { FC } from 'react';

interface ChangeLog {
}

interface Meta {
  name: string;
  author: string;
  authorId: string;
  version: string;
  description: string;
  invite: string;
  donate: string;
  patreon: string;
  website: string;
  source: string;
  updateUrl: string;
}

class EditUsers {
  name: string;
  author: string;
  authorId: string;
  version: string;
  description: string;

  constructor(meta: Meta) {
    for (let key in meta) this[key] = meta[key];
  }

  getName(): string {
    return this.name;
  }

  getAuthor(): string {
    return this.author;
  }

  getVersion(): string {
    return this.version;
  }

  getDescription(): string {
    return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it. \n\n${this.description}`;
  }

  downloadLibrary(): void {
    BdApi.Net.fetch("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js").then(r => {
      if (!r || r.status !== 200) throw new Error();
      else return r.text();
    }).then(b => {
      if (!b) throw new Error();
      else return require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", { type: "success" }));
    }).catch(error => {
      BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
    });
  }

  load(): void {
    if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, { pluginQueue: [] });
    if (!window.BDFDB_Global.downloadModal) {
      window.BDFDB_Global.downloadModal = true;
      BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click "Download Now" to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onCancel: _ => { delete window.BDFDB_Global.downloadModal; },
        onConfirm: _ => {
          delete window.BDFDB_Global.downloadModal;
          this.downloadLibrary();
        }
      });
    }
    if (!window.BDFDB_Global.pluginQueue.includes(this.name)) window.BDFDB_Global.pluginQueue.push(this.name);
  }

  start(): void {
    this.load();
  }

  stop(): void {
  }

  getSettingsPanel(collapseStates: Record<string, boolean> = {}): HTMLElement {
    let template = document.createElement("template");
    template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
    template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary.bind(this));
    return template.content.firstElementChild;
  }
} 

export default EditUsers;

}];
