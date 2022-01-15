import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FavserviceService {

  constructor() { }
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  lat:number=0.0;
  lng:number=0.0;
  city:any;
  state:any;
  is_fill:boolean=false;
  fav_list: any;
  toggle(lat:any,lng:any,city:any,state:any,star_fill:any){
    this.lat=lat;
    this.lng=lng;
    this.city=city;
    this.state=state;
    this.is_fill=star_fill;
    this.change.emit(this.is_fill);
  }
}