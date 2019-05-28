import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'urlSegura'
})

export class UrlSegura {

    constructor(private sanitizer: DomSanitizer) { }
  
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
