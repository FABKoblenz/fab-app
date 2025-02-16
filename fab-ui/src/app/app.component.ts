import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { InstallPromptService } from './shared/install-prompt.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
    installPromptService: InstallPromptService = inject(InstallPromptService);
    constructor() {}

    ngOnInit() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPromptService.setDeferredPrompt(e);
        });
    }
}
