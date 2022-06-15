import { Injectable } from "@angular/core";

@Injectable()
export class UserDataSession {
    id: string = '0';
    nombre: string = '';
    siglas: string = '';
    login: string = '';
    email: string = '';
    password: string = '';
    permiso: number = 0;
    permisoText: string = '';
    remember_token: string = '';

}