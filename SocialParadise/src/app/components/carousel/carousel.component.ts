import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  
  images: string[] = ["../../../assets/images/im-contact.jpg","../../../assets/images/im-about.jpg","../../../assets/images/im-contacto.jpg"];

  constructor() { }

  ngOnInit() {
  }

}
