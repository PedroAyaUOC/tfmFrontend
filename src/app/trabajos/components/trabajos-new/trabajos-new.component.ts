import { Component, OnInit, ViewChild } from '@angular/core';
import { ProvinciaDTO } from '../../models/provincia.dto';
import { MunicipioDTO } from '../../models/municipio.dto';
import { TrabajoDTO } from '../../models/trabajo.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrabajosService } from '../../services/trabajos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ClienteDTO } from '../../../clientes/models/cliente.dto';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { TipoTrabajoDTO } from '../../models/tipoTrabajo.dto';

//import { GoogleMapsModule } from '@angular/google-maps'
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { DatePipe } from '@angular/common';

import { HttpClient, HttpHeaders } from '@angular/common/http';     //headers cors


@Component({
  selector: 'app-trabajos-new',
  templateUrl: './trabajos-new.component.html',
  styleUrls: ['./trabajos-new.component.scss']
})
export class TrabajosNewComponent implements OnInit {
  

  public coorXDefault: string = environment.coorXDefault;
  public coorYDefault: string = environment.coorYDefault;

  /*public position = {
    lat: parseFloat(this.coorXDefault),
    lng: parseFloat(this.coorYDefault)
  };*/

  public clientesList$: Promise<ClienteDTO[]> | undefined;
  public tiposTrabajoList$: Promise<TipoTrabajoDTO[]> | undefined;
  public provincias$: Promise<ProvinciaDTO[]> | undefined;
  public municipios$: Promise<MunicipioDTO[]> | undefined;

  trabajo!: TrabajoDTO;

  public trabajoForm: FormGroup;
  isValidForm: boolean | null;

  fEntrada : FormControl;
  expediente : FormControl;
  descripcion : FormControl;
  observaciones : FormControl;
  coordenadaX : FormControl;
  coordenadaY : FormControl;
  refCatastro : FormControl;
  direccion : FormControl;
  idMunicipio  : FormControl;
  idTipo  : FormControl;
  idCliente  : FormControl;

  idProvincia !: FormControl;

  /************** MAPA ******************** */

  public mapa: any;
  public marcador: any;

  public options = {
    zoom: 16,	//MIN 1 MAX 23
    center: new google.maps.LatLng(parseFloat(this.coorXDefault), parseFloat(this.coorYDefault)),	//indicamos el centro del mapa con las coordenadas
    mapTypeId: google.maps.MapTypeId.HYBRID,	//Tipo de mapa
 
    //Opcionales
    zoomControl: true,			//Habilita el control de zoom en el mapa
    backgroundColor: '#ffffff',	//color de fondo del contenedor (#E5E3DF)
    noClear: true,				//habilita que pueda haber elementos encima del mapa con css (false)
    disableDefaultUI: true,		//mostrar UI predefinido (false)
    keyboardShortcuts: false,	//habilita el uso del teclado (true)
    disableDoubleClickZoom: true,	//habilita el zoom con doble click (false)
    draggable: true,			//habilita poder arrastrar el mapa (true)
    scrollwheel: true,			//habilita el zoom con el scroll del ratón (true)
    draggableCursor: 'move',	//tipo de cursor cuando el raton esta encima
    draggingCursor: 'move',		//tipo de cursor cuando el raton arrastra
    
    mapTypeControl: true,		//habilita o inhabilita el control de tipo de mapa
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, 
        position: google.maps.ControlPosition.TOP_LEFT,
        mapTypeIds: [
            google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.HYBRID
        ]
    },
    
    navigationControl: true,	//habilita el control de navegación
    streetViewControl: true,	//habilita street view (false)
    navigationControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
        //, //style: google.maps.NavigationControlStyle.ANDROID
    },
    scaleControl: true,
    scaleControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
        , style: google.maps.ScaleControlStyle.DEFAULT
    }
  };

  constructor(
    private trabajoService: TrabajosService,
    private clienteService: ClientesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private http: HttpClient
  ) { 

    this.isValidForm = null;
    this.trabajo = new TrabajoDTO(0, new Date(), '', '', '', '', '', '', '', 1, 1, 1);

    this.fEntrada = new FormControl(this.trabajo.fEntrada, [
      //Validators.required,
    ]);

    this.expediente = new FormControl(this.trabajo.expediente, [
      //Validators.required,
      Validators.maxLength(10),
    ]);

    this.descripcion = new FormControl(this.trabajo.descripcion, [
      Validators.required,
      Validators.maxLength(100),
    ]);

    this.observaciones = new FormControl(this.trabajo.observaciones, [
      Validators.maxLength(500),
    ]);

    this.coordenadaX = new FormControl(this.trabajo.coordenadaX, [
      //Validators.required,
      Validators.maxLength(10),
    ]);

    this.coordenadaY = new FormControl(this.trabajo.coordenadaY, [
      //Validators.required,
      Validators.maxLength(10),
    ]);

    this.refCatastro = new FormControl(this.trabajo.refCatastro, [
      Validators.maxLength(20),
    ]);

    this.direccion = new FormControl(this.trabajo.direccion, [
      Validators.required,
      Validators.maxLength(100),
    ]);

    this.idMunicipio = new FormControl(this.trabajo.idMunicipio, [
      Validators.required,
    ]);

    this.idTipo = new FormControl(this.trabajo.idTipo, [
      Validators.required,
    ]);

    this.idCliente = new FormControl(this.trabajo.idCliente, [
      Validators.required,
    ]);

    this.idProvincia = new FormControl([
      Validators.required,
    ]);

    this.trabajoForm = this.formBuilder.group({
      fEntrada: this.fEntrada,
      expediente: this.expediente,
      descripcion: this.descripcion,
      observaciones: this.observaciones,
      coordenadaX: this.coordenadaX,
      coordenadaY: this.coordenadaY,
      refCatastro: this.refCatastro,
      direccion: this.direccion,
      idMunicipio: this.idMunicipio,
      idTipo: this.idTipo,
      idCliente: this.idCliente,
    });

  }

  ngOnInit(): void {

    let fecha = this.datePipe.transform(new Date(),"yyyy-MM-dd");
    //fecha.toLocaleDateString()

    this.clientesList$ = this.clienteService.getAllClientes();
    this.tiposTrabajoList$ = this.trabajoService.getAllTiposTrabajo();
    this.provincias$ = this.trabajoService.getAllProvincias();
    this.municipios$ = this.trabajoService.getMunicipiosProvincia(environment.idProvinciaDefault);

    //Asignamos valores por defecto a campos ocultos
    this.fEntrada.setValue(fecha);
    this.expediente.setValue('EXP-1/2022');   //Por ahora la numeración no está implementada, se hará + adelante
    this.coordenadaX.setValue(this.coorXDefault);
    this.coordenadaY.setValue(this.coorYDefault);

    //Valores por defecto en formulario
    this.idProvincia.setValue(environment.idProvinciaDefault);
    this.idMunicipio.setValue(environment.idMunicipioDefault);


    /************** MAPAS ***************** */
    let divMapa = document.getElementById('mapNewTrabajo') as HTMLElement;

    this.mapa = new google.maps.Map( divMapa, this.options) ;
    var styles =[
    	{
    		featureType: "all",
	    	elementType: "labels",
	    	stylers: [
	      		{ visibility: "off" }
	    	]
    	},
    	{
    		featureType: "road",
	    	elementType: "labels",
	    	stylers: [
	      		{ visibility: "on" }
	    	]
    	}
    ];
    this.mapa.setOptions({styles: styles});


    //Configuramos marcador
    this.marcador = new google.maps.Marker({
      position: this.mapa.getCenter(),
      map: this.mapa, 
      animation: google.maps.Animation.DROP,
      draggable: true, 
      visible:false,
      title:"Trabajo",
      //icon: "../../img/maps/icoTrabajo.png"
    });

    this.mapa.addListener("click", (e : any) => {
      let latitud = e.latLng.lat();
      let longitud = e.latLng.lng();
      
      var coordenadas = new google.maps.LatLng(latitud, longitud);
      //marcador.setMap(null);
      this.marcador.setPosition(coordenadas);
      this.marcador.setVisible(true);
      this.marcador.setDraggable(true);

      this.coordenadaX.setValue(latitud.toFixed(6));
      this.coordenadaY.setValue(longitud.toFixed(6));

      this.getRefCatastro(this.coordenadaX.value, this.coordenadaY.value);
    
    });

    //Actualizar coordenadas al arrastrar marcador
    this.marcador.addListener("dragend", (e : any) => {
      let markerLatLng= this.marcador.getPosition();
    	
      this.coordenadaX.setValue(markerLatLng.lat().toFixed(6));
      this.coordenadaY.setValue(markerLatLng.lng().toFixed(6));

      this.getRefCatastro(this.coordenadaX.value, this.coordenadaY.value);
    });

    //FUNCIÓN QUE CENTRA EL MAPA AL PULSAR EL MARCADOR
    this.marcador.addListener("click", (e : any) => {

      let center = new google.maps.LatLng(this.coordenadaX.value, this.coordenadaY.value);
      this.mapa.panTo(center);
      
    });


    
   


  }

  getRefCatastro (coorX: string, coorY: string) {
    this.trabajoService.getRefCatastro(coorX, coorY).then(res => {
      console.log("Respuesta servidor XML: " + res);
      this.refCatastro.setValue(res);
    }).catch(err => {
      alert('Ocurrio un error');
      console.log(err);
    });
  }

  showCatastro(){

    const numProvincia = '04';
    const numMunicipio = '17';
    let rc = this.trabajoForm.controls['refCatastro'].value;
    window.open("https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?del="+ numProvincia +"&muni="+ numMunicipio +"&rc1="+ rc.substring(0,7) +"&rc2="+ rc.substring(7,14) +"", '_blank');
  }
  
  saveTrabajo(): void {
    this.isValidForm = false;

    if (this.trabajoForm.invalid) {
      return;
    }

    this.isValidForm = true;

    this.trabajo = this.trabajoForm.value;
    console.log(this.trabajo);

    if (this.trabajoForm.valid) {
      this.trabajoService.createTrabajo(this.trabajo).then(res => {
        console.log(res);
        //console.log("ESte es:  " + res.id);
        alert('El trabajo fue creado correctamente.');
        this.router.navigateByUrl('/trabajos/' + res.id);
      }).catch(err => {
        alert('Ocurrio un error');
        console.log(err);
      });
    }
  }

  filtrarMunicipios() {
    let idProvincia = this.idProvincia.value;
    this.municipios$ = this.trabajoService.getMunicipiosProvincia(idProvincia);
  }

  /*eventHandler(event: any ,name:string){
    console.log(event,name);
    
    // Add marker on double click event
    if(name === 'mapClick'){
      this.dropMarker(event);
    }
  }*/


}
