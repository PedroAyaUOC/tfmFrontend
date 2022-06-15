import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataSession } from 'src/app/global';


@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit {

  private url = 'http://localhost:8000/api/user';
  user: any;


  constructor( 
    private http: HttpClient, 
    private router: Router,
    public userSession: UserDataSession  ) { }

  ngOnInit(): void {
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem( 'token' )}`
    });

    this.http.get( this.url, {headers: headers} ).subscribe(
       
      (result) => {
        this.user = result;
        console.log(result);
        this.userSession.id = this.user.id;
        this.userSession.nombre = this.user.nombre;
        this.userSession.siglas = this.user.nombre.substring(0, 2);
        this.userSession.login = this.user.login;
        this.userSession.email = this.user.email;
        this.userSession.permiso  = this.user.permiso;
        if(this.user.permiso) 
          this.userSession.permisoText = 'Administrador';
        else
          this.userSession.permisoText = 'Editor';
      
        this.router.navigateByUrl('/dashboard');
        
      },
      (error) => {
        localStorage.removeItem( 'token' );
        console.log(error);
        this.router.navigateByUrl('/login');
      }

    );
  }

}
