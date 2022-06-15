export class TrabajoDTO {

	id: number;
	fEntrada: Date;
	expediente: string;
	descripcion: string;
	observaciones: string;
	coordenadaX: string;
	coordenadaY: string;
	refCatastro: string;
	direccion: string;
	idMunicipio: number;
	idTipo: number;
	idCliente: number;

	constructor (
    id: number,
    fEntrada: Date,
    expediente: string,
    descripcion: string,
    observaciones: string,
    coordenadaX: string,
    coordenadaY: string,
    refCatastro: string,
    direccion: string,
    idMunicipio: number,
    idTipo: number,
    idCliente: number,

	) {
		this.id = id;
    this.fEntrada = fEntrada; 
    this.expediente = expediente; 
   	this.descripcion = descripcion;
    this.observaciones = observaciones;
    this.coordenadaX = coordenadaX;
    this.coordenadaY = coordenadaY;
    this.refCatastro = refCatastro;
    this.direccion = direccion;
    this.idMunicipio = idMunicipio;
    this.idTipo = idTipo;
    this.idCliente = idCliente;
	}
}