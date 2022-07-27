import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { Hospital } from '../../../../models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { MedicoService } from '../../../../services/medico.service';
import { HospitalService } from '../../../../services/hospital.service';


@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado!: Medico;
  public hospitalSeleccionado!: Hospital;

  public medico!: Medico;

  constructor(private fb: FormBuilder,
              private medicoService: MedicoService,
              private hospitalService: HospitalService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    //Busco el Id que me envio el mantenedor, buscando en el url activo
    this.activatedRoute.params.subscribe( ({id}) => {
      //console.log(id);
      this.cargarMedico(id);
    });
    //params
    //console.log(params);
      
    //declaro los objetos del formulario
    this.medicoForm = this.fb.group({
        nombre: ['', Validators.required],
        hospital: ['', Validators.required]
    })

    this.cargarHospitales();

    //Para seleccionar el id del hospital que puedo seleccionar
    this.medicoForm.get('hospital')?.valueChanges
        .subscribe(hospitalId => {
          //console.log(hospitalId);
          
          this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId)!;
          //console.log(this.hospitalSeleccionado);
          
        })
  }

  cargarMedico(id: string){
    //console.log(id);
    
    if (id === 'nuevo'){
      return;
    }
    this.medicoService.obtenerMedicoPorId( id )
      .pipe(delay(200))
      .subscribe( (medico: Medico) => {
          //console.log(medico.nombre, medico.hospital?._id);

          //console.log(medico);
          
          if (!medico){
            this.router.navigateByUrl( `/dashboard/medicos` );
            return;
          }

          this.medicoSeleccionado = medico;

          this.medicoForm.setValue({
            nombre: medico.nombre,
            hospital: medico.hospital?._id
          })
      })
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
          //console.log(hospitales);
          this.hospitales = hospitales;
      })
  }

  guardarMedico(){
    const { nombre } = this.medicoForm.value;

    //Reviso si existe un medico seleccionado, si esta actualizo
    //de los contrario creo uno nuevo
    if ( this.medicoSeleccionado ) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }

      this.medicoService.actualizarMedico(data)
        .subscribe( resp => {
          //console.log(resp);
          const value = Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success')
            .then((result) => {
              //console.log(result);
              //Navego a la pagina de consulta doctores
              this.router.navigateByUrl( `/dashboard/medicos` );
            });
        });
    } else {
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          //console.log(resp);
          Swal.fire('Creado', `${ nombre } creado correctamente`, 'success')
            .then((result) => {
              //Navego a la misma pagina
              //this.router.navigateByUrl( `/dashboard/medico/${ resp.medico._id }` );
              this.router.navigateByUrl( `/dashboard/medicos` );
            });
        });
    }

    //console.log(this.medicoForm.value);
    //Forma 1
    //const nombre: string = this.medicoForm.get('nombre')?.value;
    //Forma 2
    
  }

}
