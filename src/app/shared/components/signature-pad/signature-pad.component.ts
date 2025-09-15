import SignaturePad from 'signature_pad';
import {AfterViewInit, Component, ElementRef, forwardRef, ViewChild} from '@angular/core'
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-signature-pad',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePadComponent),
      multi: true
    }
  ],
  templateUrl: './signature-pad.component.html',
  styleUrl: './signature-pad.component.scss'
})
export class SignaturePadComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};


  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement;
    if (!canvas || !container) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = container.offsetWidth * ratio;
    canvas.height = 200 * ratio;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(ratio, ratio);

    this.signaturePad = new SignaturePad(canvas, {   penColor: "#fe6670" });

    this.listenToDataChangeOnSignaturePad();
  }

  private listenToDataChangeOnSignaturePad() {
    this.signaturePad.addEventListener('endStroke', () => {
      const data = this.signaturePad.toDataURL();
      this.onChange(data);
      this.onTouched();
    });
  }

  clear() {
    this.signaturePad.clear();
    this.onChange(null);
  }

  writeValue(value: string | null): void {
    if (value && this.signaturePad) {
      this.signaturePad.fromDataURL(value);
    } else if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }


}
