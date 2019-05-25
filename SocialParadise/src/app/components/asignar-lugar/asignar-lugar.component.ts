import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-asignar-lugar',
  templateUrl: './asignar-lugar.component.html',
  styleUrls: ['./asignar-lugar.component.css']
})

export class AsignarLugarComponent implements OnInit {

  formulario: FormGroup;
  indexLugar: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
        'editor': new FormControl('', [
                                    Validators.required
                                  ])
    });
  }

  ngOnInit() {
    this.indexLugar = this.route.snapshot.params['id'];
  }

  guardar() {
  }

}
