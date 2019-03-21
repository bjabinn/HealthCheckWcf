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
            max: 1000,
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
        maxBarThickness : 40
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
        // {
        //   type: 'line',
        //   mode: 'horizontal',
        //   scaleID: 'responsetime',
        //   value: '2500',
        //   borderColor: 'orange',
        //   borderWidth: 2,
        //   label: {
        //     enabled: true,
        //     fontColor: 'orange',
        //     content: 'Slow response'
        //   }
        // },
        // {
        //   type: 'line',
        //   mode: 'horizontal',
        //   scaleID: 'responsetime',
        //   value: '4800',
        //   yAxisID: 'Oil',
        //   borderColor: 'red',
        //   borderWidth: 2,
        //   label: {
        //     enabled: true,
        //     fontColor: 'red',
        //     content: 'Timeout'
        //   }
        // },
        // {
        //   type: 'box',
        //   yScaleID: 'Oil',
        //   yMin: 104,
        //   yMax: 130,
        //   backgroundColor: 'rgba(0,255,0,0.15)',
        //   borderColor: 'rgba(0,255,0,0.05)',
        //   borderWidth: 0,
        // },
       
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
    // {
    //   index: 1,
    //   axisId: 'Water',
    //   colorName: 'green',
    //   label: 'Cristina suki',
    //   units: 'celsius',
    //   activeInBypassMode: true,
    // },
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
    
    // let boxHeight = this.serviceBox.nativeElement.offsetHeight ; 
    // let chartHeight = boxHeight - 44;  //44 = title size

    // if(this.canvas.nativeElement.offsetHeight > chartHeight){
    //   const difference = this.canvas.nativeElement.offsetHeight - chartHeight;

    //   this.canvasHeight = chartHeight;
    //   this.canvasWidth = this.canvas.nativeElement.offsetWidth - difference;
      
      
    // }
    
    this.ch.chart.update();
  }


  refreshData(seconds:number){
    setInterval(()=>{

      this.serviceData.notifyTimeout = false;

      this.dataService.getJSON().subscribe(data=>{
          const service = data.services.find(x => x.title == this.serviceData.title);
          console.log(service);

          if(service){
            const responsesToUpdate = service.responses;
            this.checkResponsesInLocalStorageAndUpdate(service);
            
          }
          
      });


      // ---***** MOCKING DATA TO UPDATE CHART -- TO BE COMMENTED IN PROD ******----
      const now = new Date();
      const minutes = ("0"+now.getMinutes()).substr(-2);
      const nowSeconds = ("0"+now.getSeconds()).substr(-2);
      const hourTimeString = `${now.getHours()}:${minutes}:${nowSeconds}`;
      
      let randomNumber = this.getRandomArbitrary(380,550);

      if(randomNumber > 549){
        this.serviceData.notifyTimeout = true;
        this.barChartData[0].data.push(5200); 
        // if(seconds > 90){
        //   setTimeout(()=> {this.serviceData.notifyTimeout = false; console.log("90 segundos parpadeando terminado")},90);
        // }
      }else{
        this.barChartData[0].data.push(randomNumber);
      }

      this.barChartLabels.push(hourTimeString);

      if(randomNumber > 549){
        //Change options to add annotations
        this.setBarChartOptionsAnnotations();
      }

      this.ch.chart.config.data.options = this.barChartOptions;
      
     
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
              max: 5500,
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
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'responsetime',
            value: '2500',
            borderColor: 'orange',
            borderWidth: 1,
            label: {
              enabled: true,
              fontColor: 'orange',
              content: 'Slow response'
            }
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'responsetime',
            value: '4800',
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
    const lastDateStored =  this.getDateModelFromJson(lastItemStored.responses[0].date);

    const responsesArrayToPush: ResponseModel[] = [];

    for (let i = 0; i < service.responses.length; i++) {

      const iteratedDate = this.getDateModelFromJson(service.responses[i].date);

      //If response date from JSON of the Service is different and greater than the last one we have stored in localStorage
      if (iteratedDate !== lastDateStored && iteratedDate > lastDateStored) {
        responsesArrayToPush.push(service.responses[i]);
      }
    }

    //New responses to push in chart and localStorage
    if(responsesArrayToPush.length > 0){
      
      if(responsesArrayToPush.length > 1){
        responsesArrayToPush.forEach(response => {
            this.barChartData[0].data.push(response.time); 
            this.barChartLabels.push(response.date);
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
        this.ch.chart.config.data.options = this.barChartOptions;
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

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
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
    //   const minutes = ("0"+now.getMinutes()).substr(-2);
    //   const seconds = ("0"+now.getSeconds()).substr(-2);
    //   const hourTimeString = `${now.getHours()}:${minutes}:${seconds}`;
      
    // this.barChartLabels = [
    //   hourTimeString,
    //   hourTimeString,
    //   hourTimeString,
    //   hourTimeString,
    //   hourTimeString,
    //   hourTimeString,
    //   hourTimeString,
    // ];

    let i = 0;
    // MOCKING DATA
    for (let index = 0; index < 700 / 5; index++) {

      this.barChartData[0].data.push(this.getRandomArbitrary(380, 550));
      if(i > 59){
        i = 0;
      }
      const minutes = ("0"+i).substr(-2);
      const seconds = ("0"+now.getSeconds()).substr(-2);
      const hourTimeString = `${now.getHours()}:${minutes}:${seconds}`;

      this.barChartLabels.push(hourTimeString);

      i++;

    }

 

    // this.barChartData[0].data = [
    //   100,1000,120,50,1220,130,100
    // ];

    // this.barChartData[1].data = [
    //   5, 13, 15.6, 16.2, 18.4, 19.8, 22, 24.4, 26
    // ];
  }
}
