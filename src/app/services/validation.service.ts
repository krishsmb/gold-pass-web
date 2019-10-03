export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
      let config = {
        'required': 'Required',
        'invalidCreditCard': 'Is invalid credit card number',
        'invalidEmailAddress': 'Invalid email address',
        'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
        'minlength': `Minimum length ${validatorValue.requiredLength}`,
        'invalidPrice': `Invalid Price`,
        'passwordNotMatch':`Confirm password does not match`,
        'lessPrice':`The amount should be greater than the Minimum bid amount`,
        'minPrice':`The amount should be less than the instant sale price`,
        'invalidLocation':`Please select one Location`
      };
  
      return config[validatorName];
    }
  
    static creditCardValidator(control) {
      // console.log(control.value,'valueeeeeeeeeeeeeee');
      var cardNum = control.value.replace(/[ -]/g, '');
      
      // Visa, MasterCard, American Express, Diners Club, Discover, JCB
      if (cardNum.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
        return null;
      } else {
        return { 'invalidCreditCard': true };
      }
    }
  
    static emailValidator(control) {
      // RFC 2822 compliant regex
      if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return null;
      } else {
        return { 'invalidEmailAddress': true };
      }
    }

    // static locationValidator(control){
    //   if (!control.root.value['selectedFlag']) {
    //     return null;
    //   } else {
    //     return { 'invalidLocation': true };
    //   }
     
    // }
  
    static passwordValidator(control) {
      // {6,100}           - Assert password is between 6 and 100 characters
      // (?=.*[0-9])       - Assert a string has at least one number
      if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
        return null;
      } else {
        return { 'invalidPassword': true };
      }
    }

    static setting_confirm_passwordValidator(control){
      // console.log(control.value,'1234569879');
      // console.log(control.root.value['new_password'],'12345678933333333');
      if (control.value == control.root.value['new_password']) {
        console.log('passwords  match');
        return null;
      } else {
        return { passwordNotMatch: true };
      }
    }
    static confirm_passwordValidator(control) {
      if (control.value == control.root.value['password']) {
        console.log('passwords  match');
        return null;
      } else {
        return { passwordNotMatch: true };
      }
        // if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
        //   return null;
        // } else {
        //   return { 'invalidPassword': true };
        // }
    }
    static cn_passwordValidator(control) {
      if (control.value == control.root.value['new_password']) {
        console.log('passwords  match');
        return null;
      } else {
        return { passwordNotMatch: true };
      }
    }
      

      static priceValidator(control) {
        if (control.value!='') {
          if (control.value.match(/^[0-9]+$/)) {
            return null;
          } else {
            return { 'invalidPrice': true };
          }
        }
        else{
          return null;
        }
        
      } 
     
      static InstantpriceValidator(control) {

        //console.log(control.root.value['auctionCheck']);
          if (control.value!='') {
            if(control.root.value['auctionCheck']) {
              if (parseFloat(control.value) > parseFloat(control.root.value['min_price'])) {
                return null;
              } else {
                return { lessPrice: true };
              }     
            }
        }
        else{
          return null;
        }   
      } 

      
      
      static MinpriceValidator(control) {
          
        if (control.value!='') {
          let instant_sale_price=control.root.value['instant_sale_price'];
        if(!instant_sale_price){
          return null;
        }else{
          if (parseFloat(control.value) < parseFloat(instant_sale_price)) {
            return null;
          } else {
            return { minPrice: true };
          } 
        }
             
       }
      else{
       return null;
       }   
      }    
    
  }