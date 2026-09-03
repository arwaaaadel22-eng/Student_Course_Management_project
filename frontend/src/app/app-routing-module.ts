import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Courses } from './courses/courses';
import { Profile } from './pages/profile/profile';
import { MyCourses } from './mycourses/mycourses';

const routes: Routes = [
  { path: 'courses', component: Courses },
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    component: Profile
  },
  {path:'mycourses', component: MyCourses}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
