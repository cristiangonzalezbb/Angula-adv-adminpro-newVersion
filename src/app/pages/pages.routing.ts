import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

//Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';


const routes: Routes = [
    {
        //Ruta por defecto, pero va a la '' de dashboard
        //Desde ahora, para ingresar a las rutas se debe indicar dashboard
        //Ejemplo: dashboard/progress
        //Esto funciona porque dashboard es el padre y las otras son children
        path: 'dashboard', component: PagesComponent,
        //Sirve para proteger las rutas
        canActivate: [AuthGuard],
        children: [
        //Rutas hijas que dependen de componente PagesComponent
        {path: ''                   
            , component: DashboardComponent
            , data: {titulo: 'Dashboard', ruta: 'Cristiancito'}},
        {path: 'account-setting'
            , component: AccountSettingsComponent
            , data: {titulo: 'Ajuste decuenta'}},
        {path: 'buscar/:termino'
            , component: BusquedaComponent
            , data: {titulo: 'Busquedas'}},
        {path: 'grafica1'
            , component: Grafica1Component
            , data: {titulo: 'Gr??fica #1'}},
        {path: 'perfil'
            , component: PerfilComponent
            , data: {titulo: 'Perfil de usuario'}},
        {path: 'progress'
            , component: ProgressComponent
            , data: {titulo: 'ProgressBar'}},
        {path: 'promesas'
            , component: PromesasComponent
            , data: {titulo: 'Promesa'}},
        {path: 'rxjs'
            , component: RxjsComponent
            , data: {titulo: 'RxJs'}},

        //Mantenimientos
        {path: 'hospitales'
            , component: HospitalesComponent
            , data: {titulo: 'Mantenimiento de Hospitales'}},
        {path: 'medicos'
            , component: MedicosComponent
            , data: {titulo: 'Mantenimiento de Medicos'}},
        {path: 'medico/:id'
            , component: MedicoComponent
            , data: {titulo: 'Mantenimiento de Medicos'}},
        //rutas de admin
        {path: 'usuarios'
            , canActivate: [AdminGuard]
            , component: UsuariosComponent
            , data: {titulo: 'Mantenimiento de Usuarios'}},
        ]
    },

    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
