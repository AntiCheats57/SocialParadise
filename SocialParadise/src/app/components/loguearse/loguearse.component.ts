import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-loguearse',
  templateUrl: './loguearse.component.html',
  styleUrls: ['./loguearse.component.css']
})
export class LoguearseComponent implements OnInit {


  constructor(private auth: AuthService, private router:Router) { 

  }

  ngOnInit() { }
  
  loginFacebook() {
    this.auth.loginFacebook()
      .then((res) => {
        console.log('loginFacebook', 'logueado');
      })
      .catch(error => {      
        console.log('loginFacebook', error);
    });
  }
}
