import {Component, inject, Input} from '@angular/core';
import {ModalTypes} from '../../../core/interfaces/messages-modal.interface';
import {NgIf} from '@angular/common';
import {MessagesModalService} from '../../../core/services/messages-modal.service';

@Component({
  selector: 'app-messages-modal',
  imports: [
    NgIf
  ],
  templateUrl: './messages-modal.component.html',
  styleUrl: './messages-modal.component.scss'
})
export class MessagesModalComponent {
  @Input() message: string | null = null;
  @Input() modalType: ModalTypes = null;
  modalService = inject(MessagesModalService);
}
