import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"],
})
export class AppComponent {
  @ViewChild(MatSidenav, { static: false }) sidenav: MatSidenav;

  tabs = [
    {
      value: "students",
      path: "/teacher/course/applicazioni-internet/students",
    },
    {
      value: "vms",
      path: "/teacher/course/applicazioni-internet/vms",
    },
  ];
  activeLink = this.tabs[0].path;
  constructor() {}

  ngOnInit() {}
  toggleForMenuClick() {
    this.sidenav.opened = !this.sidenav.opened;
  }
}
