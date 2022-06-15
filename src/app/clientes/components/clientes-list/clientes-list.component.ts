import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit {

  public clientes$: Promise<ClienteDTO[]> | undefined;
  public numClientes = 0;

  public filterForm: FormGroup;
  isValidForm: boolean | null;

  cliente!: ClienteDTO;

  dni : FormControl;
  nombre : FormControl;

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { 

      this.isValidForm = null;
      this.cliente = new ClienteDTO(0, '', '', '', '', '', '', '', '','', '', 1);

      this.nombre = new FormControl(this.cliente.nombre, [
        Validators.maxLength(50),
      ]);

      this.dni = new FormControl(this.cliente.dni, [
        Validators.maxLength(9),
      ]);

      this.filterForm = this.formBuilder.group({
        nombre: this.nombre,
        dni: this.dni,
      });

  }

  ngOnInit(): void {
    this.clientes$ = this.clientesService.getAllClientes().then(clientesList => {
      this.numClientes = clientesList.length;
      return clientesList;
    })
    //console.log(this.clientes$);
    
  }

  clientesFilter(){

    let dni: string = this.dni.value;
    let nombre: string = this.nombre.value;

    if(dni === "" && nombre === "") {
      this.clientes$ = this.clientesService.getAllClientes().then(clientesList => {
        this.numClientes = clientesList.length;
        return clientesList;
      })
    } else {
      if (dni === "")  
        dni = "1";    //damos un valor por defecto para que no falle la consulta a la api
      if (nombre === "")  
        nombre = "1";

      this.clientes$ = this.clientesService.getFilterClientes(dni, nombre).then(clientesList => {
        this.numClientes = clientesList.length;
        return clientesList;
      })
      //console.log(this.clientes$);
    }

  }

}
