import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  items : string[];
  page = 1;
  pageSize = 9;
  collectionSize : number;
  maxSize = 5;

  constructor() {
    this.items = ["Bertiolo","Poggiodomo","Leduc","Bruderheim","Tintigny","Lebach","Birkenhead","Vancouver","SanVitoChietino","Vannes","Nasino","Greymouth","SanAntonio","Lamont","Gore","ChartersTowers","Serrata","Castanhal","Estevan","Torgny","Glendon","Norman","Augusta","Berloz","Toruń","Chalon-sur-Saone","Hekelgem","Villeneuve-dAscq","Olcenengo","SunshineCoastRegionalDistrict","Urbe","SanLorenzoNuovo","Llanidloes","St.JohanninTirol","Basildon","Segovia","Anghiari","Pontevedra"]
    // for (let i = 0; i < this.items.length; i++) {
    //   this.items[i] = (i+1).toString();
    // }
    this.collectionSize = ((this.items.length/this.pageSize)*10);
   }

  ngOnInit() {
  }

}
