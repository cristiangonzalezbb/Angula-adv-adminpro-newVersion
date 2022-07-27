import { Component, Input } from '@angular/core';
import { ChartData, Color } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  constructor() {
  }

  @Input('title') title: string = 'Sin Titulo';
  @Input("labels") labels: string[] = [ 'items 1', 'items 2', 'items 3' ];

  // Doughnut
  //@Input("labelsgrafica") doughnutChartLabels: string[] = [ 'Label 1', 'Label 2', 'Label 3' ];
  doughnutChartLabels: string[] = this.labels;
  @Input("data") doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [10, 10, 80] },
    ]
  };

 
 
 public colors: any[] = [
  {backgroundColor:["#9E120E","#FF5800","#FFB414"]},
  {backgroundColor:["#9E120E","#FF5800","#FFB414"]},
  {backgroundColor:["#9E120E","#FF5800","#FFB414"]}
];

}
