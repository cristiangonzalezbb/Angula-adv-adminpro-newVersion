import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Configuracion de mensajes de error (https://sweetalert2.github.io/)
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

import { emailPattern, nombreApellidoPattern } from '../validators/validaciones';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSubmitted: boolean =  false;

  public registerForm = this.fb.group({
    nombre:     ['',    [Validators.required, Validators.pattern( nombreApellidoPattern )]],
    email:      ['',    [Validators.required, Validators.pattern( emailPattern)]],
    password:   ['',    [Validators.required]],
    password2:  ['',    [Validators.required]],
    terminos:   [true,  [Validators.required]],
  }, {
    Validators: this.passwordIguales('password', 'password2')
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit(): void {
    this.registerForm.reset({
      nombre: 'Cristian Gonzalez',
      email: 'test100@test.cl',
      password: '123456',
      password2: '123456',
      terminos: true
    })
  }

  crearUsuario() {
    //Para saber cuando el formulario creo un usuario
    this.formSubmitted = true;
    //console.log(this.registerForm.value);
    //console.log(this.registerForm);
        
    if (!this.registerForm.valid){
      return;
    }
    //console.log('Envia a Posteo');
    
    //Postea el registro de usuario
    this.usuarioService.crearUsuario( this.registerForm.value )
      .subscribe(resp => {
        //console.log('Usuario creado')
        //console.log(resp)
        //Navegar al DashBoard
        this.router.navigateByUrl('/');

      }, (err) => {
        //Si sucede un error
        Swal.fire('Error', err.error.msg, 'error')
      }
       );
  }
  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }
  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;
    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    } else {return false;}
  }
  aceptaTermino(): boolean {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted
  }
  passwordIguales(pass1Name: string, pass2Name: string){
    console.log(pass1Name, pass2Name);

    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control?.value === pass2Control?.value ) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual: true })
      }
    }
  }
}
