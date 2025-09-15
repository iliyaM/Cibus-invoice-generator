import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SignaturePadComponent} from '../../shared/components/signature-pad/signature-pad.component';
import {IPersonalAndInvoicePayload} from '../../core/interfaces/personal-and-invoice-payload.interface';
import {HttpService} from '../../core/services/http.service';
import {MessagesModalService} from '../../core/services/messages-modal.service';
import {PdfGeneratorService} from '../../core/services/pdf-generator.service';
import jsPDF from 'jspdf';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-invoice-generator',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SignaturePadComponent,
  ],
  templateUrl: './invoice-generator.component.html',
  styleUrl: './invoice-generator.component.scss'
})
export class InvoiceGeneratorComponent implements OnInit {
  invoiceForm!: FormGroup;
  generatedPdf: jsPDF | null = null;
  pdfDataUrl: SafeResourceUrl | null = null;

  constructor(
    private pdfService: PdfGeneratorService,
    private fb: FormBuilder,
    public httpService: HttpService,
    public messagesModalService: MessagesModalService,
    private sanitizer: DomSanitizer
  ) {
  }


  ngOnInit() {
    this.buildInvoiceForm();
  }

  private buildInvoiceForm() {
    this.invoiceForm = this.fb.group({
      personalDetails: this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern(/^05\d{8}$/)]],
      }),
      invoiceDetails: this.fb.group({
        invoiceNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        amount: [null, [Validators.required, Validators.min(1)]],
        invoiceDate: ['', Validators.required],
      }),
      signature: [null, Validators.required]
    });
  }

  get personalDetails() {
    return this.invoiceForm.get('personalDetails') as FormGroup;
  }

  get invoiceDetails() {
    return this.invoiceForm.get('invoiceDetails') as FormGroup;
  }

  saveUserAndInvoiceDetails() {
    this.messagesModalService.modalState.set({message: null, type: 'loading', isOpen: true})


    const formValue = this.invoiceForm.value;
    const payload: IPersonalAndInvoicePayload = {
      personalDetails: {
        ...formValue.personalDetails,
      },
      invoiceDetails: {
        ...formValue.invoiceDetails
      }
    };

    this.httpService.saveUserAndInvoiceDetails(payload).subscribe({
      next: () => {
        this.showSuccessModal();
      },
      error: err => {
        this.showErrorModal();
      }
    })
  }

  async generatePDF() {
    this.generatedPdf = await this.pdfService.generatePDF(this.invoiceForm.value);
    const pdfString = this.generatedPdf.output('dataurlstring');
    this.pdfDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      pdfString + '#toolbar=0&navpanes=0&scrollbar=0'
    );
  }

  private showSuccessModal() {
    this.messagesModalService.modalState.set({
      message: 'Your details have been saved successfully',
      type: 'success',
      isOpen: true
    })
  }

  private showErrorModal() {
    this.messagesModalService.modalState.set({
      message: 'Something went wrong. Please try again or contact support',
      type: 'error',
      isOpen: true
    })
  }

  sendPdfToBe() {
    const pdfBlob: Blob | null = this.pdfService.convertToBlob(this.generatedPdf)

    if (pdfBlob) {
      this.httpService.sendPDFtoBe(pdfBlob).subscribe({
        next: () => {
          this.pdfDataUrl = null;
          this.showSuccessModal();
        },
        error: err => {
          this.pdfDataUrl = null;
          this.showErrorModal();
        }
      });
    }

  }
}
