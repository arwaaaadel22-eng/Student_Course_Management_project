import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  user: AuthUser | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.refreshUser();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.refreshUser());
  }

  private refreshUser(): void {
    this.user = this.authService.getUser();
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`
      .trim()
      .split(' ')
      .filter(name => name.length > 0)
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  signOut(): void {
    this.authService.logout();
    this.user = null;
    this.router.navigate(['/login']);
  }
}