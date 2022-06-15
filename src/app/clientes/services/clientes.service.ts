import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ClienteDTO } from '../models/cliente.dto';
import { ProvinciaDTO } from '../models/provincia.dto';
import { MunicipioDTO } from '../models/municipio.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  //private url = environment.urlEndPoint;
  private url = environment.urlEndPoint;

  constructor( private httpClient: HttpClient ) {
    
  }

  getAllClientes = async(): Promise<ClienteDTO[]> => {
    return await this.httpClient.get(`${this.url}clientes`).toPromise() as Promise<ClienteDTO[]>;
  }

  getClienteById = async(id: number): Promise<ClienteDTO> => {
    return await this.httpClient.get(`${this.url}clientes/${id}`).toPromise() as Promise<ClienteDTO>;
  }

  getAllProvincias = async(): Promise<ProvinciaDTO[]> => {
    return await this.httpClient.get(`${this.url}provincias`).toPromise() as Promise<ProvinciaDTO[]>;
  }

  getAllMunicipios = async(): Promise<MunicipioDTO[]> => {
    return await this.httpClient.get(`${this.url}municipios`).toPromise() as Promise<MunicipioDTO[]>;
  }

  getMunicipiosProvincia = async(id: number): Promise<MunicipioDTO[]> => {
    return await this.httpClient.get(`${this.url}municipios/provincia/${id}`).toPromise() as Promise<MunicipioDTO[]>;
  }

  createCliente = async(cliente: ClienteDTO): Promise<any> => {
    return await this.httpClient.post(`${this.url}clientes`, cliente).toPromise();
  }

  updateCliente = async(cliente: ClienteDTO, id: string | number | null): Promise<any> => {
    return await this.httpClient.put(`${this.url}clientes/${id}`, cliente).toPromise();
  }

  getFilterClientes = async(dni: string, nombre: string): Promise<ClienteDTO[]> => {
    return await this.httpClient.get(`${this.url}clientes/filter/${dni}/${nombre}`).toPromise() as Promise<ClienteDTO[]>;
  }
  
}
