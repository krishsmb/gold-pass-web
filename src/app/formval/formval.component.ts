import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-formval',
  templateUrl: './formval.component.html',
  styleUrls: ['./formval.component.css']
})
export class FormvalComponent implements OnInit {
  userForm: any;
  constructor(private formBuilder: FormBuilder) {
    
        this.userForm = this.formBuilder.group({
          'name': ['', Validators.required],
          'email': ['', [Validators.required, ValidationService.emailValidator]],
          'profile': ['', [Validators.required, Validators.minLength(10)]]
        });
    
        console.log(this.userForm);
      }
    
      saveUser() {
        if (this.userForm.dirty && this.userForm.valid) {
          alert(`Name: ${this.userForm.value.name} Email: ${this.userForm.value.email}`);
        }
      }

  ngOnInit() {
  }

}

