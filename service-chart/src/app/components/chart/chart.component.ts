import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit, ElementRef, AfterViewChecked } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable, of } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { DataSeries, chartColors } from 'src/app/models/data-series';
import * as annotationsPlugin from 'chartjs-plugin-annotation';
import { Service } from 'src/app/models/service';
import { DataService } from 'src/app/services/data.service';
import { ResponseModel } from 'src/app/models/response-model';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements AfterViewInit,AfterViewChecked {
  ngAfterViewChecked(): void {  
  }
  
  @Input()
  serviceData: Service;

  @Input()
  intervalSeconds: number;

  @Input()
  titlePrefix: string;

  public secondsForInterval: number = 5;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,   
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          id: 'responsetime',
          type: 'linear',
          position: 'left',
          ticks: {        
            min: 0,  
            max: 600,
          },
          scaleLabel: {
            display: true,
            labelString: 'Response time (ms)',
          },         
        }     
      ],
      xAxes: [{
        gridLines: {
          display:false,
        },
        maxBarThickness : 80
      }]
    },
    tooltips: {
      mode: 'index',
      position: 'nearest',
      intersect: false,
    },
    animation: {
      duration: 800,
    },
    hover: {
      intersect: false,
    },
    annotation: {
      annotations: [      
      ]
    }
  };
  public barChartLabels: string[] = [];
  public barChartData = [];
  public barChartDataTemp = [];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartColors;
  public canvasWidth: number = null;
  public canvasHeight: number = null;
  public newResponseValueFromJson: Response;

  private _jsonURL : string;
  private _jsonName : string;
  private today : Date ;
  private answer : number;
  private service;
 
  @ViewChild(BaseChartDirective) ch: BaseChartDirective;
  @ViewChild('canvas') canvas : ElementRef;
  @ViewChild('serviceBox') serviceBox: ElementRef;

  dataSeries: DataSeries[] = [
    {
      index: 0,
      axisId: 'responsetime',
      colorName: 'green',
      label: 'Response time (ms)',
      units: 'fahrenheit',
      activeInBypassMode: true,
    },
  ];

  constructor(private dataService: DataService) {
    Chart.pluginService.register(annotationsPlugin);
    this.initDataSeries();  
  }

  ngOnInit() {    
    //seconds to wait for every request
    this.refreshData(this.intervalSeconds);
  }

  ngAfterViewInit(): void {  
    this.ch.chart.update();
  }

  refreshData(seconds:number){
    setInterval(()=>{

      this.serviceData.notifyTimeout = false;

      this.dataService.getJSON().subscribe(data=>{
          this.service = data.services.find(x => x.title == this.serviceData.title);
          console.log(this.service.responses[0].Time);
          //this.service.addHeader("Access-Control-Allow-Origin", "*");

          if(this.service){
            const responsesToUpdate = this.service.responses;            
            this.checkResponsesInLocalStorageAndUpdate(this.service);
          }
      });

      this.today = new Date(); 

      //this._jsonName = `${year}${month}${day}`;
      this._jsonName = `test`;
      this._jsonURL = "assets/test.json";


      // ---***** MOCKING DATA TO UPDATE CHART -- TO BE COMMENTED IN PROD ******----
      const minutes = this.service.responses[0].Date.substr(14,2);
      const nowSeconds = this.service.responses[0].Date.substr(17, 2);
      const hour = this.service.responses[0].Date.substr(11, 2);
      const hourTimeString = `${hour}:${minutes}:${nowSeconds}`;

      this.answer = this.service.responses[0].Time;      

      if(this.answer > 15000){
        this.serviceData.notifyTimeout = true;
      }else{
        this.barChartData[0].data.push(this.answer);
      }

      this.barChartLabels.push(hourTimeString);

      if(this.answer > 549){
        //Change options to add annotations
        this.setBarChartOptionsAnnotations();
      }

      //this.ch.chart.config.data.options = this.barChartOptions;   
      this.ch.chart.update();
      // [END]  ---***** MOCKING DATA TO UPDATE CHART -- COMMENTED IN PROD ******----
    }, seconds*1000);
  }

  private setBarChartOptionsAnnotations() {
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            id: 'responsetime',
            type: 'linear',
            position: 'left',
            ticks: {
              min: 0,
              max: this.service.responses.Timeout
            },
            scaleLabel: {
              display: true,
              labelString: 'Response time (ms)',
            },
          }
        ],
        xAxes: [{
          gridLines: {
            display: false,
          },
          maxBarThickness: 40
        }]
      },
      tooltips: {
        mode: 'index',
        position: 'nearest',
        intersect: false,
      },
      animation: {
        duration: 0,
      },
      hover: {
        intersect: false,
      },
      annotation: {
        annotations: [
          // {
          //   type: 'line',
          //   mode: 'horizontal',
          //   scaleID: 'responsetime',
          //   value: '2500',
          //   borderColor: 'orange',
          //   borderWidth: 1,
          //   label: {
          //     enabled: true,
          //     fontColor: 'orange',
          //     content: 'Slow response'
          //   }
          // },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'responsetime',
            value: this.service.responses.Timeout,
            yAxisID: 'Oil',
            borderColor: 'red',
            borderWidth: 1,
            label: {
              enabled: true,
              fontColor: 'red',
              content: 'Timeout'
            }
          },
        ]
      }
    };
  }

  checkResponsesInLocalStorageAndUpdate(service: Service): any {
    const exists: boolean = localStorage.getItem(service.title) !== null;

    if (exists) {
      console.log("EXISTS---> ",service);
      
      this.iterateResponsesAndUpdate(service);
      
    } else {
      console.log("NOT EXISTS--->", service);
      
      const lastElement = service.responses[service.responses.length-1];
      let lastElementArray = [];
      lastElementArray.push(lastElement);

      let newObject: Service = {
        title: service.title,
        intervalSeconds: service.intervalSeconds,
        responses: lastElementArray,
        notifyTimeout: false
      }

      localStorage.setItem(service.title, JSON.stringify(newObject));
      
    }
  }


  getDateModelFromJson(date: string): any {
    const dateString = date.split(" ")[0];
    const timeString = date.split(" ")[1];

    const splittedDateString = dateString.split("/");
    const day =  +splittedDateString[0];
    const month = +splittedDateString[1];
    const year = +splittedDateString[2];

    const splittedTimeString = timeString.split(":");
    const hour = +splittedTimeString[0];
    const minute = +splittedTimeString[1];
    const seconds = +splittedTimeString[2];
    
    return new Date(year,month,day,hour,minute,seconds)
  }

  iterateResponsesAndUpdate(service: Service): any {
    const lastItemStored: Service = JSON.parse(localStorage.getItem(service.title));
    const lastDateStored =  this.getDateModelFromJson(lastItemStored.responses[0].Date);

    const responsesArrayToPush: ResponseModel[] = [];



    for (let i = 0; i < service.responses.length; i++) {

      const iteratedDate = this.getDateModelFromJson(service.responses[i].Date);

      //If response date from JSON of the Service is different and greater than the last one we have stored in localStorage
      if (iteratedDate !== lastDateStored && iteratedDate > lastDateStored) {
        responsesArrayToPush.push(service.responses[i]);
      }
    }

    //New responses to push in chart and localStorage
    if(responsesArrayToPush.length > 0){
    
      if(responsesArrayToPush.length > 1){
        responsesArrayToPush.forEach(response => {
            this.barChartData[0].data.push(response.Time); 
            this.barChartLabels.push(response.Date);

        });

        const lastElement = responsesArrayToPush[responsesArrayToPush.length-1];
        let lastElementArray = [];
        lastElementArray.push(lastElement);

        let newObject: Service = {
          title: service.title,
          intervalSeconds: service.intervalSeconds,
          responses: lastElementArray,
          notifyTimeout: false
        }
      
        localStorage.setItem(service.title , JSON.stringify(newObject));
        //this.ch.chart.config.data.options = this.barChartOptions;
        this.ch.chart.update();
      }else{

        let newObject: Service = {
          title: service.title,
          intervalSeconds: service.intervalSeconds,
          responses: responsesArrayToPush,
          notifyTimeout: false
        }

        localStorage.setItem(service.title , JSON.stringify(newObject));

      }
    }
  }

  initDataSeries() {
    // This is an ugly hack in ng2-charts, line colors will not work without this:
    this.barChartColors = this.dataSeries.map(r => ({
      backgroundColor: chartColors[r.colorName]
    }));

    this.barChartData = this.dataSeries.map(r => ({
      data: [],
      label: r.label,
      yAxisID: r.axisId,
      pointRadius: 0,
      pointBorderWidth: 1,
      pointHoverRadius: 1,
      pointHoverBorderWidth: 2,
      pointHitRadius: 1,
      borderWidth: 1,
      fill: false,
      borderColor: chartColors[r.colorName], // ...and this...
    }));

    this.barChartDataTemp = this.dataSeries.map(r => ({
      data: [],
      label: r.label,
    }));

    const now = new Date();

    let i = 0;
    // MOCKING DATA
    for (let index = 0; index < 700 / 5; index++) {

      this.barChartData[0].data.push(this.answer);
      if(i > 59){
        i = 0;
      }
      const minutes = ("0"+i).substr(-2);
      const seconds = ("0"+now.getSeconds()).substr(-2);
      const hourTimeString = `${now.getHours()}:${minutes}:${seconds}`;

      this.barChartLabels.push(hourTimeString);

      i++;

    }
  }
}
