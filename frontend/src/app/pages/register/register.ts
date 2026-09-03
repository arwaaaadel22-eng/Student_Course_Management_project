import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  details = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: 16
  };
  confirmPassword = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.errorMessage = '';
    if (this.details.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    this.authService.register(this.details).subscribe({
      next: response => {
        this.authService.setAuth(response.token, response.user);
        this.router.navigate(['/courses']);
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to create your account.';
        this.isSubmitting = false;
      },
      complete: () => this.isSubmitting = false
    });
  }
}
