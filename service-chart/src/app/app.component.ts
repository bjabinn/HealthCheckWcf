import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { Services } from './models/services';
import { Observable } from 'rxjs';
import { Service } from './models/service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  
    dataFromJson: any;
    services: Service[] = [];
    error: any;
    prefix:string = "TESCO";

    constructor(private dataService:DataService){
      // this.fillData();
      // setInterval(()=>this.fillData(),5000);  
      this.dataService.getJSON().subscribe(
        data => this.fillServices(data),
        error=> this.error = error.status===404 ? 
                  `Ups, algo ha ido mal intentando leer el json. ( File Not Found - ${error.status} )` 
                : "Ups, algo ha ido mal intentando leer el json. Http error: " +error.status 
      );
      
    }

    fillServices(data: Services): void {
      this.services = [];
      data.services.forEach(element => {
        element = element;
        element.notifyTimeout = false;
        this.services.push(element);
      });
    }

    // fillData(){
    //   let data = [];
    //   let visits = 10;
    //   for (let i = 1; i <= 4; i++) {
    //     visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    //     data.push({ 
    //         data: 5+i, 
    //        // name: "name" + i, value: visits 
    //       });
    //   }

    //   this.dataFromJson = data;
    //   console.log(this.dataFromJson);
    // }
}
