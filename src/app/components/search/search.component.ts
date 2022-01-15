import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { SearchForm } from "./searchForm";
import { SearchService } from '../service/search.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as $ from 'jquery';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { stripExtension } from '@angular/compiler-cli/src/ngtsc/file_system/src/util';
import {ResultTabComponent} from "../result-tab/result-tab.component";
import { FavserviceService } from '../service/favservice.service';
import axios from 'axios';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
import { MissionService } from '../service/mission.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(public httpClient: HttpClient,private searchService: SearchService,private favService: FavserviceService,private http:HttpClient,
    private missionService: MissionService) {
}

  @Input() resultComponent : ResultTabComponent=new ResultTabComponent(this.searchService,this.favService,this.http,this.missionService);
  form = SearchForm;
  tomorrowJson=null;
  pair_city:any;
  stateName: { [name: string]: string } = {
    AL: 'Alabama',
    AK: 'Alaska' ,
    AS: 'American Samoa',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District of Columbia',
    FL: 'Florida',
    GA: 'Georgia',
    GU: 'Guam',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    PR: 'Puerto Rico',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VI: 'Virgin Islands',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
  };
  
  formControl=new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  formControl0=new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  formControlState=new FormControl('', []);
  
  autoFilter: Observable<string[]>|undefined;

  @Output() childToParent01 = new EventEmitter<String>();
  clear(){
    this.childToParent01.emit();
    this.formControl.reset();
    this.formControl0.reset();
    // @ts-ignore
    document.getElementById('state').value="Select your state";
    this.form.autolocation="";
    this.form.isDisable="false";
    $("#city").removeAttr("disabled");
    $("#street").removeAttr("disabled");
    $("#state").removeAttr("disabled");
    $("#sub").attr({"disabled":"disabled"});
    this.resultComponent.set_init=false;
    this.resultComponent.loading=true;
    this.resultComponent.day_weather=[];
    this.resultComponent.data=[];
    this.resultComponent.data1=[];
    this.resultComponent.humidity=[];
    this.resultComponent.temperatures=[];
    this.resultComponent.pressures=[];
    this.resultComponent.winds=[];
  }
  change_Disable(){
    if(this.form.autolocation=="false"||this.form.autolocation==""){
      this.form.isDisable="true";
      $("#city").attr("disabled","disabled");
      $("#street").attr("disabled","disabled");
      $("#state").attr("disabled","disabled");
      $("#sub").removeAttr("disabled");
    }else{
      this.form.isDisable="false";
      $("#city").removeAttr("disabled");
      $("#street").removeAttr("disabled");
      $("#state").removeAttr("disabled");
      $("#sub").attr({"disabled":"disabled"});
    }
  }
  stateType = [
    "Select your state","Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida",
    "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
    "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", 'District of Columbia'
  ]

  ngOnInit(){
    this.formControl.valueChanges.subscribe(res=>this.self_initAutocomplete(res));
    this.formControlState.setValue("Select your state");
  }
  //Google api source code
  self_initAutocomplete(inputText:string){
    var autoCompleteService=new google.maps.places.AutocompleteService();
    autoCompleteService.getPlacePredictions({
      input: inputText,
      componentRestrictions: {country: 'US'},
      types: ['(cities)']
    },
    // @ts-ignore
    this.callBack.bind(this)
    );
  }
  callBack(result: AutocompletePrediction[], status: PlacesServiceStatus) {
    if (result == null){
      this.autoFilter = of([])
    }
    else{
      let citys = result.map(i => i.structured_formatting.main_text)
      let list = citys.filter((c, index) => {
        return citys.indexOf(c) === index;
      });
      this.pair_city = result.reduce((cname, sname) => ({...cname,
        [sname.structured_formatting.main_text]: sname.structured_formatting.secondary_text.split(',')[0]}), {})
      this.autoFilter = of(list)
    }

  }
  Fill_citys(event: MatAutocompleteSelectedEvent) {
    this.formControlState.setValue(this.stateName[this.pair_city[event.option.value]]);
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {'whitespace': true};
  }
  @HostListener('onSubmit') 
  onSubmit(){
    var self=this;
    this.resultComponent.set_init=true;
    this.childToParent01.emit();
    if((<HTMLInputElement>document.getElementById("button1")).checked==true){
      const url = "https://ipinfo.io/?token=253cf24beef722";
      this.http.get(url).subscribe((response:any)=>{
        const jsonData=response.loc;
        var str=jsonData.split(",");
        let lat=parseFloat(str[0]);
        let lng=parseFloat(str[1]);
        self.http.get("https://zhangzhe04.wl.r.appspot.com/getAPIResponse"+"/?location="+lat+","+lng).subscribe((data:any)=>{
          self.tomorrowJson=data;
          self.searchService.toggle(self.tomorrowJson, lat, lng, response.city, response.region);
        })
      })
    }else{
      const street=(<HTMLInputElement>document.getElementById("street")).value;
      const city=(<HTMLInputElement>document.getElementById("city")).value;
      const state=(<HTMLInputElement>document.getElementById("state")).value;
      const url="https://maps.googleapis.com/maps/api/geocode/json?address="+street+"+"+city+"+"+state+"&key=AIzaSyDHsyWyLVRF6HsMoiADtUaHviXwquJk1Do";
      axios.get(url)
      .then(function(response:any){
        let lat=response.data.results[0].geometry.location.lat;
        let lng=response.data.results[0].geometry.location.lng;
        self.http.get("https://zhangzhe04.wl.r.appspot.com/getAPIResponse"+"/?location="+lat+","+lng).subscribe((data:any)=>{
        self.tomorrowJson=data;
        self.searchService.toggle(self.tomorrowJson, lat, lng, city, state);
        })
      })
      .catch(function(error){
        self.resultComponent.tomorrowJson=null;
        self.resultComponent.loading=false;
        console.log(error);
      })
    }

  }

}
