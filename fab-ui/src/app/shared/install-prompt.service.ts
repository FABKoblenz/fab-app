import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class InstallPromptService {
    public deferredPrompt: any;
    private _showInstallButton: boolean = false;

    constructor() {}

    setDeferredPrompt(e: any) {
        this.deferredPrompt = e;
        this._showInstallButton = true;
    }

    showInstallButton() {
        if ((window as any).FAB_INSTALL_PROMPT) {
            this.deferredPrompt = (window as any).FAB_INSTALL_PROMPT;
            this._showInstallButton = true;
        }
        return this._showInstallButton;
    }

    openInstallPrompt() {
        if (!this.deferredPrompt) {
            return;
        }
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                this._showInstallButton = false;
                this.deferredPrompt = null;
                (window as any).FAB_INSTALL_PROMPT = null;
            }
        });
    }
}
