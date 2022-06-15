import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { MunicipioDTO } from '../../models/municipio.dto';
import { ProvinciaDTO } from '../../models/provincia.dto';
import { TrabajoDTO } from 'src/app/trabajos/models/trabajo.dto';
import { TrabajosService } from 'src/app/trabajos/services/trabajos.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes-info',
  templateUrl: './clientes-info.component.html',
  styleUrls: ['./clientes-info.component.scss']
})
export class ClientesInfoComponent implements OnInit {

  public cliente$: Promise<ClienteDTO> | undefined;
  public provincias$: Promise<ProvinciaDTO[]> | undefined;
  public municipios$: Promise<MunicipioDTO[]> | undefined;
  public trabajos$: Promise<TrabajoDTO[]> | undefined;
  public numTrabajos = 0;
  public idCliente!: number;

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
  observaciones : FormControl;
  direccion : FormControl;
  cp : FormControl;
  idMunicipio  : FormControl;
  idProvincia : FormControl;

  constructor(
    private clientesService: ClientesService, 
    private trabajosService: TrabajosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute      //permite acceder a los parámetros
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
    
    this.getCliente();
    
    this.provincias$ = this.clientesService.getAllProvincias();
    this.trabajos$ = this.trabajosService.getAllTrabajosByIdCliente(this.idCliente).then(res => {
      this.numTrabajos = res.length;
      return res;
    });

  }

  getCliente = async() => {
    let routeParamId: string | number | null = this.activatedRoute.snapshot!.paramMap.get("id");   //snapshot puede ser nulo
    let municipio$: any;
    let idProvincia: number = 0;
    
    if (routeParamId) {
      routeParamId = parseInt(routeParamId);    //lo convertimos a número
      this.idCliente = routeParamId;
      this.clientesService.getClienteById(routeParamId).then(res => {

        this.trabajosService.getMunicipioById(res.idMunicipio).then(res => {
          idProvincia = res.idProvincia;
          //console.log("Res municpio: "+ res)
          this.municipios$ = this.clientesService.getMunicipiosProvincia(idProvincia).then(res => {
            this.idProvincia.setValue(idProvincia); 
            //console.log("Res municipios: "+ res)
            return res;
          });

        });
          
        this.nombre.setValue(res.nombre);
        this.apellidos.setValue(res.apellidos);
        this.dni.setValue(res.dni);
        this.idioma.setValue(res.idioma);
        this.email.setValue(res.email);
        this.telefono1.setValue(res.telefono1);
        this.telefono2.setValue(res.telefono2);
        this.observaciones.setValue(res.observaciones);
        this.direccion.setValue(res.direccion);
        this.cp.setValue(res.cp);
        this.idMunicipio.setValue(res.idMunicipio);

        //console.log(res);

      }) .catch(err => {
        alert("Ocurrió un error");
        console.log(err);
      });
    }
  }

  saveCliente(): void {
    //this.isValidForm = false;

    if (this.clienteForm.invalid) {
      return;
    }

    this.cliente = this.clienteForm.value;
    console.log(this.cliente);

    if (this.clienteForm.valid) {
      this.clientesService.updateCliente(this.cliente, this.idCliente).then(res => {
        console.log(res);
        //console.log("ESte es: " + res.id);
        alert('El cliente fue guardado correctamente.');
        //this.router.navigateByUrl('/clientes/' + res.id);
        //location.reload();
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
