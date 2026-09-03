import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses';
import { Course } from '../models/course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.html',
  styleUrls: ['./courses.css'],
  standalone: false
})
export class Courses implements OnInit {
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage = '';
  isSearching = false;
  
  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.isLoading = true;
    this.isSearching = false;
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.errorMessage = 'Unable to load courses. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    if (!term.trim()) {
      this.fetchCourses();
      return;
    }

    this.isSearching = true;
    this.coursesService.searchCourses(term.trim()).subscribe({
      next: data => {
        this.courses = data;
        this.errorMessage = '';
        this.isSearching = false;
      },
      error: error => {
        console.error('Error searching courses:', error);
        this.errorMessage = 'Unable to search courses. Please try again.';
        this.isSearching = false;
      }
    });
  }

  get filteredCourses(): Course[] {
    return this.courses;
  }

  openCourseDetails(course: Course): void {
    this.selectedCourse = course;
  }

  closeModal(): void {
    this.selectedCourse = null;
  }
}