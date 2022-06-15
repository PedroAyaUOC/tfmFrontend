import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioDTO } from '../models/usuario.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = environment.urlEndPoint;

  constructor( private http: HttpClient ) {
    
  }

  getAllUsuarios = async(): Promise<UsuarioDTO[]> => {
    return await this.http.get(`${this.url}usuarios`).toPromise() as Promise<UsuarioDTO[]>;
  }

  getUsuarioById = async(id: number): Promise<UsuarioDTO> => {
    return await this.http.get(`${this.url}usuarios/${id}`).toPromise() as Promise<UsuarioDTO>;
  }

  createUsuario = async(usuario: UsuarioDTO): Promise<any> => {
    return await this.http.post(`${this.url}register`, usuario).toPromise();
  }

  createUsuario2 = async(usuario: UsuarioDTO): Promise<any> => {
    return await this.http.post(`${this.url}usuarios`, usuario).toPromise();
  }

  updateUsuario = async(usuario: UsuarioDTO, id: string | number | null): Promise<any> => {
    return await this.http.put(`${this.url}usuarios/${id}`, usuario).toPromise();
  }

  deleteUsuarioById = async(id: number): Promise<any> => {
    return await this.http.delete(`${this.url}usuarios/${id}`).toPromise();
  }

}
