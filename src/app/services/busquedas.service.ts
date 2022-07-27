import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }


  get token() {
    return localStorage.getItem('token') || '';
  }
  get headers(){
    return {
      headers: {
        'x-token': this.token
      }};
  }

  private transformaUsuarios(resultados: any[]): Usuario[]{
    return resultados.map(user => new Usuario(user.nombre, user.email, '', user.img,
    user.google, user.role, user.uid)
    )
  } 

  private transformaHospitales(resultados: any[]): Hospital[]{
    return resultados;
  } 

  private transformaMedicos(resultados: any[]): Medico[]{
    return resultados;
  } 

  buscarUsuario(tipo: 'usuarios',
  termino: string){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
    .pipe(
      map( (resp: any) => {

        switch (tipo) {
          case 'usuarios':
              return this.transformaUsuarios(resp.resultados);
          default:
            return [];
        }

      })
    )
  }

  busquedaGlobal(termino: string){
    const url = `${base_url}/todo/${termino}`;
    return this.http.get<any[]>(url, this.headers);
  }

  buscar(tipo: 'medicos'|'hospitales',
        termino: string){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
          .pipe(
            map( (resp: any) => {

              switch (tipo) {
                case 'hospitales':
                    return this.transformaHospitales(resp.resultados);
                case 'medicos':
                    return this.transformaMedicos(resp.resultados);           
                default:
                  return [];
              }

            })
          )
  }

}
