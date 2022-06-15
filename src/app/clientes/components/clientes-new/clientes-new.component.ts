import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { ProvinciaDTO } from '../../models/provincia.dto';
import { MunicipioDTO } from '../../models/municipio.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteDTO } from '../../models/cliente.dto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clientes-new',
  templateUrl: './clientes-new.component.html',
  styleUrls: ['./clientes-new.component.scss']
})
export class ClientesNewComponent implements OnInit {

  public provincias$: Promise<ProvinciaDTO[]> | undefined;
  public municipios$: Promise<MunicipioDTO[]> | undefined;

  cliente!: ClienteDTO;

  public clienteForm: FormGroup;
  isValidForm: boolean | null;

  nombre : FormControl;
  apellidos : FormControl;
  dni : FormControl;
  idioma : FormControl;
  email : FormControl;
  telefono1 : FormControl;
  telefono2 : FormControl;
  //formProvincia : FormControl;
  observaciones : FormControl;
  direccion : FormControl;
  cp : FormControl;
  idMunicipio  : FormControl;

  idProvincia !: FormControl;

 

  constructor(
    private clientesService: ClientesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { 

    this.isValidForm = null;
    this.cliente = new ClienteDTO(0, '', '', '', '', '', '', '', '','', '', 1);

    this.nombre = new FormControl(this.cliente.nombre, [
      Validators.required,
      Validators.maxLength(50),
    ]);

    this.apellidos = new FormControl(this.cliente.apellidos, [
      Validators.required,
      Validators.maxLength(50),
    ]);

    this.dni = new FormControl(this.cliente.dni, [
      Validators.required,
      Validators.maxLength(9),
    ]);

    this.idioma = new FormControl(this.cliente.idioma, [
      Validators.required,
    ]);

    this.email = new FormControl(this.cliente.email, [
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
      Validators.maxLength(50),
    ]);

    this.telefono1 = new FormControl(this.cliente.telefono1, [
      Validators.maxLength(10),
    ]);

    this.telefono2 = new FormControl(this.cliente.telefono2, [
      Validators.maxLength(10),
    ]);

    this.observaciones = new FormControl(this.cliente.observaciones, [
      Validators.maxLength(500),
    ]);

    this.direccion = new FormControl(this.cliente.direccion, [
      Validators.required,
      Validators.maxLength(100),
    ]);

    this.cp = new FormControl(this.cliente.cp, [
      Validators.maxLength(5),
    ]);

    this.idMunicipio = new FormControl(this.cliente.idMunicipio, [
      Validators.required,
    ]);

    this.idProvincia = new FormControl([
      Validators.required,
    ]);
    
    this.clienteForm = this.formBuilder.group({
      nombre: this.nombre,
      apellidos: this.apellidos,
      dni: this.dni,
      idioma: this.idioma,
      email: this.email,
      telefono1: this.telefono1,
      telefono2: this.telefono2,
      observaciones: this.observaciones,
      direccion: this.direccion,
      cp: this.cp,
      idMunicipio: this.idMunicipio,
    });
  }

  ngOnInit(): void {
    this.provincias$ = this.clientesService.getAllProvincias();
    this.municipios$ = this.clientesService.getMunicipiosProvincia(environment.idProvinciaDefault);

    //Valores por defecto en formulario
    this.idProvincia.setValue(environment.idProvinciaDefault);
    this.idMunicipio.setValue(environment.idMunicipioDefault);
    this.idioma.setValue('es');
    


    console.log(this.provincias$);
    console.log(this.municipios$);
  }

  saveCliente(): void {
    //this.isValidForm = false;

    if (this.clienteForm.invalid) {
      return;
    }

    this.cliente = this.clienteForm.value;
    //console.log(this.cliente);

    if (this.clienteForm.valid) {
      this.clientesService.createCliente(this.cliente).then(res => {
        //console.log(res);
        //console.log("ESte es:  " + res.id);
        alert('El cliente fue creado correctamente.');
        this.router.navigateByUrl('/clientes/' + res.id);
      }).catch(err => {
        alert('Ocurrio un error');
        console.log(err);
      });
    }
  }

  filtrarMunicipios() {
    let idProvincia = this.idProvincia.value;
    this.municipios$ = this.clientesService.getMunicipiosProvincia(idProvincia);
  }

}
