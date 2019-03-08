import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';

import { ChartComponent } from './components/chart/chart.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent
  ],
  imports: [ BrowserModule, HttpClientModule , FormsModule, ChartsModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
