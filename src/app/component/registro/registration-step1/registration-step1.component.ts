import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registration-step1',
  templateUrl: './registration-step1.component.html',
  styleUrls: ['./registration-step1.component.css']
})
export class RegistrationStep1Component {
  @Input() form: FormGroup;
  @Output() next = new EventEmitter<void>();

  passwordVisible: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      companyName: ['', Validators.required],
      number: ['', Validators.required, Validators.minLength(9), Validators.maxLength(9)],
    });
  }

  onNext() {
    if (this.form.valid) {
      this.next.emit();
    }
  }

  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.passwordVisible = !this.passwordVisible;
  }

  validatePasswordConfirmation() {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      this.form.get('confirmPassword')?.setErrors(null);
    } else {
      this.form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
  }
}
