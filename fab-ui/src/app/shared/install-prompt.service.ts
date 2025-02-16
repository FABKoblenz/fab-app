import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class InstallPromptService {
    public deferredPrompt: any;
    public showInstallButton: boolean = false;

    constructor() {}

    setDeferredPrompt(e: any) {
        this.deferredPrompt = e;
        this.showInstallButton = true;
    }

    openInstallPrompt() {
        if (!this.deferredPrompt) {
            return;
        }
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                this.showInstallButton = false;
                this.deferredPrompt = null;
            }
        });
    }
}
