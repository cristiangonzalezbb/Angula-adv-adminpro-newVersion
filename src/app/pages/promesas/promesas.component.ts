import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //this.getUsuarios();
    this.getUsuarios().then(usuarios => {
      //console.log(usuarios);
      
    })
    //Las promesas son parte de JavaScrip
    //La promesa debe tener el cuerpo, a lo menos el callback que queremos ejecutar
    //Este es asincrono
    //El codigo se ejecuta de manera secuencial, incluso como la promesa tiene un callback
    // esta se ejecuta en forma secuencial
    //Lo que realmente es asincrona es la resolución
    //const promesa = new Promise( (resolve, reject) => {
    //    //esta prueba es antes de poner el resolve
    //    //console.log('Hola Mundo');
    //    //resolve('Hola Mundo');
    //    if (false) {
    //      resolve('Hola Mundo');
    //    } else {
    //      reject('Algo salio mal');
    //    }
    //});
  
    //Capturo es por si existe Error
    //promesa.catch
    //Despúes que termine, aunque este con error
    //promesa.finally
    //Es cuando se ejecuta correctamente
    //Se puede poner otro callback, para ejecutar cuando la pronesa se resuelve
    //promesa.then
    //Este procedimiento es el realmente Asincrono
    //promesa.then( (mensaje) => {
    //  console.log('Hey Termine');
    //  console.log(mensaje);
    //})
    //.catch(error => {console.log("Error en mi promesa " + error)})
    //.finally( () => {console.log('Me da lo mismo el error')}
    //)
    //console.log('Fin del OnInit');
  }

  getUsuarios() {
  /*
    //promesa forma 1
    fetch('https://reqres.in/api/users')
    .then(resp => {
      resp.json().then( body => console.log(body) );
    })
  */
 /*
    //promesa forma 1
    fetch('https://reqres.in/api/users')
    .then(resp => resp.json())
    .then(body => console.log(body));
  */
  //promesa forma 3
  return new Promise(resolve => {
    fetch('https://reqres.in/api/users')
    .then(resp => resp.json())
    .then(body => resolve( body.data ));
  });

  }
  
}
