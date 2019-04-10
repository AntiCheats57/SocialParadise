import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {

  transform(items: any[], buscarTexto: string): any[] {

    if(!items) return [];
    if(!buscarTexto) return items;
    buscarTexto = buscarTexto.toLowerCase();

    return items.filter( item => {
      return item.toLowerCase().includes(buscarTexto);
    });
  }

}