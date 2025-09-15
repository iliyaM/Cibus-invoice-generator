import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MessagesModalComponent} from './shared/components/messages-modal/messages-modal.component';
import {MessagesModalService} from './core/services/messages-modal.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MessagesModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(public messagesModalService: MessagesModalService) {
  }
}

