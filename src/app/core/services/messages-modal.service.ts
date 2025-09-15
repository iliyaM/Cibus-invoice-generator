import {Injectable, signal} from '@angular/core';
import {IMessagesModal, ModalTypes} from '../interfaces/messages-modal.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesModalService {

  modalState = signal<{
    isOpen: boolean;
    type: ModalTypes;
    message: string | null;
  }>({
    isOpen: false,
    type: null,
    message: null
  });

  constructor() {
  }

  open(type: ModalTypes, message: string) {
    this.modalState.set({isOpen: true, type, message});
  }

  close() {
    this.modalState.update(state => ({...state, isOpen: false}));
  }
}
