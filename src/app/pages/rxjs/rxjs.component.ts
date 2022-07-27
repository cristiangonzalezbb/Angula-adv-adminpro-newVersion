import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy  {
  intervalSubs: Subscription = new Subscription;

  constructor() { 
    
    //
    //this.retornaObservable().pipe(
    //  //Cantidad de veces que quiero reintentar ejecutarlo
    //  //Luego de enviar el error
    //  retry(1)
    //).subscribe(
    //  valor => console.log('Subs:', valor),
    //  err   => console.warn('Error', err),
    //  ()    => console.info('Obs Terminado')
    //);

    this.intervalSubs = this.retornaIntervalo()
    .subscribe(console.log);

  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  ngOnInit(): void {
  }
  //El orden de los operadores si importa
  retornaIntervalo(): Observable<number> {
      return interval(500)
      .pipe(
        take(10),
        map(valor => valor + 1),  //0 => 1
        //Si el filtro se cumple es False, no se ejecuta el take.
        //Si el take, queda arriba del map, si se ejecuta hasta el numero que se indica
        filter(valor => (valor % 2 === 0) ? true: false ),
        )
  }


  retornaObservable(): Observable<number> {
    let i = -1;
    return new Observable<number>(observer => {

      const intervalo = setInterval( () => {
        i+=1;
        observer.next(i);

        if (i === 4) {
            clearInterval(intervalo);
            observer.complete();
        }
        if (i === 2) {
          console.log('i = 2... error');
          
          observer.error('i llego al valor de 2');
        }
      }, 1000)

    });

  }
}
