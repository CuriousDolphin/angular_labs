import { Component, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { Student } from "./models/student.model";
import { Observable, of, BehaviorSubject } from "rxjs";
import {
  map,
  startWith,
  tap,
  debounceTime,
  distinctUntilChanged,
  filter,
  take,
} from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { studentDb } from "./models/MOCK_DATA";
import * as _ from "lodash";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

const studentsTMP: Student[] = [
  { id: "s263138", name: "Murabito", firstName: "ivan" },
  { id: "s246456", name: "Pallino", firstName: "carlo" },
  { id: "s235344", name: "Verdi", firstName: "mario" },
];
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"],
})
export class AppComponent {
  myControl = new FormControl();
  filteredOptions: Observable<Student[]>;
  title = "ai20-lab04";
  colsToDisplay = ["select", "id", "name", "firstName"];
  studentArray: Student[] = [];
  selectedStudents = new SelectionModel<Student>(true, []);
  // dataSource$: BehaviorSubject<Student[]> = new BehaviorSubject([]);
  dataSource = new MatTableDataSource<Student>();
  studentToAdd: Student = null;
  @ViewChild(MatSidenav, { static: false }) sidenav: MatSidenav;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngOnInit(): void {
    this.dataSource.data = studentsTMP;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //this.dataSource$.next(studentsTMP);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      debounceTime(200),
      distinctUntilChanged(),
      map((value) => (typeof value === "string" ? value : value.firstName)),
      map((value) => this._filter(value))
    );
  }
  displayFn(student: Student): string {
    return student && student.firstName ? student.firstName : "";
  }

  selectStudentToAdd(student: Student) {
    this.studentToAdd = student;
  }
  addStudentToTable() {
    if (
      this.studentToAdd &&
      !this.dataSource.data.find(
        (student: Student) => student == this.studentToAdd
      )
    ) {
      console.log("add student to table", this.studentToAdd);
      let students = this.dataSource.data;
      students.push(this.studentToAdd);
      // this.dataSource$.next(students);
      this.dataSource.data = students;
      this.studentToAdd = null;
    }
  }

  private _filter(value: string): Student[] {
    const tmp = value.toLowerCase();
    console.log(tmp);
    return _.chain(studentDb)
      .filter((student: Student) =>
        student.firstName.toLowerCase().includes(tmp)
      )
      .value();
  }
  isAllSelected() {
    const numSelected = this.selectedStudents.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleForMenuClick() {
    this.sidenav.opened = !this.sidenav.opened;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selectedStudents.clear()
      : this.dataSource.data.forEach((student) =>
          this.selectedStudents.select(student)
        );
  }

  deleteSelectedStudent() {
    let students = [];

    this.dataSource.data.forEach((student: Student) => {
      if (!this.selectedStudents.isSelected(student)) students.push(student);
    });

    this.selectedStudents.clear();
    this.dataSource.data = students;
    //this.dataSource$.next(students);
  }
  toggleStudent(student: Student) {
    this.selectedStudents.toggle(student);
  }
}
