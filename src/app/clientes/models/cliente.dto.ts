export class ClienteDTO {
	id: number;
	nombre: string;
	apellidos: string;
	dni: string;
	idioma: string;
	email: string;
	telefono1: string;
	telefono2?: string;
	observaciones?: string;
	direccion: string;
	cp: string;
	idMunicipio: number;

	constructor (
		id: number, 
    nombre: string, 
    apellidos: string, 
    dni: string, 
    idioma: string,
    email: string,
    telefono1: string,
    telefono2: string,
    observaciones: string,
    direccion: string,
    cp: string,
    idMunicipio: number
	) {
		this.id = id;
    this.nombre = nombre; 
    this.apellidos = apellidos; 
   	this.dni = dni;
    this.idioma = idioma;
    this.email = email;
    this.telefono1 = telefono1;
    this.telefono2 = telefono2;
    this.observaciones = observaciones;
    this.direccion = direccion;
    this.cp = cp;
    this.idMunicipio = idMunicipio;
	}
}