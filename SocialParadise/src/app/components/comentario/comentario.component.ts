import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css'],
  providers: [NgbRatingConfig]
})

export class ComentarioComponent implements OnInit {

  currentRate = 3;

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = false;
  }

  ngOnInit() {
  }

}
