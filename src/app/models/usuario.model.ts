import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: 'ADMIN_ROLE' | 'USER_ROLE',
        public uid?: string,
    ) {}

    get imagenUrl() {

        //Si la imagen esta en vacio, envia los por defecto
        if ( !this.img ) {
            return `${ base_url }/upload/usuarios/no-image`;
        } else 
        //Para las imagenes que son de google
        if ( this.img.includes('https') ) {
                return this.img;
        } else
        //Entrega la ruta donde se encuentra la imagen en el servidor
        if ( this.img ) {
                return `${ base_url }/upload/usuarios/${ this.img }`;
            } else {
                return `${ base_url }/upload/usuarios/no-image`;
            }
        }
}

