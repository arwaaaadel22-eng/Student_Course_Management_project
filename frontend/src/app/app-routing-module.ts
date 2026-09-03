import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Courses } from './courses/courses';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminCourses } from './pages/admin-courses/admin-courses';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'courses', component: Courses },
  { path: 'admin/courses', component: AdminCourses },
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    component: Profile
  },
  { path: '**', redirectTo: 'courses' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
