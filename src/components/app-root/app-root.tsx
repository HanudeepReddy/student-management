import { Component, State, h } from '@stencil/core';
import { Student } from '../../interfaces/student';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})

export class AppRoot {

  // ==========================
  // STATES
  // ==========================

  @State()
  students: Student[] = [];

  @State()
  selectedStudent?: Student;

  // ==========================
  // LIFECYCLE METHODS
  // ==========================

  connectedCallback() {

    console.log("App Started");

    // Check Browser Support

    if (!window.localStorage) {

      alert("Browser doesn't support Local Storage");

    }
  }

  componentWillLoad() {

    console.log("Loading Students...");

    // Load Students

    const data = localStorage.getItem("students");

    if (data) {

      this.students = JSON.parse(data);

    }

  }

  componentWillRender() {
  console.log("Preparing Dashboard");
}

  componentDidRender() {

    console.log("Dashboard Rendered");

  }

  componentDidLoad() {

    console.log("Dashboard Ready");

  }

  componentShouldUpdate() {

    console.log("Checking Dashboard Update");

    return true;

  }

  disconnectedCallback() {

    console.log("Dashboard Closed");

  }

  // ==========================
  // ADD STUDENT
  // ==========================

  addStudent = (event: CustomEvent<Student>) => {

    this.students = [...this.students, event.detail].sort(
  (a, b) => a.name.localeCompare(b.name)
);

    localStorage.setItem(

      "students",

      JSON.stringify(this.students)

    );

  }

  // ==========================
  // DELETE
  // ==========================

  removeStudent = (event: CustomEvent<number>) => {

    this.students =

      this.students.filter(

        student =>

        student.id !== event.detail

      );

    localStorage.setItem(

      "students",

      JSON.stringify(this.students)

    );

  }

  // ==========================
  // EDIT
  // ==========================

  editStudent = (event: CustomEvent<Student>) => {

    this.selectedStudent = event.detail;

    alert(

      "Editing : " +

      event.detail.name

    );

  }

  // ==========================
  // UI
  // ==========================

  render() {

    return (

      <div>

        <student-form

          onStudentAdded={this.addStudent}

        >

        </student-form>

        <hr />

        <student-list

          students={this.students}

          onDeleteStudent={this.removeStudent}

          onEditStudent={this.editStudent}

        >

        </student-list>

      </div>

    );

  }

}