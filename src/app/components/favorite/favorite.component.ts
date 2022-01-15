import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FavserviceService } from '../service/favservice.service';
import { ResultTabComponent } from "../result-tab/result-tab.component";
import { SearchService } from '../service/search.service';
import {MissionService} from '../service/mission.service';
import {list} from './favList'

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})

export class FavoriteComponent implements OnInit {
  tomorrowJson=null;
  lat:number=0.0;
  lng:number=0.0;
  city:any;
  state:any;
  fav_list: list[] = [];
  @HostBinding('class.is-fill')
  isFill = false;
  curCity:list={
    city: '',
    state: '',
    lat: 0,
    lng: 0
  };
  constructor(private favService: FavserviceService,private searchService: SearchService,private http:HttpClient, private missionService: MissionService) {
    this.init_localStorage();
   }
  @Input() reloadComponent : ResultTabComponent=new ResultTabComponent(this.searchService,this.favService,this.http,this.missionService);

  ngOnInit(): void {
    // this.init_localStorage();
    this.favService.change.subscribe(isFill => {
      this.lat=this.favService.lat;
      this.lng=this.favService.lng;
      this.city=this.favService.city;
      this.state=this.favService.state;
      this.isFill=isFill;
      this.AddtofavList();
    });
  }

  announce() {
    this.missionService.announceMission(this.fav_list);
  }

  init_localStorage(){
    let temp=localStorage.getItem("test");
    if(temp!=null){
      let obj=JSON.parse(temp);
      for(let i of obj){
        this.fav_list.push(i);
      }
    }
    this.announce();
  }
  AddtofavList(){
    if(this.isstarFilled(this.city)==true){
      this.curCity.city=this.city;
      this.curCity.state=this.state;
      this.curCity.lat=this.lat;
      this.curCity.lng=this.lng;
      this.fav_list.push({city:this.city, state:this.state,lat:this.lat,lng:this.lng});
      localStorage.setItem("test", JSON.stringify(this.fav_list));
    }else{
      this.fav_list=this.fav_list.filter(i=>i.city!==this.city);
      localStorage.setItem("test", JSON.stringify(this.fav_list));
    }
    this.announce();
  }
  @Output() childToParent = new EventEmitter<String>();
  show_favorite(index:number){
    this.childToParent.emit();
    this.reloadComponent.set_init=true;
    this.reloadComponent.loading=true;
    this.reloadComponent.day_weather=[];
    this.reloadComponent.data=[];
    this.reloadComponent.data1=[];
    this.reloadComponent.humidity=[];
    this.reloadComponent.temperatures=[];
    this.reloadComponent.pressures=[];
    this.reloadComponent.winds=[];
    var lat=this.fav_list[index].lat;
    var lng=this.fav_list[index].lng;
    var city=this.fav_list[index].city;
    var state=this.fav_list[index].state;
    this.http.get("https://zhangzhe04.wl.r.appspot.com/getAPIResponse"+"/?location="+lat+","+lng).subscribe((data:any)=>{
      this.tomorrowJson=data;
      this.searchService.toggle(this.tomorrowJson, lat, lng, city, state);
    })
  }
  isstarFilled(city: string) {
    return this.fav_list.findIndex(i => i.city === city) === -1;
  }
  remove_byIcon(city:string){
    this.fav_list=this.fav_list.filter(i=>i.city!==city);
    localStorage.setItem("test", JSON.stringify(this.fav_list));
    this.announce();
  }
}
