import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses';
import { Course } from '../../models/course.model';

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

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService
  ) {

    this.courseForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ],

      instructor: [
        '',
        Validators.required
      ],

      duration: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      price: [
        '',
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      capacity: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ]

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
        console.log(err);
      }
    });
  }

  // Create / Update
  saveCourse(): void {

    if (this.courseForm.invalid) {
      return;
    }

    const course: Course = this.courseForm.value;

    // Create
    if (!this.isEditing) {
      this.coursesService
        .createCourse(course)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            alert('Course created successfully');
            this.courseForm.reset();
            this.getCourses();
          },
          error: (err: any) => {
            console.log(err);
            alert('Error while creating course');
          }
        });
      return;
    }

    // Update
    if (this.selectedCourse?._id) {
      this.coursesService
        .updateCourse(
          this.selectedCourse._id,
          course
        )
        .subscribe({
          next: (res: any) => {
            console.log(res);
            alert('Course updated successfully');
            this.courseForm.reset();
            this.selectedCourse = null;
            this.isEditing = false;
            this.getCourses();
          },
          error: (err: any) => {
            console.log(err);
            alert('Error while updating course');
          }
        });
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
  deleteCourse(id: string | undefined): void {
    if (!id) {
      return;
    }

    const confirmDelete = confirm(
      'Are you sure you want to delete this course?'
    );

    if (!confirmDelete) {
      return;
    }

    this.coursesService
      .deleteCourse(id)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          alert('Course deleted successfully');
          this.getCourses();
        },
        error: (err: any) => {
          console.log(err);
          alert('Error while deleting course');
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