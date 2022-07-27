import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';


import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';


const base_url = environment.base_url;

declare const gapi: any;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario;
  
  constructor(private http: HttpClient,
              private router: Router,
              private ngzone: NgZone) { 
    this.googleInit();
  }

  get token() {
    return localStorage.getItem('token') || '';
  }
  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role!;
  }
  get uid(){
    return this.usuario.uid || '';
  }
  get headers(){
    return {
      headers: {
        'x-token': this.token
      }};
  }
  googleInit(){
    return new Promise<void>( resolve=> {

      //console.log('Google init');
      
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '460371907537-jr66lapcickg27rt7dvhg5j8aq5u258d.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });


    })

  }
  
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.auth2.signOut().then( () => {
      this.ngzone.run(()=> {
        this.router.navigateByUrl('/login');
      })

    });
  }

  guardarLocalStorage(token: string, menu: string){
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify( menu ) );
  }
  
  validarToken(): Observable<boolean> {
    //const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, this.headers)
    .pipe(
      map( (resp: any) => {
        //console.log(resp);
        const {email, google, nombre, role,  img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid );
        //console.log(this.usuario);
        
        this.guardarLocalStorage(resp.token, resp.menu);
        return true
      }),
      catchError(error => of(false))
    );

  }
  
  crearUsuario(formData: RegisterForm){
    //console.log('Control de usuario', formData);
    
    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );

  }

  //loogin( formData: LoginForm ) {
  login( formData: any ) {
    //console.log('Datos formData', formData);
    
    return this.http.post(`${ base_url }/login`, formData )
                .pipe(
                 tap( (resp: any) => {
                  this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );

  }

  actulizarPerfil( data:{email: string, nombre: string, role: string} ){

    //Como el rol es obligatorio, tambien lo enviaremos
    //Cuando indicamos ...data esto indica que respeta todos los valores, para luego sumar un campo más
    data = {
      ...data,
      role: this.usuario.role!
    }
    return this.http.put(`${base_url}/usuarios/${ this.uid}`, data, this.headers);
  }

  loginGoogle( token: any ) {
    //console.log('Datos formData', formData);
    return this.http.post(`${ base_url }/login/google`, { token } )
                .pipe(
                 tap( (resp: any) => {
                  this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );

  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
          .pipe(
            delay(500),
            map( resp => {

              //Forma 1 - Manejor de imagenes
              //Necesito cambiar el arreglo de objeto, a un arregle de usuarios
              //con esto ya funcionaria el despliegue de imagen
              const usuarios = resp.usuarios.map( 
                user => new Usuario(user.nombre, user.email, '', user.img,
                                    user.google, user.role, user.uid))
              return {
                total: resp.total,
                usuarios
              };
            } )
          )
  }

  eliminarUsuario(usuario: Usuario){
    //console.log('Eliminando');
    //http://localhost:3000/api/usuarios/62c63b32a5a82d4a08fc166d
    const url = `${base_url}/usuarios/${usuario.uid}`; //
    console.log(url);
    
    return this.http.delete(url, this.headers);    
  }

  guardarUsuario( usuario:Usuario ){
    return this.http.put(`${base_url}/usuarios/${ usuario.uid}`, usuario, this.headers);
  }
}
