import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edicion-noticia',
  templateUrl: './edicion-noticia.component.html',
  styleUrls: ['./edicion-noticia.component.css']
})
export class EdicionNoticiaComponent implements OnInit {

  formulario:FormGroup;
  indexNoticia:string;
  constructor(private router:Router, private route:ActivatedRoute) {
    this.formulario = new FormGroup({
    'titulo':new FormControl('', [
                                  Validators.required,
                                  Validators.minLength(8)
                                ]),
    'contenido':new FormControl('', [
                                  Validators.required,
                                  Validators.minLength(10)
                                ])
  }); }
  

  ngOnInit() {
    this.indexNoticia = this.route.snapshot.params['id'];
    console.log(this.indexNoticia);
  }
  guardar() {

  }


}