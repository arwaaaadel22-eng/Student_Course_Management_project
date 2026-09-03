import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses';
import { Course } from '../models/course.model';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {

  courses: Course[] = [];
  selectedCourse: Course | null = null;
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  enrollingId: string | null = null;

  constructor(
    private coursesService: CoursesService,
    private notifications: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  isFull(course: Course): boolean {
    return course.enrolledCount !== undefined && course.enrolledCount >= course.capacity;
  }

  ngOnInit(): void {
    this.getCourses();
  }

  // Get All Courses
  getCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.coursesService.getCourses().subscribe({
      next: (res: any) => {
        this.courses = res.courses || res;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load courses';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Search Courses
  searchCourses(): void {
    if (!this.searchTerm.trim()) {
      this.getCourses();
      return;
    }

    this.isLoading = true;

    this.coursesService
      .searchCourses(this.searchTerm)
      .subscribe({
        next: (res: any) => {
          this.courses = res.courses || res;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error while searching';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // Show Course Details
  openCourseDetails(course: Course): void {
    if (!course._id) {
      return;
    }

    this.coursesService
      .getCourseById(course._id)
      .subscribe({
        next: (res: any) => {
          this.selectedCourse = res.course || res;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to load course details';
          this.cdr.markForCheck();
        }
      });
  }

  // Close Details
  closeCourseDetails(): void {
    this.selectedCourse = null;
  }

  // Enroll
  enroll(courseId: string | undefined): void {
    if (!courseId || this.enrollingId) {
      return;
    }

    this.enrollingId = courseId;
    this.coursesService
      .enrollInCourse(courseId)
      .subscribe({
        next: (res) => {
          this.notifications.success(res?.message || 'Enrolled successfully');
          this.enrollingId = null;
          this.getCourses();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.notifications.error(err.error?.message || 'Error while enrolling');
          this.enrollingId = null;
          this.cdr.markForCheck();
        }
      });
  }
}