import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../services/courses';

@Component({
  selector: 'app-admin-courses',
  standalone: false,
  templateUrl: './admin-courses.html',
  styleUrl: './admin-courses.css'
})
export class AdminCourses implements OnInit {
  courses: Course[] = [];
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  editingId: string | null = null;
  form: Course = this.emptyCourse();

  constructor(private readonly coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.coursesService.getCourses().subscribe({
      next: courses => {
        this.courses = courses;
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to load courses.';
        this.isLoading = false;
      }
    });
  }

  startCreate(): void {
    this.editingId = null;
    this.form = this.emptyCourse();
    this.clearMessages();
  }

  startEdit(course: Course): void {
    this.editingId = course._id || null;
    this.form = { ...course };
    this.clearMessages();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = this.emptyCourse();
  }

  save(): void {
    this.clearMessages();
    this.isSaving = true;
    const request = this.editingId
      ? this.coursesService.updateCourse(this.editingId, this.form)
      : this.coursesService.createCourse(this.form);

    request.subscribe({
      next: course => {
        if (this.editingId) {
          this.courses = this.courses.map(item => item._id === course._id ? course : item);
          this.successMessage = 'Course updated successfully.';
        } else {
          this.courses = [course, ...this.courses];
          this.successMessage = 'Course created successfully.';
        }
        this.cancelEdit();
        this.isSaving = false;
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to save course.';
        this.isSaving = false;
      }
    });
  }

  remove(course: Course): void {
    if (!course._id || !confirm(`Delete "${course.title}"?`)) {
      return;
    }

    this.coursesService.deleteCourse(course._id).subscribe({
      next: () => {
        this.courses = this.courses.filter(item => item._id !== course._id);
        this.successMessage = 'Course deleted successfully.';
      },
      error: error => this.errorMessage = error.error?.message || 'Unable to delete course.'
    });
  }

  private emptyCourse(): Course {
    return {
      title: '',
      code: '',
      description: '',
      instructor: '',
      duration: 1,
      price: 0,
      capacity: 1
    };
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
