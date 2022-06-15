import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataSession } from 'src/app/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  loggedIn = false;

  constructor(
    private router: Router,
    public userSession: UserDataSession ) { }

  ngOnInit() {
    this.loggedIn = localStorage.getItem('token') !== null;

  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
 
}
