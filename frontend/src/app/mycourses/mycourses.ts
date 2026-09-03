import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../services/enrolmentservice';
import { IEnrollment } from '../models/enrollment.model';
import { ConfirmService } from '../services/confirm.service';

@Component({
  selector: 'app-my-courses',
  standalone: false,
  styleUrl: './mycourses.css',
  templateUrl: './mycourses.html',
})
export class MyCourses implements OnInit {
  enrollments: IEnrollment[] = [];
  loading = true;
  errorMessage = '';
  cancellingId: string | null = null;

  constructor(
    private enrollmentService: EnrollmentService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEnrollments();
  }

  getEnrollments(): void {
    this.loading = true;
    this.errorMessage = '';
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (res: { enrollments: IEnrollment[]; }) => {
        this.enrollments = res.enrollments;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Unable to load your courses. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  async cancelEnrollment(id: string): Promise<void> {
    if (this.cancellingId) return;

    const confirmed = await this.confirmService.confirm(
      'Cancel this enrollment? This cannot be undone.',
      'Cancel enrollment'
    );
    if (!confirmed) return;

    this.cancellingId = id;
    this.enrollmentService.cancelEnrollment(id).subscribe({
      next: () => {
        this.enrollments = this.enrollments.filter(e => e._id !== id);
        this.cancellingId = null;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Unable to cancel this enrollment. Please try again.';
        this.cancellingId = null;
        this.cdr.markForCheck();
      }
    });
  }
}