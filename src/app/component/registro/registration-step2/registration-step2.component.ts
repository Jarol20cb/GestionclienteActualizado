import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration-step2',
  templateUrl: './registration-step2.component.html',
  styleUrls: ['./registration-step2.component.css']
})
export class RegistrationStep2Component {
  @Input() form: FormGroup = new FormGroup({});
  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  selectPlan(planType: string) {
    this.form.get('accountType')?.setValue(planType);
  }

  onPrevious() {
    this.previous.emit();
  }

  onSubmit() {
    if (this.form.valid) {
      this.submit.emit();
    }
  }

  clearSelection(event: Event) {
    event.stopPropagation(); // Prevenir que el clic en el botón cierre seleccione la tarjeta de nuevo
    this.form.get('accountType')?.setValue('');
  }
}
