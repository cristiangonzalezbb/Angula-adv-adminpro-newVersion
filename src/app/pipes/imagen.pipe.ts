import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string= 'undefine', tipo: 'usuarios'| 'medicos'| 'hospitales'): string {
    //return 'hola mundo ' + img + ' ' + tipo;

      //console.log('transfor', img, tipo);

      //Si la imagen esta en vacio, envia los por defecto
      if ( !img ) {
        return `${ base_url }/upload/usuarios/no-image`;
      } else 
      //Para las imagenes que son de google
      if ( img.includes('https') ) {
          return img;
      } else
      //Entrega la ruta donde se encuentra la imagen en el servidor
      if ( img ) {
          return `${ base_url }/upload/${ tipo }/${ img }`;
      } else {
          return `${ base_url }/upload/usuarios/no-image`;
      }
  }

}
