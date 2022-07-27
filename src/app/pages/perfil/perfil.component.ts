import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { emailPattern, nombreApellidoPattern } from '../../auth/validators/validaciones';

import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  private usuario!: Usuario;
  public perfilForm!: FormGroup;
  public imagenSubir!: File;
  public imgTemp: any = '';
  
  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileuploadservice: FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  get imgUrl(){
    return this.usuario.imagenUrl;
  }
  get google(){
    return this.usuario.google;
  }
  
  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre:     [this.usuario.nombre,    [Validators.required, Validators.pattern( nombreApellidoPattern )]],
      email:      [this.usuario.email,    [Validators.required, Validators.pattern( emailPattern)]],
    });

  }

  actualizarPerfil(){
    //console.log(this.perfilForm!.value);
    this.usuarioService.actulizarPerfil( this.perfilForm.value )
      .subscribe(resp => {
        const { nombre, email } = this.perfilForm.value;
        //console.log(resp)
        //Al actualizar el usuario, Angular automaticamente actualiza
        //el objeto de Usuario que esta es UsuarioService
        this.usuario.nombre = nombre;
        this.usuario.email  = email; 

        Swal.fire('Guardado', 'Cambios fueron guardados', 'success')
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error')
      });
  }

  cambiarImagen(event: any): any {
    this.imagenSubir = event.target.files[0];
    
    //console.log(event);
    if (!this.imagenSubir) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    //ayuda a transformar la data en base de 64, para mostrarla 
    reader.readAsDataURL(this.imagenSubir);

    reader.onloadend = () => {
      //console.log(reader.result);
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileuploadservice
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid! )
      .then( img => {
        this.usuario.img = img;
        Swal.fire('Guardar', 'La imagen fue actualizada', 'success');
      })
      .catch( (err) => {
        Swal.fire('Error', err.error.msg, 'error')
      })
  }
}
