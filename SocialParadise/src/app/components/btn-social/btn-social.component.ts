import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-btn-social',
  templateUrl: './btn-social.component.html',
  styleUrls: ['./btn-social.component.css']
})
export class BtnSocialComponent implements OnInit {
  @Input() public imgUrl: string;
  @Input() public imgAlt: string;
  @Input() public text: string;
  @Input() public textColor: string;
  @Input() public background: string;

  constructor() { }

  ngOnInit() {
  }

}
