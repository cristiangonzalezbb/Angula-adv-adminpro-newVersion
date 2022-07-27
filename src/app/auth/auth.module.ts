import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    //Para poder linkear a la pagina Dashboard
    RouterModule,
    //Para tener control de formulario
    FormsModule,
    //Para tener el control de la html
    ReactiveFormsModule,
    //Importo el HTTP para realizar el llamado a mi BackEnd
    HttpClientModule,
  ]
})
export class AuthModule { }
