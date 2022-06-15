import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrabajosService } from '../../services/trabajos.service';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { TrabajoDTO } from '../../models/trabajo.dto';
import { ClienteDTO } from '../../../clientes/models/cliente.dto';
import { ProvinciaDTO } from '../../models/provincia.dto';
import { MunicipioDTO } from '../../models/municipio.dto';
import { TipoTrabajoDTO } from '../../models/tipoTrabajo.dto';
import { ArchivoDTO } from '../../models/archivo.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trabajos-info',
  templateUrl: './trabajos-info.component.html',
  styleUrls: ['./trabajos-info.component.scss']
})
export class TrabajosInfoComponent implements OnInit {

  public coorX: string = environment.coorXDefault;
  public coorY: string = environment.coorYDefault;

  public trabajo$: Promise<TrabajoDTO> | undefined;
  public archivos$: Promise<ArchivoDTO[]> | undefined;
  public numArchivos = 0; 

  public clientesList$: Promise<ClienteDTO[]> | undefined;
  public tiposTrabajoList$: Promise<TipoTrabajoDTO[]> | undefined;
  public provincias$: Promise<ProvinciaDTO[]> | undefined;
  public municipios$: Promise<MunicipioDTO[]> | undefined;

  public idTrabajo!: number;
  public idArchivoDel: number = 0;   //id de usuario a borrar
  public archivoUp!: File;

  trabajo!: TrabajoDTO;
  archivo!: ArchivoDTO;

  public trabajoForm: FormGroup;
  public newArchivoForm: FormGroup;
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
  
  titulo  : FormControl;
  fichero  : FormControl;

  /******** MAPA ************/

  public mapa: any;
  public marcador: any;

  public options = {
    zoom: 16,	//MIN 1 MAX 23
    center: new google.maps.LatLng(parseFloat(this.coorX), parseFloat(this.coorY)),	//indicamos el centro del mapa con las coordenadas
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

  public styles =[
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
  

  constructor(
    private trabajosService: TrabajosService, 
    private activatedRoute: ActivatedRoute,      //permite acceder a los parámetros
    private clientesService: ClientesService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { 

    this.isValidForm = null;
    this.trabajo = new TrabajoDTO(0, new Date(), '', '', '', '', '', '', '', 1, 1, 1);
    this.archivo = new ArchivoDTO(0, new Date(), '', '', 0);

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
      idCliente: this.idCliente
    });

    this.titulo = new FormControl(this.archivo.titulo, [
      Validators.required,
      Validators.maxLength(100),
    ]);

    this.fichero = new FormControl(this.archivo.slug, [
      Validators.required,
    ]);

    this.newArchivoForm = this.formBuilder.group({
      titulo: this.titulo,
      fichero: this.fichero,
    });

  }

  ngOnInit(): void {

    this.provincias$ = this.trabajosService.getAllProvincias();
    this.clientesList$ = this.clientesService.getAllClientes();
    this.tiposTrabajoList$ = this.trabajosService.getAllTiposTrabajo();
    this.getTrabajo();
    this.getArchivos();
    
  }

  private setMap(): void {

    /************** MAPAS ******************/
    let divMapa = document.getElementById('mapInfoTrabajo') as HTMLElement;

    let center = new google.maps.LatLng(parseFloat(this.coordenadaX.value), parseFloat(this.coordenadaY.value));
    this.options.center = center;
    this.mapa = new google.maps.Map( divMapa, this.options) ;
   
    this.mapa.setOptions({styles: this.styles});

    //Centramos mapa a ubicación de trabajo
    //let center = new google.maps.LatLng(parseFloat(this.coordenadaX.value), parseFloat(this.coordenadaY.value));
    this.mapa.panTo(center);

    //Configuramos marcador
    this.marcador = new google.maps.Marker({
      position:  new google.maps.LatLng(parseFloat(this.coordenadaX.value), parseFloat(this.coordenadaY.value)),
      map: this.mapa, 
      animation: google.maps.Animation.DROP,
      draggable: true, 
      visible:true,
      title:"Trabajo",
      //icon: "../../img/maps/icoTrabajo.png"
    });

    //Cambiar posición marcador al hacer clic en el mapa
    this.mapa.addListener("click", (e : any) => {
      let latitud = e.latLng.lat();
      let longitud = e.latLng.lng();
      
      var coordenadas = new google.maps.LatLng(latitud, longitud);
      //marcador.setMap(null);
      this.marcador.setPosition(coordenadas);
      this.marcador.setVisible(true);
      this.marcador.setDraggable(true);

      //Actualizamos coordenadas formulario
      this.coordenadaX.setValue(latitud.toFixed(6));
      this.coordenadaY.setValue(longitud.toFixed(6));

      this.getRefCatastro(this.coordenadaX.value, this.coordenadaY.value);
    
    });

    //ACTUALIZAR COORDENADAS AL ARRASTRAR MARCADOR
    this.marcador.addListener("dragend", (e : any) => {
      let markerLatLng= this.marcador.getPosition();
    	
      //Actualizamos coordenadas formulario
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

  getTrabajo = async() => {
    let idProvincia : number;
    let municipio$ : any;
    let routeParamId: string | number | null = this.activatedRoute.snapshot!.paramMap.get("id");   //snapshot puede ser nulo
    if (routeParamId) {
      this.idTrabajo = parseInt(routeParamId);
      routeParamId = parseInt(routeParamId);    //lo convertimos a número
      this.trabajosService.getTrabajoById(routeParamId).then(res => {

        //console.log(res);
        municipio$ = this.trabajosService.getMunicipioById(res.idMunicipio).then(res => {
          idProvincia = res.idProvincia;
          //console.log("Res municpio: "+ res)
          this.municipios$ = this.clientesService.getMunicipiosProvincia(idProvincia).then(res => {
            this.idProvincia.setValue(idProvincia); 
            //console.log("Res municipios: "+ res)
            return res;
          });

        });

        //Asignamos valores al formulario
        this.fEntrada.setValue(res.fEntrada);
        this.expediente.setValue(res.expediente);
        this.descripcion.setValue(res.descripcion);
        this.observaciones.setValue(res.observaciones);
        this.coordenadaX.setValue(res.coordenadaX);
        this.coordenadaY.setValue(res.coordenadaY);
        this.refCatastro.setValue(res.refCatastro);
        this.direccion.setValue(res.direccion);
        this.idMunicipio.setValue(res.idMunicipio);
        this.idTipo.setValue(res.idTipo);
        this.idCliente.setValue(res.idCliente);

        //Dibujamos mapa
        this.setMap();
        

      }) .catch(err => {
        alert("Ocurrió un error");
        console.log(err);
      });
    }
  }

  getArchivos = async() => {
    let routeParamId: string | number | null = this.activatedRoute.snapshot!.paramMap.get("id");   //snapshot puede ser nulo
    if (routeParamId) {
      routeParamId = parseInt(routeParamId);    //lo convertimos a número
      this.archivos$ = this.trabajosService.getArchivosTrabajoById(routeParamId).then(res => {
        this.numArchivos = res.length;
        return res;
      });
    }
  }

  saveTrabajo(): void {
    //this.isValidForm = false;

    if (this.trabajoForm.invalid) {
      return;
    }

    this.trabajo = this.trabajoForm.value;
    //console.log(this.trabajo);

    if (this.trabajoForm.valid) {
      this.trabajosService.updateTrabajo(this.trabajo, this.idTrabajo).then(res => {
        //console.log(res);
        //console.log("ESte es:  " + res.id);
        alert('El trabajo fue guardado correctamente.');
        //this.router.navigateByUrl('/trabajos/' + res.id);
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

  showCatastro(){

    const numProvincia = '04';
    const numMunicipio = '17';
    let rc = this.trabajoForm.controls['refCatastro'].value;
    window.open("https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?del="+ numProvincia +"&muni="+ numMunicipio +"&rc1="+ rc.substring(0,7) +"&rc2="+ rc.substring(7,14) +"", '_blank');
  }

  getRefCatastro (coorX: string, coorY: string) {
    this.trabajosService.getRefCatastro(coorX, coorY).then(res => {
      console.log("Respuesta servidor XML: " + res);
      this.refCatastro.setValue(res);
    }).catch(err => {
      alert('Ocurrio un error');
      console.log(err);
    });
  }

  uploadFile(event : any) {
    this.archivoUp = event.target.files[0];
  }
    
  saveArchivo(){
    //this.isValidForm = false;

    if (this.newArchivoForm.invalid) {
      return;
    }

    //this.isValidForm = true;

    this.archivo.idTrabajo = this.idTrabajo;
    this.archivo.fCreacion = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    this.archivo.titulo = this.titulo.value;
    this.archivo.slug = this.makeSlug();

    console.log(this.archivo);

    if (this.newArchivoForm.valid) {

      this.trabajosService.createArchivo(this.archivo).then(res => {
        console.log(res);
        //console.log("ESte es:  " + res.id);
        //alert('El archivo fue creado correctamente.');
        //this.router.navigateByUrl('/trabajos/' + res.id);

        this.trabajosService.uploadArchivo(res.id, this.archivoUp).then(res => {
          console.log(res);
          //console.log("ESte es:  " + res.id);
          alert('El archivo fue subido correctamente.');
          //this.router.navigateByUrl('/trabajos/' + res.id)
  
          this.getArchivos();
        }).catch(err => {
          alert('Ocurrio un error');
          console.log(err);
        });
      

      }).catch(err => {
        alert('Ocurrio un error');
        console.log(err);
      });
    }
  }

  deleteArchivo(): void {

    this.trabajosService.deleteArchivoById(this.idArchivoDel).then(res => {
      console.log(res);
      //console.log("ESte es:  " + res.id);
      alert('El archivo ha sido eliminado  correctamente.');
      //location.reload();
      this.getArchivos();
    }).catch(err => {
      alert('Ocurrio un error');
      console.log(err);
    });
    
  }

  //Actualiza variable con ID de archivo a eliminar
  setFormDeleteArchivo(idArchivo: any) {
    this.idArchivoDel = idArchivo;
  }

  makeSlug() {
    let length = 30;
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
