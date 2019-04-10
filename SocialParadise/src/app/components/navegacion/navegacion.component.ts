import { Component, OnInit, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {
  
  @Input() public color: string;
  navbarOpaco:boolean;
  
  constructor() { }

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
