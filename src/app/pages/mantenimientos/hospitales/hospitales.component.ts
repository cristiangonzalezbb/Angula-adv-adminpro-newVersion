import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public cargando: boolean = true; 

  public imgSubs: Subscription = new Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospital();

    //si la imagen cambia en el servicio, realizo una actualización de los datos
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(300))
    .subscribe(img => {this.cargarHospital()});
  }

  cargarHospital(){
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales) => {
        
        //console.log(hospitales)
        this.cargando = false;
        this.hospitales = hospitales;
      }
      )
  }

  buscar(termino: string){
    if (termino.length === 0) {
      this.cargarHospital();
    }

    //console.log(termino);
    this.busquedasService.buscar('hospitales', termino)
      .subscribe( (resp: Hospital[] ) => {
        this.hospitales = resp;
      }
      )
  }

  guardarCambios(hospital: Hospital){
    const id = hospital._id || '';
    const nombre =  hospital.nombre
    this.hospitalService.actualizarHospital(id, nombre)
        .subscribe((resp) => {
          //console.log(hospital);
          this.cargarHospital()
          Swal.fire('Actualizado', `${ nombre } fue actualizado`, 'success')
        })
  }

  eliminarHospital(hospital: Hospital){
    const id = hospital._id || '';
    const nombre =  hospital.nombre

    Swal.fire({
      title: '¿Borrar hospital?',
      text: `Esta a punto de borrar a ${nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.eliminarHospital(id)
            .subscribe(resp => {
              //console.log(hospital);
              this.cargarHospital()
              Swal.fire('Eliminado', `${ nombre } fue eliminado`, 'success')
            });
      };

    });
  }

  async abrirSweetAlert(){
    const valor = await Swal.fire({
      input: 'text',
      title: 'Crear Hospital',
      text:'Ingrese el nombre del nuevo hospital',
      showCancelButton: true,
      confirmButtonText: 'Guardar <i class="fa fa-thumbs-up"></i>',
      cancelButtonText: 'No crear <i class="fa fa-thumbs-down"></i>',
      inputPlaceholder: 'Nombre del hospital'
    },
    )
    if (valor.isConfirmed) {
      if (valor.value !== '') {
        //console.log(valor);
        this.hospitalService.crearHospital(valor.value)
        //Para mostrar la información en pantalla, tenemos 2 forma:
        //1.- Llenar el arreglo de hospitales con el push
          .subscribe((resp: any) => {
            this.hospitales.push( resp.hospital)
          })
        //2.- Realizando la recarga de la información
        //.subscribe((resp: any) => {
        //  this.cargarHospital();
        //})
      } 
    }
   
  }

  abrirModal(hospital: Hospital){
    //console.log('abrirModal id', hospital._id, 'imagen', hospital.img);
    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);
  }

}
