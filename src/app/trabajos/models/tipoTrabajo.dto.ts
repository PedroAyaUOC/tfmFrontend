export class TipoTrabajoDTO {
    id: number; 
    titulo: string;
    siglas: string;
  
    constructor(
      id: number, 
      titulo: string,
      siglas: string
    ) {
      this.id = id;
      this.titulo = titulo;
      this.siglas = siglas;
    }
        
  }