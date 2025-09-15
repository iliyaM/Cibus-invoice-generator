import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPersonalAndInvoicePayload} from '../interfaces/personal-and-invoice-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  requestShouldSucceed: WritableSignal<boolean> = signal(true);

  constructor(private http: HttpClient) { }

  saveUserAndInvoiceDetails(payload: IPersonalAndInvoicePayload): Observable<IPersonalAndInvoicePayload> {
    return this.http.post<IPersonalAndInvoicePayload>(`http://localhost:3000/saveUserAndInvoiceDetails`, payload);
  }

  sendPDFtoBe(pdfBlob: Blob) {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'invoice.pdf');
    return this.http.post('http://localhost:3000/sendPDfToBe', formData);
  }

  toggleRequestState() {
    this.requestShouldSucceed.update((prev: boolean) => !prev);
  }
}
