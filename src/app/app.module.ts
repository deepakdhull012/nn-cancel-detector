import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientTableComponent } from './components/patient-table/patient-table.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from "@angular/material/button"
import { MatProgressBarModule } from "@angular/material/progress-bar"


@NgModule({
  declarations: [
    AppComponent,
    PatientTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ScrollingModule,
    MatButtonModule,
    MatProgressBarModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
