import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Courses } from './courses/courses';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminCourses } from './pages/admin-courses/admin-courses';
import { MyCourses } from './mycourses/mycourses';
import { authGuard } from './guards/auth.guard';
import { Notfound } from './notfound/notfound';
const routes: Routes = [
  { path: 'login', component: Login },
  {path:'',component:Login},
  { path: 'register', component: Register },
  { path: 'courses', component: Courses, canActivate: [authGuard] },
  { path: 'mycourses', component: MyCourses, canActivate: [authGuard] },
  { path: 'admin/courses', component: AdminCourses, canActivate:[authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: '**', component: Notfound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
