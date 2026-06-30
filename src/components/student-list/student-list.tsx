import {
  Component,
  Prop,
  Event,
  EventEmitter,
  State,
  h
} from '@stencil/core';

import { Student } from '../../interfaces/student';

@Component({
  tag: 'student-list',
  styleUrl: 'student-list.css',
  shadow: true,
})

export class StudentList {

  // Students received from Parent

  @Prop()
  students: Student[] = [];

  // Delete Event

  @Event()
deleteStudent!: EventEmitter<number>;

  // Edit Event

  @Event()
  editStudent!: EventEmitter<Student>;

  // Search

  @State()
  searchText: string = "";

  // Filtered Students

  @State()
  filteredStudents: Student[] = [];

  // -------------------------
  // LIFECYCLE METHODS
  // -------------------------

  connectedCallback() {

    console.log("Student List Connected");

    // Initialize filtered list

    this.filteredStudents = this.students;

  }

  componentWillLoad() {

    console.log("Loading Student List");

    // Sort students before showing

    this.filteredStudents =

      [...this.students].sort((a, b) =>

        a.name.localeCompare(b.name)

      );

  }

  componentShouldUpdate() {

    console.log("Checking Student List Update");

    return true;

  }

  componentWillRender() {

    console.log("Preparing Student List");

    if (this.searchText !== "") {

      this.filteredStudents =

        this.students.filter(student =>

          student.name

            .toLowerCase()

            .includes(

              this.searchText.toLowerCase()

            )

        );

    }

    else {

      this.filteredStudents = this.students;

    }

  }

  componentDidRender() {

    console.log("Student List Rendered");

  }

  componentDidLoad() {

    console.log("Student List Loaded");

  }

  disconnectedCallback() {

    console.log("Student List Removed");

  }

  // -------------------------
  // SEARCH
  // -------------------------

  handleSearch = (event: Event) => {

    const input =

      event.target as HTMLInputElement;

    this.searchText = input.value;

  }

  // -------------------------
  // DELETE
  // -------------------------

  deleteRecord(id: number) {

    if (

      confirm("Delete Student?")

    ) {

      this.deleteStudent.emit(id);

    }

  }

  // -------------------------
  // EDIT
  // -------------------------

  editRecord(student: Student) {

    this.editStudent.emit(student);

  }

  // -------------------------
  // UI
  // -------------------------

  render() {

    return (

      <div>

        <h2>

          Student List

        </h2>

        <input

          placeholder="Search Student"

          onInput={this.handleSearch}

        />

        {

          this.filteredStudents.length === 0 ?

            (

              <h3>

                No Students Found

              </h3>

            )

            :

            (

              this.filteredStudents.map(student =>

                <div class="card">

                  <h3>

                    {student.name}

                  </h3>

                  <p>

                    ID :

                    {student.id}

                  </p>

                  <p>

                    Age :

                    {student.age}

                  </p>

                  <p>

                    Course :

                    {student.course}

                  </p>

                  <p>

                    Email :

                    {student.email}

                  </p>

                  <button

                    onClick={() =>

                      this.editRecord(student)

                    }

                  >

                    Edit

                  </button>

                  <button

                    onClick={() =>

                      this.deleteRecord(student.id)

                    }

                  >

                    Delete

                  </button>

                </div>

              )

            )

        }

      </div>

    );

  }

}