import { Component, OnInit } from '@angular/core';
import { AuthService, AuthUser } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

interface StudentProfile {
  fullName: string;
  studentId: string;
  email: string;
  role: string;
  status: string;
  department: string;
  level: string;
  phone: string;
  age: number;
  gpa: number;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile implements OnInit {

  isEditing = false;
  errorMessage = '';
  successMessage = '';

  student: StudentProfile = {
    fullName: localStorage.getItem('userName') || 'Ahmed',
    studentId: 'STU-2026-001',
    email: 'ahmed@example.com',
    role: 'Student',
    status: 'Active Student',
    department: 'Computer Science',
    level: 'Level 3',
    phone: '+20 100 000 0000',
    age: 20,
    gpa: 3.5
  };

  editStudent = { ...this.student };

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit(): void {
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
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.editStudent.email.includes('@')) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }

    const [firstName, ...lastNameParts] = this.editStudent.fullName.trim().split(/\s+/);
    const lastName = lastNameParts.join(' ');
    if (!firstName || !lastName) {
      return;
    }

    this.profileService.updateProfile(userId, {
      firstName,
      lastName,
      age: this.editStudent.age
    }).subscribe({
      next: user => {
        this.applyUser(user);
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully.';
      },
      error: error => {
        console.error('Error updating profile:', error);
        this.errorMessage = error.error?.message || 'Unable to update your profile.';
      }
    });
  }

  private applyUser(user: AuthUser): void {
    this.student = {
      ...this.student,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      age: user.age || this.student.age,
      role: user.role
    };
    this.editStudent = { ...this.student };
    localStorage.setItem('userName', this.student.fullName);
    const token = this.authService.getToken();
    if (token) {
      this.authService.setAuth(token, user);
    }
  }
}