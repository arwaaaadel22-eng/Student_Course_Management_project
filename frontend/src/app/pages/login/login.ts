import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  credentials = { email: '', password: '' };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  submit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.login(this.credentials).subscribe({
      next: response => {
        this.authService.setAuth(response.token, response.user);
        this.router.navigate(['/courses']);
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to sign in. Please check your details.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
