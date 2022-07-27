import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
//Configuracion de mensajes de error (https://sweetalert2.github.io/)
import Swal from 'sweetalert2'

import { emailPattern } from '../validators/validaciones';
import { UsuarioService } from 'src/app/services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public formSubmitted: boolean =  false;
  public auth2: any;

  public loginForm = this.fb.group({
    email:      [ localStorage.getItem('email') || ''    ,    [Validators.required, Validators.pattern( emailPattern)]],
    password:   ['' || ''    ,    [Validators.required]] || '',
    remember:   [false]
  });

  constructor(private router:Router,
              private fb    : FormBuilder,
              private usuarioService: UsuarioService,
              private ngzone: NgZone) { }
  
  ngOnInit(): void {
    //this.loginForm.reset({
    //  email: 'test100@test.cl',
    //  password: '123456',
    //  remember: true})
    this.renderButton();
  }

  login() {
    this.formSubmitted =  true;
    console.log(this.loginForm.value);
    if (!this.loginForm.valid){
      return;
    }

    //Postea el registro de usuario
     this.usuarioService.login( this.loginForm.value )
      .subscribe(resp => {
        //console.log(resp)
        if (this.loginForm.get('remember')!.value) {
          const email = this.loginForm.get('email')?.value || ''
          localStorage.setItem('email', email);
        } else{
          localStorage.removeItem('email');
        }
        //Navegar al DashBoard
        this.router.navigateByUrl('/');
      }, (err) => {
       //Si sucede un error
       Swal.fire('Error', err.error.msg, 'error')
      }
      )
    
    //this.router.navigateByUrl('/')
  }

  //onSuccess(googleUser: any) {
  //  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  //  var id_token = googleUser.getAuthResponse().id_token;
  //  console.log(id_token);
  //}
  //onFailure(error: any) {
  //  console.log(error);
  //}

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      //'onsuccess': this.onSuccess,
      //'onfailure': this.onFailure
    });

    this.startApp();
  }


  async startApp() {
      await this.usuarioService.googleInit();

      this.auth2 = this.usuarioService.auth2;
      this.attachSignin(document.getElementById('my-signin2'));
    
  };
  
  attachSignin(element: any) {
      //console.log(element.id);
      this.auth2.attachClickHandler(element, {},
          (googleUser: any) => {
            const id_token = googleUser.getAuthResponse().id_token;
            //console.log(id_token);
            this.usuarioService.loginGoogle(id_token).
            subscribe(resp => {

              this.ngzone.run(() => {
                //Navegar al DashBoard
                this.router.navigateByUrl('/');
              })
            });
            

          }, (error: any) => {
            alert(JSON.stringify(error, undefined, 2));
          });
    }

}
