import { Component, OnInit } from '@angular/core';
import {TrabajosService } from '../../services/trabajos.service';
import { TrabajoDTO } from '../../models/trabajo.dto';
import { TipoTrabajoDTO } from '../../models/tipoTrabajo.dto';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trabajos-list',
  templateUrl: './trabajos-list.component.html',
  styleUrls: ['./trabajos-list.component.scss']
})
export class TrabajosListComponent implements OnInit {

  isShown: boolean = false ; // hidden by default
  public numTrabajos: number = 0;

  public trabajos$: Promise<TrabajoDTO[]> | undefined;
  public tiposTrabajo$: Promise<TipoTrabajoDTO[]> | undefined;

  public idTipo : FormControl;
  public fInicio : FormControl;
  public fFin : FormControl;

  public filterForm: FormGroup;

  public mapa: any;
  public marcadores: any[] = [];
  public coorXDefault: string = environment.coorXDefault;
  public coorYDefault: string = environment.coorYDefault;
  public infoWindow = new google.maps.InfoWindow;


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
    private router: Router,
    private formBuilder: FormBuilder,
    ) {
      this.idTipo = new FormControl([
        //Validators.maxLength(50),
      ]);

      this.fInicio = new FormControl([
        //Validators.maxLength(9),
      ]);

      this.fFin = new FormControl([
        //Validators.maxLength(9),
      ]);

      this.filterForm = this.formBuilder.group({
        idTipo: this.idTipo,
        fInicio: this.fInicio,
        fFin: this.fFin
      });
  }

  ngOnInit(): void {

    this.tiposTrabajo$ = this.trabajosService.getAllTiposTrabajo();
    this.idTipo.setValue(0);

    //Cargamos los trabajos desde la api
    this.trabajos$ = this.trabajosService.getAllTrabajos().then(res => {
      console.log(res);
      console.log(res[0]['id']);
      
      this.numTrabajos = res.length;

      /************** MAPAS ***************** */
      let divMapa = document.getElementById('mapListTrabajo') as HTMLElement;

      this.mapa = new google.maps.Map( divMapa, this.options) ;
      this.mapa.setOptions({styles: this.styles});

      //Centramos mapa a ubicación de trabajo
      let center = new google.maps.LatLng(parseFloat(this.coorXDefault), parseFloat(this.coorYDefault));
      this.mapa.panTo(center);


      //Marcadores para solicitudes
      if(this.numTrabajos) {
        for (let i = 0; i < this.numTrabajos; i++) 
        {
          let aux= new Array();
            
          let marcador = new google.maps.Marker({
              position: new google.maps.LatLng(parseFloat(res[i]['coordenadaX']),parseFloat(res[i]['coordenadaY'])),
              map: this.mapa, 
              animation: google.maps.Animation.DROP,
              draggable: false, 
              visible:true,
              zIndex: i,
              title:""+res[i]['descripcion']+"",
              //icon: "../../img/maps/"icoTrabajo",
            });

          let fecha = new Date (res[i]['fEntrada']);
          
          //let contentString = "<div style='width:200px;text-align:left'><a style='color:#38A8E9;font-weight:bold;cursor:pointer' (click)='showTrabajo("+res[i]['id']+")'>"+res[i]['descripcion']+"</a><br /><span style='color:#4F4F4F;font-weight:bold'>Fecha: "+res[i]['fEntrada']+"</span><div>";
          let contentString = "<div style='width:200px;text-align:left'><a style='color:#38A8E9;font-weight:bold;cursor:pointer' onclick=\"location.href='/trabajos/"+res[i]['id']+"'\" >"+res[i]['descripcion']+"</a><br /><span style='color:#4F4F4F;font-weight:bold'>Fecha: "+ fecha.toLocaleDateString('es-CL') +"</span><div>";

                                                                                                                              
          //var contentString = ""+alertas[i]['tipoAlerta']+"</span><br /> <span style='color:#4F4F4F;font-weight:bold'>"+alertas[i]['infractor']+"<br />("+alertas[i]['fApertura']+")</span><br /> <span style='color:#4F4F4F'>"+ alertas[i]['nucleo'] + " - " + alertas[i]['direccion']+"</span><br /><br /> <span style='color:#4F4F4F'>"+alertas[i]['descripcion']+"</span><div>";	

          
          this.marcadores.push(marcador);	//Metemos para agrupar en MarkerCluster	

          marcador.addListener("click", () => {
            this.mapa.panTo(marcador.getPosition());
            this.infoWindow.setContent(contentString);
            this.infoWindow.open(this.mapa, marcador);
          });

        }
      }

      // Add a marker clusterer to manage the markers.
      //const markerClusterArray = new MarkerClusterer({ this.map, this.marcadores });
      //this.isShown = false;
      
      return res;

    }).catch(err => {
      alert('Ocurrio un error');
      console.log(err);
      return err;
    });

  }


  /*public showTrabajo(id:string) {
    this.router.navigateByUrl('/trabajos/' + id);
    console.log("adios");
  }*/



  public cambiarVista() : void {
    if(this.isShown) 
      this.isShown = false;
    else {
      this.isShown = true;
     //this.rehacerMapa();
      
      console.log("hola"); 
    }
  }

  public rehacerMapa(){
    google.maps.event.trigger(this.mapa, "resize");
  }

  
  public openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    console.log("hola"); 
    infoWindow.open(marker);
    console.log("adios"); 
  }
  

  trabajosFilter(){

    let idTipo: any = this.idTipo.value;
    let fInicio: string = this.fInicio.value;
    let fFin: string = this.fFin.value;

    console.log(idTipo);

    let empty = "";
   
    if(idTipo == 0 && fInicio === "" && fFin === "") {
      this.trabajos$ = this.trabajosService.getAllTrabajos().then(trabajosList => {
        this.numTrabajos = trabajosList.length;
        return trabajosList;
      })
    } else {

      if (fInicio == "")  
        fInicio = "1900-01-01";    //damos un valor por defecto para que no falle la consulta a la api
      if (fFin == "")  
        fFin = new Date().toJSON().slice(0,10).replace(/-/g,'-'); 

      this.trabajos$ = this.trabajosService.getFilterTrabajos(idTipo, fInicio, fFin).then(trabajosList => {
        this.numTrabajos = trabajosList.length;
        return trabajosList;
      })
      console.log(this.trabajos$);
    }

  }
  


}
