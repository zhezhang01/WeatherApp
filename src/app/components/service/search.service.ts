import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import { HttpClient } from'@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  lat:number=0.0;
  lng:number=0.0;
  city:any;
  state:any;
  tomorrowJson=null;
  isOpen=false;
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  constructor(private http:HttpClient) {}

  toggle(tomorrowJson:any, lat:any, lng:any, city:any, state:any){
    this.tomorrowJson=tomorrowJson;
    console.log(this.tomorrowJson);
    this.lat=lat;
    this.lng=lng;
    this.city=city;
    this.state=state;
    this.isOpen=!this.isOpen;
    this.change.emit(this.isOpen);
  }



}
