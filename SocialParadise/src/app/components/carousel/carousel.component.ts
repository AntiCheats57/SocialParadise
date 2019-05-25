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
  images: string[] = ["assets/images/carousel1.jpg", "assets/images/carousel2.jpg", "assets/images/carousel3.jpg"];

  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;
  }

  ngOnInit() {
  }

}
