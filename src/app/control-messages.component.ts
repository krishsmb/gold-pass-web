import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from './services/validation.service';


@Component({
  selector: 'control-messages',
  template: `<div *ngIf="errorMessage !== null" class="error-message">{{errorMessage}}</div>
  `,
  styles: [`
  .error-message {
    color: #cc0033;    
    font-size: 12px;
    line-height: 15px;
    margin: 5px 0 0;
  }
`],
})
export class ControlMessagesComponent {
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }
}