import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses';
import { Course } from '../../models/course.model';
import { NotificationService } from '../../services/notification.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-admin-courses',
  standalone: false,
  templateUrl: './admin-courses.html',
  styleUrl: './admin-courses.css'
})
export class AdminCourses implements OnInit {

  courseForm!: FormGroup;
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  isEditing: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private notifications: NotificationService,
    private confirmService: ConfirmService
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      instructor: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.getCourses();
  }

  // Get Courses
  getCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (res: any) => {
        this.courses = res.courses || res;
      },
      error: (err: any) => {
        this.notifications.error(err.error?.message || 'Failed to fetch courses');
      }
    });
  }

  // Create / Update
  saveCourse(): void {
    if (this.courseForm.invalid || this.isSubmitting) {
      return;
    }

    const course: Course = this.courseForm.value;
    this.isSubmitting = true;

    // Create
    if (!this.isEditing) {
      this.coursesService
        .createCourse(course)
        .subscribe({
          next: (res: any) => {
            this.notifications.success(res?.message || 'Course created successfully');
            this.courseForm.reset();
            this.isSubmitting = false;
            this.getCourses();
          },
          error: (err: any) => {
            this.notifications.error(err.error?.message || 'Error while creating course');
            this.isSubmitting = false;
          }
        });
      return;
    }

    // Update
    if (this.selectedCourse?._id) {
      this.coursesService
        .updateCourse(this.selectedCourse._id, course)
        .subscribe({
          next: (res: any) => {
            this.notifications.success(res?.message || 'Course updated successfully');
            this.courseForm.reset();
            this.selectedCourse = null;
            this.isEditing = false;
            this.isSubmitting = false;
            this.getCourses();
          },
          error: (err: any) => {
            this.notifications.error(err.error?.message || 'Error while updating course');
            this.isSubmitting = false;
          }
        });
    } else {
      this.isSubmitting = false;
    }
  }

  // Edit
  editCourse(course: Course): void {
    this.isEditing = true;
    this.selectedCourse = course;

    this.courseForm.patchValue({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      price: course.price,
      capacity: course.capacity
    });
  }

  // Delete
  async deleteCourse(id: string | undefined): Promise<void> {
    if (!id) {
      return;
    }

    const confirmed = await this.confirmService.confirm(
      'Are you sure you want to delete this course?',
      'Delete'
    );
    if (!confirmed) {
      return;
    }

    this.coursesService
      .deleteCourse(id)
      .subscribe({
        next: (res: any) => {
          this.notifications.success(res?.message || 'Course deleted successfully');
          this.getCourses();
        },
        error: (err: any) => {
          this.notifications.error(err.error?.message || 'Error while deleting course');
        }
      });
  }

  // Cancel Edit
  cancelEdit(): void {
    this.isEditing = false;
    this.selectedCourse = null;
    this.courseForm.reset();
  }
}