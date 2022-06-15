import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrabajoDTO } from '../models/trabajo.dto';
import { ArchivoDTO } from '../models/archivo.dto';
import { HttpClient } from '@angular/common/http';
import { ProvinciaDTO } from '../models/provincia.dto';
import { MunicipioDTO } from '../models/municipio.dto';
import { TipoTrabajoDTO } from '../models/tipoTrabajo.dto';


@Injectable({
  providedIn: 'root'
})
export class TrabajosService {

  //private url = environment.urlEndPoint;
  private url = environment.urlEndPoint;

  constructor( private http: HttpClient ) {
    
  }

  getAllTrabajos = async(): Promise<TrabajoDTO[]> => {
    return await this.http.get(`${this.url}trabajos`).toPromise() as Promise<TrabajoDTO[]>;
  }

  getAllTrabajosByIdCliente = async(id: number): Promise<TrabajoDTO[]> => {
    return await this.http.get(`${this.url}trabajos/cliente/${id}`).toPromise() as Promise<TrabajoDTO[]>;
  }

  getTrabajoById = async(id: number): Promise<TrabajoDTO> => {
    return await this.http.get(`${this.url}trabajos/${id}`).toPromise() as Promise<TrabajoDTO>;
  }

  getArchivosTrabajoById = async(id: number): Promise<ArchivoDTO[]> => {
    return await this.http.get(`${this.url}archivos/trabajo/${id}`).toPromise() as Promise<ArchivoDTO[]>;
  }

  createTrabajo = async(trabajo: TrabajoDTO): Promise<any> => {
    return await this.http.post(`${this.url}trabajos`, trabajo).toPromise();
  }

  updateTrabajo = async(trabajo: TrabajoDTO, id: string | number | null): Promise<any> => {
    return await this.http.put(`${this.url}trabajos/${id}`, trabajo).toPromise();
  }

  getAllTiposTrabajo = async(): Promise<TipoTrabajoDTO[]> => {
    return await this.http.get(`${this.url}tiposTrabajo`).toPromise() as Promise<TipoTrabajoDTO[]>;
  }

  getAllProvincias = async(): Promise<ProvinciaDTO[]> => {
    return await this.http.get(`${this.url}provincias`).toPromise() as Promise<ProvinciaDTO[]>;
  }

  getAllMunicipios = async(): Promise<MunicipioDTO[]> => {
    return await this.http.get(`${this.url}municipios`).toPromise() as Promise<MunicipioDTO[]>;
  }

  getMunicipioById = async(id: number): Promise<MunicipioDTO> => {
    return await this.http.get(`${this.url}municipios/${id}`).toPromise() as Promise<MunicipioDTO>;
  }

  getMunicipiosProvincia = async(id: number): Promise<MunicipioDTO[]> => {
    return await this.http.get(`${this.url}municipios/provincia/${id}`).toPromise() as Promise<MunicipioDTO[]>;
  }

  getFilterTrabajos = async(idTipo: string, fInicio: string, fFin: string): Promise<TrabajoDTO[]> => {
    return await this.http.get(`${this.url}trabajos/filter/${idTipo}/${fInicio}/${fFin}`).toPromise() as Promise<TrabajoDTO[]>;
  }

  createArchivo = async(archivo: ArchivoDTO): Promise<any> => {
    return await this.http.post(`${this.url}archivos`, archivo).toPromise();
  }

  uploadArchivo = async(id: number, archivoUp : File): Promise<any> => {
    const formData = new FormData();
    formData.append('fichero', archivoUp);
    return await this.http.post(`${this.url}archivos/` + id, formData).toPromise();
  }

  deleteArchivoById = async(id: number): Promise<any> => {
    return await this.http.delete(`${this.url}archivos/${id}`).toPromise();
  }

  getRefCatastro = async(coorX : string, coorY:string): Promise<any> => {
    return await this.http.get(`${this.url}refCatastro/${coorX}/${coorY}`).toPromise();
  }

}