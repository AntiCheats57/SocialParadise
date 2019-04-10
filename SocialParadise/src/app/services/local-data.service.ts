import { Injectable } from '@angular/core';
import usuarios from '../../assets/json/usuarios.json';
import noticias from '../../assets/json/noticias.json';
import lugares from '../../assets/json/lugares.json';
import resenas from '../../assets/json/usuarios.json';
import { usuario } from '../interfaces/usuario.interface';
import { noticia } from '../interfaces/noticia.interface.js';
import { resena } from '../interfaces/resena.interface.js';
import { lugar } from '../interfaces/lugar.interface.js';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {


  constructor() {
    this.cargarDatos();
  }

  cargarDatos(): void{
    if(localStorage.getItem("usuarios") == null){
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
    if(localStorage.getItem("noticias") == null){
      localStorage.setItem("noticias", JSON.stringify(noticias));
    }
    if(localStorage.getItem("lugares") == null){
      localStorage.setItem("lugares", JSON.stringify(lugares));
    }
    if(localStorage.getItem("resenas") == null){
      localStorage.setItem("resenas", JSON.stringify(resenas));
    }
  }

  addUsuario(usu:usuario):void{
    if(localStorage.getItem("usuarios") != null){
      (<usuario[]> JSON.parse(localStorage.getItem("usuarios"))).push(usu);
    }
    else{
      var usuarios : usuario[];
      usuarios.push(usu);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }  
  }

  addNoticia(not:noticia):void{
    if(localStorage.getItem("noticias") != null){
      (<noticia[]> JSON.parse(localStorage.getItem("noticias"))).push(not);
    }
    else{
      var noticias : noticia[];
      noticias.push(not);
      localStorage.setItem("noticias", JSON.stringify(noticias));
    }  
  }

  addLugar(lug:lugar):void{
    if(localStorage.getItem("lugares") != null){
      (<lugar[]> JSON.parse(localStorage.getItem("lugares"))).push(lug);
    }
    else{
      var lugares : lugar[];
      lugares.push(lug);
      localStorage.setItem("lugares", JSON.stringify(lugares));
    }  
  }

  addResena(res:resena):void{
    if(localStorage.getItem("resenas") != null){
      (<resena[]> JSON.parse(localStorage.getItem("resenas"))).push(res);
    }
    else{
      var resenas : resena[];
      resenas.push(res);
      localStorage.setItem("resenas", JSON.stringify(resenas));
    }  
  }
  
  getUsuario(id:string):usuario{
    for(let i of JSON.parse(localStorage.getItem("usuarios"))){
      if((<usuario> i).id.toString() === id){
        return i;
      }
    }    
    return null;
  }

  getNoticia(id:string):noticia{
    for(let i of JSON.parse(localStorage.getItem("noticias"))){
      if((<noticia> i).id.toString() === id){
        return i;
      }
    }    
    return null;
  }

  getLugar(id:string):noticia{
    for(let i of JSON.parse(localStorage.getItem("lugares"))){
      if((<lugar> i).id.toString() === id){
        return i;
      }
    }    
    return null;
  }

  getResena(id:string):resena{
    for(let i of JSON.parse(localStorage.getItem("resena"))){
      if((<resena> i).id.toString() === id){
        return i;
      }
    }    
    return null;
  }

  getUsuarios():usuario[]{
    return JSON.parse(localStorage.getItem("usuarios"));
  }

  getNoticias():noticia[]{
    return JSON.parse(localStorage.getItem("noticias"));
  }
  getResenas():resena[]{
    return JSON.parse(localStorage.getItem("resenas"));
  }
  getLugares():lugar[]{
    return JSON.parse(localStorage.getItem("lugares"));
  }

}
