import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {

  public usuarios$: Promise<UsuarioDTO[]> | undefined;
  public usuario$: Promise<UsuarioDTO> | undefined;

  usuario!: UsuarioDTO;
  idUsuarioDel: number = 0;   //id de usuario a borrar

  public usuarioForm: FormGroup;
  public usuarioUpdForm: FormGroup;
  isValidForm: boolean | null;

  id : number = 0;
  nombre : FormControl;
  login  : FormControl;
  email : FormControl;
  password : FormControl;
  permiso : FormControl;
  remember_token : FormControl;

  idUpd : number = 0;
  nombreUpd : FormControl;
  loginUpd  : FormControl;
  emailUpd : FormControl;
  passwordUpd : FormControl;
  permisoUpd : FormControl;
  remember_tokenUpd : FormControl;

  constructor(
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) { 

    this.isValidForm = null;
    this.usuario = new UsuarioDTO(0, '', '', '', '', 1, '');

    this.nombre = new FormControl(this.usuario.nombre, [
      Validators.required,
      Validators.maxLength(30),
    ]);

    this.nombreUpd = new FormControl(this.usuario.nombre, [
      Validators.required,
      Validators.maxLength(30),
    ]);

    this.login = new FormControl(this.usuario.login, [
      Validators.required,
      Validators.maxLength(10),
    ]);

    this.loginUpd = new FormControl(this.usuario.login, [
      Validators.required,
      Validators.maxLength(10),
    ]);

    this.email = new FormControl(this.usuario.email, [
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
      Validators.maxLength(50),
    ]);

    this.emailUpd = new FormControl(this.usuario.email, [
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
      Validators.maxLength(50),
    ]);

    this.password = new FormControl(this.usuario.password, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]);

    this.passwordUpd = new FormControl(this.usuario.password, [
      //Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]);

    this.permiso = new FormControl(this.usuario.permiso, [
      Validators.required,
    ]);

    this.permisoUpd = new FormControl(this.usuario.permiso, [
      Validators.required,
    ]);

    this.remember_token = new FormControl(this.usuario.remember_token, [
      //Validators.required,
    ]);

    this.remember_tokenUpd = new FormControl(this.usuario.remember_token, [
      //Validators.required,
    ]);

    

    this.usuarioForm = this.formBuilder.group({
      nombre: this.nombre,
      login: this.login,
      email: this.email,
      password: this.password,
      permiso: this.permiso,
      remember_token: this.remember_token
    });

    this.usuarioUpdForm = this.formBuilder.group({
      nombre: this.nombreUpd,
      login: this.loginUpd,
      email: this.emailUpd,
      password: this.passwordUpd,
      permiso: this.permisoUpd,
      remember_token: this.remember_tokenUpd
    });

  }

  ngOnInit(): void {

    this.usuarios$ = this.usuariosService.getAllUsuarios();
    console.log(this.usuarios$);
  }

  saveUsuario(): void {
    //this.isValidForm = false;
    const currentRouter = this.router.url;

    if (this.usuarioForm.invalid) {
      return;
    }

    this.usuario = this.usuarioForm.value;
    //console.log(this.cliente);

    if (this.usuarioForm.valid) {
      this.usuariosService.createUsuario2(this.usuario).then(res => {
        //console.log(res);
        //console.log("ESte es:  " + res.id);
        alert('El usuario fue creado correctamente.');
        //this.router.navigate([currentRouter]);
        //location.reload();
        this.usuarios$ = this.usuariosService.getAllUsuarios();   //recargamos de nuevo el listado de usuarios
      }).catch(err => {
        alert('Ocurrio un error');
        console.log(err);
      });
    }
  }

  //Rellena el formulario con los campos del usario a modificar
  setFormUpdateUsuario(idUsuario: number) {

    console.log(idUsuario);

    this.usuariosService.getUsuarioById(idUsuario).then(res => {

      console.log(res);

      this.idUpd = idUsuario;
      this.nombreUpd.setValue(res.nombre);
      this.loginUpd.setValue(res.login);
      this.emailUpd.setValue(res.email);
      this.passwordUpd.setValue('');
      this.permisoUpd.setValue(res.permiso);
      this.remember_tokenUpd.setValue(res.remember_token);

    }) .catch(err => {
      alert("Ocurrió un error");
      console.log(err);
    });

  }

  //Actualiza variable con ID de usuario a eliminar
  setFormDeleteUsuario(idUsuario: number) {
    this.idUsuarioDel = idUsuario;
  }

  updateUsuario(): void {

    //this.isValidForm = false;
    const currentRouter = this.router.url;
    

    if (this.usuarioUpdForm.invalid) {
      return;
    }

    this.usuario = this.usuarioUpdForm.value;
    //console.log("Usuario form guardar: "+ this.idUpd);
    //console.log("Usuario form: "+ this.usuarioUpdForm.value);
    //console.log("Usuario guradar: "+ this.usuarioUpdForm.value);

    if (this.usuarioUpdForm.valid) {
      this.usuariosService.updateUsuario(this.usuario, this.idUpd).then(res => {
        console.log(res);
        //console.log("ESte es:  " + res.id);
        alert('El usuario fue actualizado correctamente.');
        //this.router.navigate([currentRouter]);
        //location.reload();
        this.usuarios$ = this.usuariosService.getAllUsuarios();
      }).catch(err => {
        alert('Ocurrio un error');
        console.log(err);
      });


    }
  }

  deleteUsuario(): void {

    console.log("Hola");

    this.usuariosService.deleteUsuarioById(this.idUsuarioDel).then(res => {
      console.log(res);
      //console.log("ESte es:  " + res.id);
      alert('El usuario ha sido eliminado  correctamente.');
      this.usuarios$ = this.usuariosService.getAllUsuarios();
    }).catch(err => {
      alert('Ocurrio un error');
      console.log(err);
    });
    
  }

}

