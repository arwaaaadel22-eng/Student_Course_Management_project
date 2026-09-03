import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notfound',
  standalone: false,
  templateUrl: './notfound.html',
  styleUrl: './notfound.css'
})
export class Notfound {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  goBack(): void {
    const token = this.authService.getToken();

    if (token) {
      this.router.navigate(['/courses']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
