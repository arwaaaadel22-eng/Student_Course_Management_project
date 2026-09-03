import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Courses } from './courses/courses';
import { Navbar } from './components/navbar/navbar';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminCourses } from './pages/admin-courses/admin-courses';
import { MyCourses } from './mycourses/mycourses';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { Notfound } from './notfound/notfound';

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
  ],

  imports: [BrowserModule, AppRoutingModule, FormsModule, CommonModule],

  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],

  bootstrap: [App],
})
export class AppModule {}
