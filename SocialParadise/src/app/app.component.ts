import { Component, ChangeDetectorRef} from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SocialParadise';
  tipoTema:string;

  constructor(private cdr: ChangeDetectorRef) {

  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onTema(tipo:string):void {
    this.tipoTema = tipo;
    console.log(tipo);
  }
}
