import {
  Component,
  State,
  Event,
  EventEmitter,
  Element,
  h
} from '@stencil/core';

import { Student } from '../../interfaces/student';

@Component({
  tag: 'student-form',
  styleUrl: 'student-form.css',
  shadow: true,
})

export class StudentForm {

  @Element() host!: HTMLElement;

  // -------------------------
  // STATES
  // -------------------------

  @State() name: string = "";
  @State() age: number = 0;
  @State() course: string = "";
  @State() email: string = "";

  @State() message: string = "";
  @State() currentTime: string = "";
  @State() registrationDate: string = "";
  @State() courses: string[] = [];

  timer: any;

  // -------------------------
  // CUSTOM EVENT
  // -------------------------

  @Event()
  studentAdded!: EventEmitter<Student>;

  // -------------------------
  // INTERNET EVENT
  // -------------------------

  internetLost = () => {
    this.message = "❌ Internet Connection Lost";
  };

  // -------------------------
  // LIFECYCLE METHODS
  // -------------------------

  connectedCallback() {

    console.log("connectedCallback()");

    // Check login token

    const token = sessionStorage.getItem("college-token");

    if (!token) {

      this.message = "⚠ User not logged in";

    }

    // Listen for internet disconnection

    window.addEventListener("offline", this.internetLost);

  }

  componentWillLoad() {

    console.log("componentWillLoad()");

    // Load courses

    const data = localStorage.getItem("courses");

    if (data) {

      this.courses = JSON.parse(data);

    } else {

      this.courses = [

        "React",

        "Angular",

        "Stencil",

        "Java",

        "Python"

      ];

    }
    
    this.registrationDate = new Date().toLocaleDateString();

  }

  componentShouldUpdate() {

    console.log("componentShouldUpdate()");

    // Block malicious scripts

    const scriptPattern = /<script.*?>.*?<\/script>/gi;

    if (scriptPattern.test(this.name)) {

      this.message = "❌ Malicious Script Detected";

      return false;

    }

    // Limit name length

    if (this.name.length > 30) {

      this.message = "Maximum 30 Characters Allowed";

      return false;

    }

    return true;

  }

  componentWillRender() {

    console.log("componentWillRender()");

}

componentDidRender() {
  console.log("componentDidRender()");
}

  componentDidLoad() {

    console.log("componentDidLoad()");

    // Start Live Clock

    this.timer = setInterval(() => {

      this.currentTime =

        new Date().toLocaleTimeString();

    }, 1000);

  }

  disconnectedCallback() {

    console.log("disconnectedCallback()");

    // Stop timer

    clearInterval(this.timer);

    // Remove listeners

    window.removeEventListener(

      "offline",

      this.internetLost

    );

  }

  // -------------------------
  // INPUT EVENTS
  // -------------------------

  handleName = (event: Event) => {

    const input = event.target as HTMLInputElement;

    this.name = input.value.replace(/<[^>]*>?/gm, "");

  };

  handleAge = (event: Event) => {

    const input = event.target as HTMLInputElement;

    this.age = Number(input.value);

  };

  handleCourse = (event: Event) => {

    const select = event.target as HTMLSelectElement;

    this.course = select.value;

  };

  handleEmail = (event: Event) => {

    const input = event.target as HTMLInputElement;

    this.email = input.value;

  };

  // -------------------------
  // SUBMIT
  // -------------------------

  submitForm = (event: Event) => {

    event.preventDefault();

    if (

      this.name === "" ||

      this.age <= 0 ||

      this.course === "" ||

      this.email === ""

    ) {

      this.message = "Please Fill All Fields";

      return;

    }

    const student: Student = {

      id: Date.now(),

      name: this.name,

      age: this.age,

      course: this.course,

      email: this.email

    };

    this.studentAdded.emit(student);
    this.message = "✅ Student Registered Successfully";
    this.name = "";
    this.age = 0;
    this.course = "";
    this.email = "";

  };

  // -------------------------
  // UI
  // -------------------------

  render() {

    return (

      <form onSubmit={this.submitForm}>

        <h2>Student Registration</h2>

        <h4>Date : {this.registrationDate}</h4>

        <h4>Time : {this.currentTime}</h4>

        <input
          placeholder="Student Name"
          value={this.name}
          onInput={this.handleName}
        />

        <input
          type="number"
          placeholder="Age"
          value={this.age}
          onInput={this.handleAge}
        />

    <select onChange={this.handleCourse}>
        <option value="">Select Course</option>
        {this.courses.map(course => (
    <option
      value={course}
      selected={this.course === course}
        >
      {course}
    </option>
    ))}
</select>

        <input
          type="email"
          placeholder="Email"
          value={this.email}
          onInput={this.handleEmail}
        />

        <button type="submit">

          Register Student

        </button>

        <p>

          {this.message}

        </p>

      </form>

    );

  }

}