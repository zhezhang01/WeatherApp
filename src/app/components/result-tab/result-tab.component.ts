import { Component, ElementRef, EventEmitter, HostBinding, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { SearchService } from '../service/search.service';
import { FavserviceService } from '../service/favservice.service';
import * as Highcharts from 'highcharts';
import { Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {MissionService} from '../service/mission.service';
import { Subscription } from 'rxjs';
import {list} from '../favorite/favList'

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let WindBard = require('highcharts/modules/windbarb');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
WindBard(Highcharts);

@Component({
  selector: 'app-result-tab',
  templateUrl: './result-tab.component.html',
  styleUrls: ['./result-tab.component.scss']
})
export class ResultTabComponent implements OnInit {

  constructor(private searchService: SearchService, private favService: FavserviceService,private http:HttpClient
    ,private missionService: MissionService) {
        this.subscription = missionService.missionAnnounced$.subscribe(
            mission => {
              this.fav_list = mission;
          });
   }

  subscription: Subscription;

  fav_list : list[] = [];
  tomorrowJson=null;
  loading: Boolean = true;
  set_init: Boolean = false;
  resultJson:any;
  isDetail:boolean=false;
  day_weather:any=[];
  data:(string|number)[][]=[];
  data1:string[]=[];
  humidity:Record<any, any>[]=[];
  winds:Record<any, any>[]=[];
  temperatures:Record<any, any>[]=[];
  Sun_Rise_Time:any;
  Sun_Set_Time:any;
  Wet:any;
  WindSpeed:any;
  Visibility:any;
  CloudCover:any;
  pressures:Record<any, any>[]=[];
  statue:any;
  Max_Temperature:any;
  Min_Temperature:any;
  Exact_Temperature:any;
  Moon_phase:any;
  title:any;
  @HostBinding('class.is-open')
  isOpen = false;
  lat:any;
  lng:any;
  city:any;
  state:any;
  star_fill:boolean=false;

  @ViewChild('init_select') init_select: ElementRef<HTMLElement> | undefined;
  @ViewChild('detail_table') detail_table: ElementRef<HTMLElement> | undefined;
  @ViewChild('init_button') init_button: ElementRef<HTMLElement> | undefined;
  ngOnInit(): void {
    this.searchService.change.subscribe(isOpen => {
      this.isOpen = isOpen;
      this.tomorrowJson=this.searchService.tomorrowJson;
      // @ts-ignore
      let el1: HTMLElement = this.init_select.nativeElement;
      el1.click();
      if(this.detail_table?.nativeElement.classList.contains("active")){
        // @ts-ignore
        let el2: HTMLElement = this.init_button.nativeElement;
        el2.click();
      }
      this.format_convert(this.tomorrowJson);
      this.show_Dailychart(this.tomorrowJson);
      this.show_hourlyChart(this.tomorrowJson);
      this.resultJson=this.tomorrowJson;
      this.lat=this.searchService.lat;
      this.lng=this.searchService.lng;
      this.city=this.searchService.city;
      this.state=this.searchService.state;
      this.initMap();
      this.loading=false;
    });
  }
  public options: any = {
    chart: {
      renderTo: 'highcharts-figure',
      type: 'arearange',
      zoomType: 'x',
      scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
      }
    },
    title: {
        text: 'Temperature Ranges (Min,Max)'
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: null
        }
    },
    tooltip: {
        crosshairs:[{
            enabled:true,
            width:1,
            color:'gray'
        }],
        shared: false,
        valueSuffix: '°F',
        xDateFormat: '%A, %b %e'
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Temperatures',
        data: [],
        lineColor: '#e9a21f',
        fillColor: {
            linearGradient: {x1: 0, y1: 0.1, x2: 0, y2: 0.9},
            stops: [
            [0, '#ffa702'],
            [1, '#a8d8f8']
        ]
        },
    }]
  }
  public hour_options: any = {
    chart: {
        renderTo: 'highcharts-figure1',
        marginBottom: 70,
        marginRight: 40,
        marginTop: 50,
        plotBorderWidth: 1,
        height: 400,
        alignTicks: false,
        scrollablePlotArea: {
            minWidth: 720
        }
    },

    defs: {
        patterns: [{
            id: 'precipitation-error',
            path: {
                d: [
                    'M', 3.3, 0, 'L', -6.7, 10,
                    'M', 6.7, 0, 'L', -3.3, 10,
                    'M', 10, 0, 'L', 0, 10,
                    'M', 13.3, 0, 'L', 3.3, 10,
                    'M', 16.7, 0, 'L', 6.7, 10
                ].join(' '),
                stroke: '#68CFE8',
                strokeWidth: 1
            }
        }]
    },

    title: {
        text: 'Hourly Weather (For Next 5 Days)',
        align: 'center',
        style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        }
    },

    credits: {
        text: 'Forecast from <a href="https://yr.no">yr.no</a>',
        href: 'https://yr.no',
        position: {
            x: -40
        }
    },

    tooltip: {
        shared: true,
        useHTML: true,
        headerFormat:
            '<small>{point.x:%A, %b %e, %H:%M}</small><br>' +
            '<b>{point.point.symbolName}</b><br>'

    },

    xAxis: [{ // Bottom X axis
        type: 'datetime',
        tickInterval: 2 * 36e5, // two hours
        minorTickInterval: 36e5, // one hour
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)',
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        offset: 30,
        showLastLabel: true,
        labels: {
            format: '{value:%H}'
        },
        crosshair: true
    }, { // Top X axis
        linkedTo: 0,
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        labels: {
            format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
            align: 'left',
            x: 3,
            y: -5
        },
        opposite: true,
        tickLength: 20,
        gridLineWidth: 1
    }],

    yAxis: [{ // temperature axis
        title: {
            text: null
        },
        labels: {
            format: '{value}°',
            style: {
                fontSize: '10px'
            },
            x: -3
        },
        plotLines: [{ // zero plane
            value: 0,
            color: '#BBBBBB',
            width: 1,
            zIndex: 2
        }],
        maxPadding: 0.3,
        minRange: 8,
        tickInterval: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)'

    }, { // precipitation axis
        title: {
            text: null
        },
        labels: {
            enabled: false
        },
        gridLineWidth: 0,
        tickLength: 0,
        minRange: 10,
        min: 0

    }, { // Air pressure
        allowDecimals: false,
        title: { // Title on top of axis
            text: 'inHG',
            offset: 0,
            align: 'high',
            rotation: 0,
            style: {
                fontSize: '10px',
                color: '#ecb743'
            },
            textAlign: 'left',
            x: 3
        },
        labels: {
            style: {
                fontSize: '8px',
                color: '#e9a21f'
            },
            y: 2,
            x: 3
        },
        gridLineWidth: 0,
        opposite: true,
        showLastLabel: false
    }],

    legend: {
        enabled: false
    },

    plotOptions: {
        column: {
            dataLabels: {
                 enabled: true,
                 pointFormat: '{point.y:,.0f}'
             }
        },
        series: {
            pointPlacement: 'between'
        }
    },


    series: [{
        name: 'Temperature',
        data: [],
        type: 'spline',
        marker: {
            enabled: false,
            states: {
                hover: {
                    enabled: true
                }
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}: <b>{point.y:,.0f}°F</b><br/>'
        },
        zIndex: 1,
        color: '#FF3333',
        negativeColor: '#48AFE8'
    },{
        name: 'Humidity',
        data: [],
        type: 'column',
        color: '#68CFE8',
        yAxis: 1,
        groupPadding: 0,
        pointPadding: 0,
        grouping: false,
        dataLabels: {
            filter: {
                operator: '>',
                property: 'y',
                value: 0
            },
            style: {
                fontSize: '8px',
                color: 'gray'
            }
        },
        tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}: <b>{point.y:,.0f} %</b><br/>'
        }
    }, {
        name: 'Air pressure',
        color: '#ecb743',
        data: [],
        marker: {
            enabled: false
        },
        shadow: false,
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}: <b>{point.y:,.0f} inHG</b><br/>'
            },
        dashStyle: 'shortdot',
        yAxis: 2
    }, {
        name: 'Wind',
        type: 'windbarb',
        id: 'windbarbs',
        color: 'red',
        lineWidth: 1.5,
        data: [],
        vectorLength: 13,
        xOffset: -5,
        yOffset: -15,
        tooltip: {
            valueSuffix: ' mph'
        }
    }]
  }
  starFilled(){
    return this.fav_list.findIndex(i => i.city === this.city) === -1;
  }
  format_convert(row_data:any){
    for(let i=0;i<15;i++){
      this.day_weather.push({
      startTime : this.transformTimestamp(row_data.data.timelines[0].intervals[i].startTime),
      weather_text : this.getWeather_icon(row_data.data.timelines[0].intervals[i].values.weatherCode).get(row_data.data.timelines[0].intervals[i].values.weatherCode)[0],
      weather_url : this.getWeather_icon(row_data.data.timelines[0].intervals[i].values.weatherCode).get(row_data.data.timelines[0].intervals[i].values.weatherCode)[1],
      Temp_high : row_data.data.timelines[0].intervals[i].values.temperatureMax,
      Temp_low : row_data.data.timelines[0].intervals[i].values.temperatureMin,
      windSpeed : row_data.data.timelines[0].intervals[i].values.windSpeed}
      );
    }
  }
  show_Dailychart(row_data:any){
    for(let i=0;i<=14;i++){
      var max=parseFloat(row_data.data.timelines[0].intervals[i].values.temperatureMax.toFixed(2));
      var min=parseFloat(row_data.data.timelines[0].intervals[i].values.temperatureMin.toFixed(2));
      this.data.push([this.transformTimestamp3(row_data.data.timelines[0].intervals[i].startTime),min,max]);
      this.data1.push(this.transformTimestamp2(row_data.data.timelines[0].intervals[i].startTime));
    }
    this.options.series[0].data=this.data;
    this.options.xAxis.categories=this.data1;
    Highcharts.chart('daily_container', this.options);
  }
  show_Detail(div_num:any){
    this.isDetail=true;
    this.title=this.transformTimestamp(this.resultJson.data.timelines[0].intervals[div_num].values.sunriseTime);
    this.statue=this.getWeather_icon(this.resultJson.data.timelines[0].intervals[div_num].values.weatherCode).get(this.resultJson.data.timelines[0].intervals[div_num].values.weatherCode)[0];
    this.Max_Temperature=this.resultJson.data.timelines[0].intervals[div_num].values.temperatureMax;
    this.Min_Temperature=this.resultJson.data.timelines[0].intervals[div_num].values.temperatureMin;
    this.Exact_Temperature=this.resultJson.data.timelines[0].intervals[div_num].values.temperature;
    this.Sun_Rise_Time=this.transformTimestamp4(this.resultJson.data.timelines[0].intervals[div_num].values.sunriseTime);
    this.Sun_Set_Time=this.transformTimestamp4(this.resultJson.data.timelines[0].intervals[div_num].values.sunsetTime);
    this.Wet=this.resultJson.data.timelines[0].intervals[div_num].values.humidity;
    this.WindSpeed=this.resultJson.data.timelines[0].intervals[div_num].values.windSpeed;
    this.Visibility=this.resultJson.data.timelines[0].intervals[div_num].values.visibility;
    this.CloudCover=this.resultJson.data.timelines[0].intervals[div_num].values.cloudCover;
    this.Moon_phase=this.resultJson.data.timelines[0].intervals[div_num].values.moonPhase;
  }
  show_hourlyChart(row_data:any){
    var jsonLength=0;
    for(var item in row_data.data.timelines[1].intervals){
        jsonLength++;
    }
    for(let i=0;i<jsonLength;i++){
        var startTime = row_data.data.timelines[1].intervals[i].startTime;
        var normal_date:any = new Date(startTime);
        var timestamp = Date.parse(normal_date);
        if(i%2===0){
            this.winds.push({
                x: timestamp,
                value: row_data.data.timelines[1].intervals[i].values.windSpeed,
                direction: row_data.data.timelines[1].intervals[i].values.windDirection
            });
        }
        this.pressures.push({x:timestamp,y:row_data.data.timelines[1].intervals[i].values.pressureSeaLevel});
        this.temperatures.push({x:timestamp,y:row_data.data.timelines[1].intervals[i].values.temperature});
        this.humidity.push({x:timestamp,y:row_data.data.timelines[1].intervals[i].values.humidity});
    }
    this.hour_options.series[0].data=this.temperatures;
    this.hour_options.series[1].data=this.humidity;
    this.hour_options.series[2].data=this.pressures;
    this.hour_options.series[3].data=this.winds;
    Highcharts.chart('hourly_container', this.hour_options);
  }
  initMap(): void {
    // The location of Uluru
    const location = { lat: this.lat, lng: this.lng };
    // The map, centered at Uluru
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 12,
        center: location,
      }
    );
  
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  }
  @HostListener('city_restore') 
  city_restore(){
      this.star_fill=!this.star_fill;
      this.favService.toggle(this.lat, this.lng, this.city, this.state, this.star_fill);
  }
  transformTimestamp(timestamp:any){
    let a = new Date(timestamp).getTime();
    var date = new Date(a);
    var M = date.getMonth()+1;
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
    var weekDay = date.getDay();
    var weekDayString;
    var MM;
    if(weekDay == 1){
        weekDayString = "Monday";
    }else if(weekDay == 2) {
        weekDayString = "Tuesday";
    }else if(weekDay == 3) {
        weekDayString = "Wednesday";
    }else if(weekDay == 4) {
        weekDayString = "Thursday";
    }else if(weekDay == 5) {
        weekDayString = "Friday";
    }else if(weekDay == 6) {
        weekDayString = "Saturday";
    }else if(weekDay == 0) {
        weekDayString = "Sunday";
    }
    if(M == 1){
      MM = "Jan";
    }else if(M == 2) {
      MM = "Feb";
    }else if(M == 3) {
      MM = "Mar";
    }else if(M == 4) {
      MM = "Apr";
    }else if(M == 5) {
      MM = "May";
    }else if(M == 6) {
      MM = "Jun";
    }else if(M == 7) {
      MM = "Jul";
    }else if(M == 8) {
      MM = "Aug";
    }else if(M == 9) {
      MM = "Sep";
    }else if(M == 10) {
      MM = "Oct";
    }else if(M == 11) {
      MM = "Nov";
    }else if(M == 12) {
      MM = "Dec";
    }
    var dateString = weekDayString+','+D+' '+MM+' 2021';
    return dateString;
  }
  getWeather_icon(weatherCode:any){
    let myMap = new Map();
    if(weatherCode=='1000'){
        myMap.set(weatherCode, ["clear", "assets/images/clear_day.svg"]); 
    }else if(weatherCode=='1100'){
        myMap.set(weatherCode, ["Mostly Clear", "assets/images/mostly_clear_day.svg"]); 
    }else if(weatherCode=='1101'){
        myMap.set(weatherCode, ["Partly Cloudy", "assets/images/partly_cloudy_day.svg"]);
    }else if(weatherCode=='1102'){
        myMap.set(weatherCode, ["Mostly Cloudy", "assets/images/mostly_cloudy.svg"]);
    }else if(weatherCode=='1001'){
        myMap.set(weatherCode, ["Cloudy", "assets/images/cloudy.svg"]);
    }else if(weatherCode=='2000'){
        myMap.set(weatherCode, ["Fog", "assets/images/fog.svg"]);
    }else if(weatherCode=='2100'){
        myMap.set(weatherCode, ["Light Fog", "assets/images/fog_light.svg"]);
    }else if(weatherCode=='8000'){
        myMap.set(weatherCode, ["Thunderstorm", "assets/images/tstorm.svg"]);
    }else if(weatherCode=='5001'){
        myMap.set(weatherCode, ["Flurries", "assets/images/flurries.svg"]);
    }else if(weatherCode=='5100'){
        myMap.set(weatherCode, ["Light Snow", "assets/images/snow_light.svg"]);
    }else if(weatherCode=='5000'){
        myMap.set(weatherCode, ["Snow", "assets/images/snow.svg"]);
    }else if(weatherCode=='5101'){
        myMap.set(weatherCode, ["Heavy Snow", "assets/images/snow_heavy.svg"]);
    }else if(weatherCode=='7102'){
        myMap.set(weatherCode, ["Light Ice Pellets", "assets/images/ice_pellets_light.svg"]);
    }else if(weatherCode=='7000'){
        myMap.set(weatherCode, ["Ice Pellets", "assets/images/ice_pellets.svg"]);
    }else if(weatherCode=='7101'){
        myMap.set(weatherCode, ["Heavy Ice Pellets", "assets/images/ice_pellets_heavy.svg"]);
    }else if(weatherCode=='4000'){
        myMap.set(weatherCode, ["Drizzle", "assets/images/drizzle.svg"]);
    }else if(weatherCode=='6000'){
        myMap.set(weatherCode, ["Freezing Drizzle", "assets/images/freezing_drizzle.svg"]);
    }else if(weatherCode=='6200'){
        myMap.set(weatherCode, ["Light Freezing Rain", "assets/images/freezing_rain_light.svg"]);
    }else if(weatherCode=='6001'){
        myMap.set(weatherCode, ["Freezing Rain", "assets/images/freezing_rain.svg"]);
    }else if(weatherCode=='6201'){
        myMap.set(weatherCode, ["Heavy Freezing Rain", "assets/images/freezing_rain_heavy.svg"]);
    }else if(weatherCode=='4200'){
        myMap.set(weatherCode, ["Light Rain", "assets/images/rain_light.svg"]);
    }else if(weatherCode=='4001'){
        myMap.set(weatherCode, ["Rain", "assets/images/rain.svg"]);
    }else if(weatherCode=='3000'){
        myMap.set(weatherCode, ["Light Wind", "assets/images/light_wind.svg"]);
    }else if(weatherCode=='3001'){
        myMap.set(weatherCode, ["Wind", "assets/images/wind.svg"]);
    }else if(weatherCode=='3002'){
        myMap.set(weatherCode, ["Strong Wind", "assets/images/strong_wind.svg"]);
    }else{
        myMap.set(weatherCode, ["Heavy Rain", "assets/images/rain_heavy.svg"]);
    }
    return myMap;
  }
  transformTimestamp2(timestamp:any){
    let a = new Date(timestamp).getTime();
    var date = new Date(a);
    var M = date.getMonth()+1;
    var MM;
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
    if(M == 1){
        MM = "Jan";
    }else if(M == 2) {
        MM = "Feb";
    }else if(M == 3) {
        MM = "Mar";
    }else if(M == 4) {
        MM = "Apr";
    }else if(M == 5) {
        MM = "May";
    }else if(M == 6) {
        MM = "Jun";
    }else if(M == 7) {
        MM = "Jul";
    }else if(M == 8) {
        MM = "Aug";
    }else if(M == 9) {
        MM = "Sep";
    }else if(M == 10) {
        MM = "Oct";
    }else if(M == 11) {
        MM = "Nov";
    }else if(M == 12) {
        MM = "Dec";
    }
    var dateString = D+' '+MM;
    return dateString;
  }
  transformTimestamp3(timestamp:any){
    let a = new Date(timestamp).getTime();
    var weekDayString;
    var MM;
    var date = new Date(a);
    var M = date.getMonth()+1;
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
    var weekDay = date.getDay();
    if(weekDay == 1){
        weekDayString = "Monday";
    }else if(weekDay == 2) {
        weekDayString = "Tuesday";
    }else if(weekDay == 3) {
        weekDayString = "Wednesday";
    }else if(weekDay == 4) {
        weekDayString = "Thursday";
    }else if(weekDay == 5) {
        weekDayString = "Friday";
    }else if(weekDay == 6) {
        weekDayString = "Saturday";
    }else if(weekDay == 0) {
        weekDayString = "Sunday";
    }
    if(M == 1){
        MM = "Jan";
    }else if(M == 2) {
        MM = "Feb";
    }else if(M == 3) {
        MM = "Mar";
    }else if(M == 4) {
        MM = "Apr";
    }else if(M == 5) {
        MM = "May";
    }else if(M == 6) {
        MM = "Jun";
    }else if(M == 7) {
        MM = "Jul";
    }else if(M == 8) {
        MM = "Aug";
    }else if(M == 9) {
        MM = "Sep";
    }else if(M == 10) {
        MM = "Oct";
    }else if(M == 11) {
        MM = "Nov";
    }else if(M == 12) {
        MM = "Dec";
    }
    var dateString = weekDayString+','+MM+' '+D;
    return dateString;
}
  transformTimestamp4(timestamp:any){
    let a = new Date(timestamp).getTime();
    var date = new Date(a);
    var hour=date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours();
    var minute=date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes();
    var seconds=date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds();
    var resultString=hour+":"+minute+":"+seconds;
    return resultString;
  }

}
