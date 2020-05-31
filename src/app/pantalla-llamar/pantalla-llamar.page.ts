import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pantalla-llamar',
  templateUrl: './pantalla-llamar.page.html',
  styleUrls: ['./pantalla-llamar.page.scss'],
})
export class PantallaLlamarPage implements OnInit {
  argumento: any;

  constructor( private activatedRoute: ActivatedRoute) {
    this.argumento = this.activatedRoute.snapshot.paramMap.get('phone');

  }

  ngOnInit() {
  }

}
