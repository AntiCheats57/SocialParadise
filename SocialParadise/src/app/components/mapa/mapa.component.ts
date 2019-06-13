import { Component, OnInit } from '@angular/core';
import { LugaresService } from 'src/app/services/lugares/lugares.service';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  providers: [LugaresService, DecimalPipe]
})
export class MapaComponent implements OnInit {
  lat: number = 9.932546;
  lng: number = -83.961502;
  lugares$: Observable<lugar[]>;
  total$: Observable<number>;
  
  constructor(public service: LugaresService, private router: Router) { 
    this.lugares$ = service.lugares$;
    this.total$ = service.total$;
    this.total$.subscribe(res => {
      this.service.tamanoPagina = res;
    });
  }

  verLugar(id: string): void{
    this.router.navigate(["lugar/", id]);
  }

  ngOnInit() {
  }

}
