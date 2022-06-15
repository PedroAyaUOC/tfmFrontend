import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  constructor(private fb: FormBuilder, 
              private http: HttpClient,
              private router: Router) { }

  ngOnInit(): void {

    this.form = this.fb.group( {
      email: '',
      password: ''
    });
  }

  submit() {
    
    const formData = this.form.getRawValue();
    const url = 'http://127.0.0.1:8000/oauth/token'; //http://localhost:8000/oauth/token
    //const commands = ['/dashboard'];

    const data = {
      username: formData.email,
      password: formData.password,
      grant_type: 'password',
      client_id: 2,
      client_secret: 'HptEdDdvrhC0gE2dcYGPmAOq8NWBnGtKZUNYYb26',
      scope: '*'
    }

    this.http.post( url, data).subscribe(
     ( result: any) => {


        //console.log('success');
        //console.log(result);

        localStorage.setItem( 'token', result.access_token );
        this.router.navigate( ['/secure'] );

      },
      (error) => {
        console.log('error');
        console.log(error);

      }
    );
  }

}
