import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cart, reorderFour, home } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, CommonModule],
})
export class TabsPage {
    public environmentInjector = inject(EnvironmentInjector);

    numberOfItemsInCart = 0;

    constructor() {
        addIcons({ home, cart, reorderFour });
    }
}
