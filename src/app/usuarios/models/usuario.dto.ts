export class UsuarioDTO {
  id: number;
  nombre: string; 
  login: string;
  email: string; 
  password: string;
  permiso: number;
  remember_token: string;

  constructor (
		id: number, 
    nombre: string, 
    login: string, 
    email: string, 
    password: string,
    permiso: number,
    remember_token: string
	) {
		this.id = id;
    this.nombre = nombre; 
    this.login = login; 
   	this.email = email;
    this.password = password;
    this.permiso = permiso;
    this.remember_token = remember_token;
	}
}