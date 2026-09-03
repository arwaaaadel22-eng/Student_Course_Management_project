import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService, AuthUser } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

interface StudentProfile {
  fullName: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  age: number;
}

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

  student: StudentProfile = {
    fullName: localStorage.getItem('userName') || 'Ahmed',
    email: 'ahmed@example.com',
    role: 'Student',
    status: 'Active Student',
    phone: '',
    age: 0,
  };

  editStudent = { ...this.student };

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const cachedUser = this.authService.getUser();
    if (cachedUser) {
      this.applyUser(cachedUser);
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }

    this.profileService.getProfile(userId).subscribe({
      next: user => this.applyUser(user),
      error: error => {
        console.error('Error fetching profile:', error);
        this.errorMessage = error.error?.message || 'Unable to load your profile.';
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
    if (!this.editStudent.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Please sign in before saving your profile.';
      return;
    }

    if (!this.authService.getToken()) {
      this.errorMessage = 'Your session has expired. Please sign in again.';
      return;
    }

    const [firstName, ...lastNameParts] = this.editStudent.fullName.trim().split(/\s+/);
    const lastName = lastNameParts.join(' ');
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
    }).pipe(
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: user => {
        this.applyUser(user);
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully.';
      },
      error: error => {
        console.error('Error updating profile:', error);
        this.errorMessage = error.error?.message || error.message || 'Unable to update your profile.';
      }
    });
  }

  private applyUser(user: AuthUser): void {
    this.student = {
      ...this.student,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      age: user.age ?? this.student.age,
      role: user.role,
      phone: user.phone ?? this.student.phone
    };
    this.editStudent = { ...this.student };
    localStorage.setItem('userName', this.student.fullName);
    const token = this.authService.getToken();
    if (token) this.authService.setAuth(token, user);
  }
}