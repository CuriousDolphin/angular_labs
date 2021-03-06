import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { MatDialog } from "@angular/material/dialog";
import { LoginDialogComponent } from "./auth/login-dialog/login-dialog.component";
import { Subscription } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { User } from "./models/user.model";
import { ActivatedRoute, Params, Router } from "@angular/router";
import * as _ from "lodash";

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
  userSubscription: Subscription;
  routeSubscription: Subscription;
  dialogSubscription: Subscription;
  isLogged = false;
  user: User = null;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        if (params["doLogin"] == "true") {
          this.openLoginDialog();
        }
      }
    );
    this.userSubscription = this.authService.currentUser$.subscribe(
      (user: User) => {
        if (user != null) {
          this.isLogged = true;
          this.user = user;
        } else {
          this.isLogged = false;
          this.user = null;
        }
      }
    );
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    if (this.dialogSubscription) this.dialogSubscription.unsubscribe();
  }
  toggleForMenuClick() {
    this.sidenav.opened = !this.sidenav.opened;
  }
  goToLogin() {
    this.router.navigate(["home"], { queryParams: { doLogin: true } });
  }
  private openLoginDialog(redirectTo?: string) {
    if (this.dialogSubscription) this.dialogSubscription.unsubscribe();

    const dialogRef = this.dialog.open(LoginDialogComponent);

    this.dialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      // se non c'e' il campo nextlink nello state default home
      let nextLink = _.get(history.state, "nextlink", "home");

      if (result == true) {
        // se il login e' andato bene e devo ridiriggere verso un altra pagina
        console.log("REDIRECT TO", nextLink);
        this.router.navigate([nextLink]);
      } else {
        this.router.navigate(["home"]);
      }
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["home"]);
  }
}
