import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {
  
  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`;
  }

  //Si quiero recibir el valor con otro nombre
  //lo indico dentro del @Input
  //@Input('valor') progreso: number = 40;
  @Input("valor") progreso: number = 10;
  @Input() btnClass: string = 'btn-primary';

  @Output("valor") valorSalida: EventEmitter<number> = new EventEmitter();

  //progreso: number = 40;
  @Output() get getPorcentaje() {
    return `${this.progreso}%`
  }

  cambiarValor(valor: number) {

    if (this.progreso >= 100 && valor >= 0) {
        this.valorSalida.emit(100)
        return this.progreso= 100;
    }
    if (this.progreso <= 0 && valor < 0) {
      this.valorSalida.emit(0)
      return this.progreso= 0;
    }
    this.progreso += valor
    this.valorSalida.emit(this.progreso)
    return this.progreso

  }

  onChange(nuevoValor: number){
    if(nuevoValor>=100){
      this.progreso = 100;
    } else if(nuevoValor<=0){
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }

    this.valorSalida.emit(this.progreso);
  }

}
