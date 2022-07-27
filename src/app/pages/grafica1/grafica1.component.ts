import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

public labels1: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
public data1: number[] = [ 5, 80, 15 ];

public labels2: string[] = [ 'Pan', 'Leche', 'Peras' ];
public data2: number[] = [ 25, 50, 25 ];

public labels3: string[] = [ 'paso 1', 'paso 2', 'paso 3' ];
public data3: number[] = [ 35, 35, 30 ];
}
