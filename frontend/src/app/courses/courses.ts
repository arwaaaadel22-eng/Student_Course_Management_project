import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses';
import { Course } from '../models/course.model';

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
  

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.getCourses();
  }

  // Get All Courses
  getCourses(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.coursesService.getCourses().subscribe({

      next: (courses) => {
        this.courses = courses;

        this.isLoading = false;
      },

      error: (err) => {

        console.log(err);

        this.errorMessage = 'Failed to load courses';

        this.isLoading = false;
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

        next: (courses) => {
          this.courses = courses;

          this.isLoading = false;
        },

        error: (err) => {

          console.log(err);

          this.errorMessage = 'Error while searching';

          this.isLoading = false;
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

        next: (course) => {
          this.selectedCourse = course;

        },

        error: (err) => {

          console.log(err);

        }

      });
  }

  // Close Details
  closeCourseDetails(): void {

    this.selectedCourse = null;

  }

}