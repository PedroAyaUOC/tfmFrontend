export class ArchivoDTO {

  id?: number;
  fCreacion: Date | string; 
  titulo: string; 
  slug: string;
  idTrabajo: number;

  constructor(
    id: number,
    fCreacion: Date | string,
    titulo: string,
    slug: string,
    idTrabajo: number,
  ) {
    this.id = id;
    this.fCreacion = fCreacion;
    this.titulo = titulo;
    this.slug = slug;
    this.idTrabajo = idTrabajo;
  }

}
