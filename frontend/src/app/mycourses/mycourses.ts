import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Enrolmentservice } from '../services/enrolmentservice';
import { IEnrollment } from '../models/enrollment.model';

@Component({
  selector: 'app-my-courses',
  standalone: false,
  styleUrl: './mycourses.css',
  templateUrl: './mycourses.html',
})
export class MyCourses implements OnInit {
  enrollments: IEnrollment[] = []
  loading = true
  cancellingid: string | null = null

  constructor(
    private enrollmentservice: Enrolmentservice,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.enrollmentservice.getmyenrollments().subscribe({
      next: (res) => {
        this.enrollments = res.enrollments
        this.loading = false
        this.cd.detectChanges()
      },
      error: (err) => {
        console.log(err)
        this.loading = false
        this.cd.detectChanges()
      }
    })
  }

  cancelenrollment(id: string):void {
    if (this.cancellingid) return

    this.cancellingid = id
    this.enrollmentservice.cancelenrollment(id).subscribe({
      next: () => {
        
        this.enrollments = this.enrollments.filter(e => e._id !== id)
        this.cancellingid = null
        this.cd.detectChanges()
      },
      error: (err) => {
        console.log(err)
        this.cancellingid = null
        this.cd.detectChanges()
      }
    })
  }
}