export class MunicipioDTO {
  id: number; 
  nombre: string;
  idProvincia: number;

  constructor(
    id: number, 
    nombre: string,
    idProvincia: number
  ) {
    this.id = id;
    this.nombre = nombre;
    this.idProvincia = idProvincia;
  }
      
}