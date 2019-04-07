import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent implements OnInit {

 /* notificacion:Object = {
    nombre: "Jose Brenes",
    correo: "jbrenesarroyo@gmail.com",
    asunto: "Mensaje urgente",
    mensaje: "Este es un mensaje de ejemplo"
  }*/
  formulario:FormGroup;

  not:Object = {
    nombre: "Jose Brenes",
    asunto:"Mensaje urgente",
    mensaje:"Este es un mensaje de ejemplo",
    correo: "jose@gmail.com"
  }

  constructor() {
    this.formulario = new FormGroup({
      'nombre':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'asunto':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(6)
                                  ]),
      'mensaje':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(10)
                                  ]),
      'correo':new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                  ])
    });

    // this.formulario.setValue(this.not);
  }
  

  ngOnInit() {
  }
  
  enviar(){
    console.log(this.formulario.value);
    console.log(this.formulario);

    this.formulario.reset({nombre:'', mensaje:'',asunto:'', correo:''});
  }



}
