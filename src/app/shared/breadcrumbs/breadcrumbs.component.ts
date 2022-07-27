import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo: string = '';
  public tituloSubs$: Subscription;

  constructor(private router: Router) { 
    this.tituloSubs$ = this.getArgumentosRuta()
                      .subscribe(({ titulo, ruta }) => {
                        //console.log(titulo, ruta);
                        this.titulo = titulo;
                        document.title = `AdmPro - ${titulo}`;
                        //console.log(data.titulo);
                      });

  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta(){
    //this.router.events
    //Igual al ejemplo del Video
    //.pipe(
    //  filter(   event                  => event instanceof ActivationEnd ),
    //  filter ( (event: ActivationEnd ) => event.snapshot.firstChild === null) ,
    //  map(     (event: ActivationEnd ) => event.snapshot.data),
    //)
    return this.router.events
    .pipe(
      filter(   event                  => event instanceof ActivationEnd ),
      map(     (event) => event as ActivationEnd),
      filter ( (event: ActivationEnd ) => event.snapshot.firstChild === null) ,
      map(     (event: ActivationEnd ) => event.snapshot.data),
    );

  }
}
