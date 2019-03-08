import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit, ElementRef, AfterViewChecked } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable, of } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { DataSeries, chartColors } from 'src/app/models/data-series';
import * as annotationsPlugin from 'chartjs-plugin-annotation';
import { Service } from 'src/app/models/service';
import { DataService } from 'src/app/services/data.service';



@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit,AfterViewChecked {
  
  
  ngAfterViewChecked(): void {
    // let boxHeight = this.serviceBox.nativeElement.offsetHeight ; 
    // let chartHeight = boxHeight - 44;  //44 = title size

    // if(this.canvas.nativeElement.offsetHeight > chartHeight){
    //   const difference = this.canvas.nativeElement.offsetHeight - chartHeight;

    //   this.canvasHeight = chartHeight;
    //   console.log("Offwidth",this.canvas.nativeElement.offsetWidth);
      
    //   this.canvasWidth = this.canvas.nativeElement.offsetWidth - difference;
      
      
    // }
    
    // this.ch.chart.update();
    
    
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
    this.refreshDataSeries();
    
  }


  ngOnInit() {
    console.log(this.serviceData);
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
          console.log(service.responses[0]);
          
      });

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

      if(randomNumber > 549)
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
      this.ch.chart.config.data.options = this.barChartOptions;
      // this.barChartOptions.scales.yAxes[0].ticks.max = 5000 + 1000;
      //this.ch.datasets.push(...this.barChartData);  
      this.ch.chart.update();

      
      
    },seconds*1000);
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  refreshDataSeries() {
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
