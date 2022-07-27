import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {
  
  public cargando: boolean= true;
  public medicos: Medico[]= [];

  public imgSubs: Subscription = new Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();

    //si la imagen cambia en el servicio, realizo una actualización de los datos
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(300))
    .subscribe(img => {this.cargarMedicos()});
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe((medicos) => {
        
        //console.log(medicos)
        this.cargando = false;
        this.medicos = medicos;
      }
      )
  }

  buscar(termino: string){
    if (termino.length === 0) {
      this.cargarMedicos();
    }

    //console.log(termino);
    this.busquedasService.buscar('medicos', termino)
      .subscribe( (resp: Medico[] ) => {
        this.medicos = resp;
      }
      )
  }

  guardarCambios(medico: Medico){
    const id = medico._id || '';
    const nombre =  medico.nombre
    const hospital= medico.hospital?._id || '';
    this.medicoService.actualizarMedico(medico)
        .subscribe((resp) => {
          //console.log(resp);
          Swal.fire('Actualizado', `${ nombre } fue actualizado`, 'success')
          .then((result) => {
              this.cargarMedicos()
            });
        })
  }

  eliminarMedico(medico: Medico){
    const id = medico._id || '';
    const nombre =  medico.nombre

    Swal.fire({
      title: '¿Borrar medicos?',
      text: `Esta a punto de borrar a ${nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(id)
            .subscribe(resp => {
              //console.log(medico);
              Swal.fire('Eliminado', `${ nombre } fue eliminado`, 'success')
                .then((result) => {
                  this.cargarMedicos()
                });
              
              });
      };
    });
  }

  abrirModal(medico: Medico){
    //console.log('abrirModal id', medico._id, 'imagen', medico.img);
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

}
