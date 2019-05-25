import { Injectable } from '@angular/core';
import usuarios from 'src/assets/json/usuarios.json';
import noticias from 'src/assets/json/noticias.json';
import lugares from 'src/assets/json/lugares.json';
import resenas from 'src/assets/json/usuarios.json';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { noticia } from 'src/app/interfaces/noticia.interface.js';
import { resena } from 'src/app/interfaces/resena.interface.js';
import { lugar } from 'src/app/interfaces/lugar.interface.js';

@Injectable({
  providedIn: 'root'
})

export class LocalDataService {

  constructor() {
    this.cargarDatos();
  }

  cargarDatos(): void{
    if (localStorage.getItem("usuarios") == null) {
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
    if (localStorage.getItem("noticias") == null) {
      localStorage.setItem("noticias", JSON.stringify(noticias));
    }
    if (localStorage.getItem("lugares") == null) {
      localStorage.setItem("lugares", JSON.stringify(lugares));
    }
    if (localStorage.getItem("resenas") == null) {
      localStorage.setItem("resenas", JSON.stringify(resenas));
    }
  }

  eliminarUsuario(id: string): boolean {
    let index = -1, cont = 1;
    for (let i of JSON.parse(localStorage.getItem("usuarios"))) {
      if ((<usuario> i).id.toString() === id) {
        index = cont;
      }
      cont++;
    }
    if (index != -1) {
      delete (<usuario[]> JSON.parse(localStorage.getItem("usuarios")))[index];
      return true;
    }
    else { 
      return false;
    }
  }

  eliminarNoticia(id: string): boolean{
    let index = -1, cont = 1;
    for (let i of JSON.parse(localStorage.getItem("noticias"))) {
      if ((<noticia> i).id.toString() === id) {
        index = cont;
      }
      cont++;
    }
    if (index != -1) {
      delete (<noticia[]> JSON.parse(localStorage.getItem("noticias")))[index];
      return true;
    }
    else {
      return false;
    }
  }

  eliminarResenas(id: string): boolean{
    let index = -1, cont = 1;
    for (let i of JSON.parse(localStorage.getItem("resenas"))) {
      if ((<resena> i).id.toString() === id) {
        index = cont;
      }
      cont++;
    }
    if (index != -1) {
      delete (<resena[]> JSON.parse(localStorage.getItem("resenas")))[index];
      return true;
    }
    else {
      return false;
    }
  }

  eliminarLugar(id: string): boolean {
    let index = -1, cont = 1;
    for (let i of JSON.parse(localStorage.getItem("lugares"))) {
      if ((<lugar> i).id.toString() === id) {
        index = cont;
      }
      cont++;
    }
    if(index != -1){
      delete (<lugar[]> JSON.parse(localStorage.getItem("lugares")))[index];
      return true;
    }
    else {
      return false;
    }
  }

  addUsuario(usu: usuario): void{
    if (usu.id != null) {
      (<usuario[]> JSON.parse(localStorage.getItem("usuarios")))[(<usuario[]> JSON.parse(localStorage.getItem("usuarios"))).indexOf(usu)] = usu;
    }
    else {    
      if (localStorage.getItem("usuarios") != null) {
        usu.id = Math.floor(Math.random() * 100) + 1;
        let usuarios = (<usuario[]> JSON.parse(localStorage.getItem("usuarios")));
        usuarios.push(usu);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
      }
      else {
        let usuarios : usuario[];
        usuarios.push(usu);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
      }  
    }
  }

  addNoticia(not: noticia): void{
    if (not.id != null) {
      (<noticia[]> JSON.parse(localStorage.getItem("noticias")))[(<noticia[]> JSON.parse(localStorage.getItem("noticias"))).indexOf(not)] = not;
    }
    else {
      if (localStorage.getItem("noticias") != null) {
        not.id = Math.floor(Math.random() * 100) + 1;
        let noticias = (<noticia[]> JSON.parse(localStorage.getItem("noticias")));
        noticias.push(not);
        localStorage.setItem("noticias", JSON.stringify(noticias));
      }
      else {
        var noticias : noticia[];
        noticias.push(not);
        localStorage.setItem("noticias", JSON.stringify(noticias));
      }
    }
  }

  addLugar(lug: lugar): void{
    if (lug.id != null) {
      (<lugar[]> JSON.parse(localStorage.getItem("lugares")))[(<lugar[]> JSON.parse(localStorage.getItem("lugares"))).indexOf(lug)] = lug;
    }
    else {
      if (localStorage.getItem("lugares") != null) {
        lug.id = Math.floor(Math.random() * 100) + 1;
        let lugares = (<lugar[]> JSON.parse(localStorage.getItem("lugares")));
        lugares.push(lug);
        localStorage.setItem("lugares", JSON.stringify(lugares));
      }
      else {
        var lugares : lugar[];
        lugares.push(lug);
        localStorage.setItem("lugares", JSON.stringify(lugares));
      }
    }
  }

  addResena(res: resena): void {
    if (res.id != null) {
      (<resena[]> JSON.parse(localStorage.getItem("resenas")))[(<resena[]> JSON.parse(localStorage.getItem("resenas"))).indexOf(res)] = res;
    }
    else {
      if (localStorage.getItem("resenas") != null) {
        res.id = Math.floor(Math.random() * 100) + 1;
        let resenas = (<resena[]> JSON.parse(localStorage.getItem("resenas")));
        resenas.push(res);
        localStorage.setItem("resenas", JSON.stringify(lugares));
      }
      else {
        var resenas: resena[];
        resenas.push(res);
        localStorage.setItem("resenas", JSON.stringify(resenas));
      }
    }
  }

  getUsuario(id: string): usuario{
    for (let i of JSON.parse(localStorage.getItem("usuarios"))) {
      if((<usuario> i).id.toString() === id){
        return i;
      }
    }
    return null;
  }

  getNoticia(id: string): noticia{
    for (let i of JSON.parse(localStorage.getItem("noticias"))) {
      if ((<noticia> i).id.toString() === id) {
        return i;
      }
    }
    return null;
  }

  getLugar(id: string): noticia{
    for (let i of JSON.parse(localStorage.getItem("lugares"))) {
      if((<lugar> i).id.toString() === id){
        return i;
      }
    }
    return null;
  }

  getResena(id: string): resena{
    for (let i of JSON.parse(localStorage.getItem("resena"))) {
      if ((<resena> i).id.toString() === id) {
        return i;
      }
    }
    return null;
  }

  getUsuarios(): usuario[] {
    return JSON.parse(localStorage.getItem("usuarios"));
  }

  getNoticias(): noticia[] {
    return JSON.parse(localStorage.getItem("noticias"));
  }
  getResenas(): resena[] {
    return JSON.parse(localStorage.getItem("resenas"));
  }
  getLugares(): lugar[] {
    return JSON.parse(localStorage.getItem("lugares"));
  }

}
