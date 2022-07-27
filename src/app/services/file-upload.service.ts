import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})


export class FileUploadService { 
  
  constructor() { }

  async actualizarFoto (
    archivo: File,
    tipo?: 'usuarios' | 'medicos' | 'hospitales',
    id?: String
  ){
    
    try {
      //Otra forma de subir archivos
      const url = `${ base_url}/upload/${ tipo }/${ id }`;
      //para generar la data, se utiliza formData que es propio de javascript
      const formData = new FormData();
      //Incluye todas las propiedades que utiliza el Postman
      formData.append('imagen', archivo)

      //console.log('url ==> ', url);
      
      //el fetch es propio de JavaScript, nos permite hacer peticiones
      //http de manera muy facil
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if (data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false
      }

      //console.log(data);
      //return 'nombre de la imagen';
      //return data;

    } catch (error) {
      console.log(error);
      return false;
    }

  }


}
