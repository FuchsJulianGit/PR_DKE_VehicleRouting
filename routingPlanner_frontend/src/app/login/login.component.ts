import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


import * as L from 'leaflet';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})



export class LoginComponent implements OnInit{
  login() {
    console.log('Login button clicked');
  }

  constructor() { }

  ngOnInit(): void {


  }

}