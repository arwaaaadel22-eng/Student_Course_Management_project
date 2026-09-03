import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Courses } from './courses/courses';
import { Navbar } from './components/navbar/navbar';
import { Profile } from './pages/profile/profile';
import { MyCourses } from './mycourses/mycourses';

@NgModule({
  declarations: [App, Courses, Navbar, Profile, MyCourses],

  imports: [BrowserModule, AppRoutingModule, FormsModule],

  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],

  bootstrap: [App],
})
export class AppModule {}
