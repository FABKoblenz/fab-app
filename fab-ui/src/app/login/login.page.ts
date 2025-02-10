import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonButton, IonIcon],
})
export class LoginPage {
    constructor() {}
}
