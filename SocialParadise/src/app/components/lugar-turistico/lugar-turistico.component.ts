import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lugar-turistico',
  templateUrl: './lugar-turistico.component.html',
  styleUrls: ['./lugar-turistico.component.css']
})
export class LugarTuristicoComponent implements OnInit {

  currentRate:number = 3;
  
  constructor(config: NgbRatingConfig) { 
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
  }

}
