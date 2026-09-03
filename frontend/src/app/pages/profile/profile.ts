import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService, AuthUser } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile implements OnInit {

  isEditing = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  student = {
    fullName: '',
    email: '',
    role: '',
    status: '',
    phone: '',
    age: 0,
  };

  editStudent = { ...this.student };

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const cachedUser = this.authService.getUser();
    if (cachedUser) {
      this.loadUser(cachedUser);
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.profileService.getProfile(userId).subscribe({
      next: user => {
        this.loadUser(user);
        this.cdr.markForCheck();
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to load your profile.';
        this.cdr.markForCheck();
      }
    });
  }

  editProfile(): void {
    this.editStudent = { ...this.student };
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.editStudent = { ...this.student };
    this.isEditing = false;
    this.isSaving = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Please sign in before saving your profile.';
      return;
    }

    const parts = this.editStudent.fullName.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    if (!firstName || !lastName) {
      this.errorMessage = 'Please enter your first and last name.';
      return;
    }

    this.isSaving = true;

    this.profileService.updateProfile(userId, {
      firstName,
      lastName,
      age: this.editStudent.age,
      phone: this.editStudent.phone
    }).subscribe({
      next: user => {
        this.loadUser(user);
        this.isEditing = false;
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully.';
        this.cdr.markForCheck();
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to update your profile.';
        this.isSaving = false;
        this.cdr.markForCheck();
      }
    });
  }

  private loadUser(user: AuthUser): void {
    this.student.fullName = user.firstName + ' ' + user.lastName;
    this.student.email = user.email;
    this.student.age = user.age || 0;
    this.student.role = user.role;
    this.student.phone = user.phone || '';
    this.editStudent = { ...this.student };

    const token = this.authService.getToken();
    if (token) {
      this.authService.setAuth(token, user);
    }
  }
}