import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(public modalImageService: ModalImagenService,
              public fileuploadservice: FileUploadService) { }
  
  ngOnInit(): void {
  }
  cerrarModal(){
    this.modalImageService.cerrarModal();
    this.imgTemp = null;
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
    const id = this.modalImageService.id;
    const tipo = this.modalImageService.tipo;

    console.log('subirImagen modal-imagen.component',id, '---->', tipo);
    
    this.fileuploadservice
      .actualizarFoto(this.imagenSubir, tipo, id )
      .then( img => {
        
        //emito que fue actualizada la imagen
        this.modalImageService.nuevaImagen.emit(img);
        
        Swal.fire('Guardar', 'La imagen fue actualizada', 'success');
        this.cerrarModal();
      })
      .catch( (err) => {
        Swal.fire('Error', err.error.msg, 'error')
      })
  }

}
