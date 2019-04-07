import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  items : any[];
  page = 1;
  pageSize = 9;
  collectionSize : number;
  maxSize = 5;

  constructor() {
    this.items = Array(27);
    for (let i = 0; i < this.items.length; i++) {
      this.items[i] = i+1;
    }
    this.collectionSize = ((this.items.length/this.pageSize)*10);


    

   }

  ngOnInit() {
  }

}
