import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Courses } from './courses/courses';
import { Navbar } from './components/navbar/navbar';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminCourses } from './pages/admin-courses/admin-courses';
import { MyCourses } from './mycourses/mycourses';
import { Footer } from './footer/footer';
import { Notfound } from './notfound/notfound';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    App,
    Courses,
    Navbar,
    Profile,
    Login,
    Register,
    AdminCourses,
    MyCourses,
    Footer,
    Notfound,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [App],
})
export class AppModule {}