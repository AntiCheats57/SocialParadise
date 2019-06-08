import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})

export class ContactenosComponent implements OnInit {
  @ViewChild('f') form:NgForm;
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
  }

  enviar() {
    this.formulario.reset();
    Swal.fire({
      type: 'success',
      title: 'Mensaje enviado',
      showConfirmButton: false,
      timer: 1500
    })
  }

  validar() {
    this.markFormGroupTouched(this.formulario);
    this.form.ngSubmit.emit();
    
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
