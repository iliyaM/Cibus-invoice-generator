export interface IMessagesModal {
  isOpen: boolean;
  message: string | null;
  type: ModalTypes;
}

export type ModalTypes = 'success' | 'error' | 'loading' | null ;
