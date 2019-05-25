import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})

export class ContactenosComponent implements OnInit {
  @Output() public tipoTema = new EventEmitter<string>();

  formulario: FormGroup;

  constructor() {
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'mensaje': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(15)
                                  ]),
      'correo': new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                  ])
    });
  }

  ngOnInit() {
    this.tipoTema.emit("claro");
  }

  enviar() {
  }

}
