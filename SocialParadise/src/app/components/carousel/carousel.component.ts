import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  providers: [NgbCarouselConfig] 
})
export class CarouselComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = false;
  
  images: string[] = ["../../../assets/images/im-contact.jpg","../../../assets/images/im-about.jpg","../../../assets/images/im-contacto.jpg"];

  constructor(config: NgbCarouselConfig) { 
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;
  }

  ngOnInit() {
  }

}
