import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { StudentsComponent } from "./teacher/students/students.component";
import { VmsComponent } from "./teacher/vms/vms.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { StudentsContComponent } from "./teacher/students-cont.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "teacher/course/applicazioni-internet/students",
    component: StudentsContComponent,
  },
  {
    path: "teacher/course/applicazioni-internet/vms",
    component: VmsComponent,
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
