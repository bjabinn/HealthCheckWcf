import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Services } from '../models/services';
 

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _jsonURL : string = "";
  private today : Date 
  private _jsonName : string;
  constructor(private http: HttpClient) { 
      this.today = new Date();
      const year = this.today.getFullYear().toString(); //+ this.today.getMonth() + this.today.getDay()).toString();    
      const month = ("0"+(this.today.getMonth()+1)).substr(-2);
      const day = ("0"+this.today.getDate()).substr(-2);      
      
      this._jsonName = `${year}${month}${day}`;
      this._jsonURL = `assets/${this._jsonName}.json`;
      
      
  }


  getJSON(): Observable<Services>{
    return this.http.get<Services>(this._jsonURL);
  }
}
