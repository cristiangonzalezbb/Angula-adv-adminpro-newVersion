import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { pipe, Subscription } from 'rxjs';

import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number= 0;
  public usuarios: Usuario[]= [];
  public usuariosTemp: Usuario[]= [];

  public imgSubs: Subscription = new Subscription;
  public desde: number= 0;
  public cargando: boolean = true;

  constructor(private usuarioservice: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    //si la imagen cambia en el servicio, realizo una actualización de los datos
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(300))
    .subscribe(img => {this.cargarUsuarios()});
  }

  //No importa que tenga el mismo nombre que el servicio
  cargarUsuarios(){
    this.cargando=true;
    //puedo hacerlo de dos formar:
    //una es resp.total y resp.usuarios
    //o desestructurarlos. Esto manda un error porque
    //solo ve el objeto pero no sabe que tipo son.
    //Para solucionalo, nos vamos a servicios para realizar el siguiente cambio en el Get
    //return this.http.get<{total: number, usuarios:Usuario[]}>(url, this.header)
    //Para recibirlos en el llamado como 
    //La otra es crear una interfaz
    //.subscribe(({total, usuarios}) => {
      this.usuarioservice.cargarUsuarios(this.desde)
      .pipe(delay(500))
      .subscribe(({total, usuarios}) => {
        this.totalUsuarios = total;
        if (this.totalUsuarios !== 0) {
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando=false;
        }
      })
   }

  cambiarPagina(valor: number){
    this.desde += valor;
    if (this.desde <0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }
    //console.log(this.desde);
    this.cargarUsuarios();
  }

  buscar(termino: string){
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    //console.log(termino);
    this.busquedasService.buscarUsuario('usuarios', termino)
       .subscribe( resp => {
        this.usuarios = resp;
      })  
  }

  eliminarUsuario(usuario: Usuario){
    //Reviso que no se auto-elimine
    if (usuario.uid ===  this.usuarioservice.uid){
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
      return;
    }
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioservice.eliminarUsuario(usuario)
          .subscribe(resp => {
            this.cargarUsuarios();
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );
          })
      }
    })
    
  }

  cambiarRole(usuario: Usuario){
    //Cuando el usuario realiza el cambio en la pantalla
    //Angular realiza de inmediato el cambio en el objeto
    //console.log(usuario);
    this.usuarioservice.guardarUsuario(usuario)
      .subscribe(resp => {
        console.log(resp);
        
      })
  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }
}
