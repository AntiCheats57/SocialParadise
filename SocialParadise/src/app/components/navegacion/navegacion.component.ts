import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})

export class NavegacionComponent implements OnInit {
  navbarOpaco: boolean;

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  @HostListener('window:scroll') onScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 20) {
      this.navbarOpaco = true;
    } else {
      this.navbarOpaco = false;
    }
  }

}
