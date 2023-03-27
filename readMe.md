# form-validator-js

This is a simple form validator I have made with javascript.

## How test
```bash
npm install # install all project's depedencies
npm start # will start the project in http://localhost:8080
```

## How it's works

Form-validator-js works through a flag in html input, so to add a rule in a form you need to add the attribute "data-rule" with the name of rule. When a rule is a modifier of another you need use -- before the name like the example below.

```html
<form class="form">
    <div class="form__field col-3">
        <label class="required">date</label>
        <input name="date" type="date" data-rule="date" required/> <!-- data-rule without modifier -->
        <span class="rule__error"></span>
    </div>
    <div class="form__field col-3">
        <label class="required">birthdate</label>
        <input name="birthdate" type="date" data-rule="date--age" required/> <!-- data-rule with modifier -->
        <span class="rule__error"></span>
    </div>
</form>
```
- data-rule: The name of rule you will use, if you rule needs a modifier you can use "--modifer".
- rule_error: The default span where the error message will be visible to the user.

After add your rule in HTML. You need call the function in JS.
```javascript
import Form from './formValidator/form';

const form = Form('form', (submitData) => {
    console.log('submited', submitData); // when form will be submited and isValid this will be triggered
},
{
    language: 'en-US', //language of i18n
    i18n: i18n, //i18n file
    customValidation: CustomValidation, //validation function
    RULES: CUSTOM_RULE //rule Object
}
);

form.init(); //init form validation
```

### RULES

Rules is a Object when you define all rules you want to be validated

```javascript
export const CUSTOM_RULE =  {
    name:{
        validate: ['hasText'], //this is a array with function names you want ot use
        attributes: { //this will add a attribute in your HTML
            maxLength: 32, //in this case max-length="32"
        },
        error: { // this will define the error messages to a determined function you will invoke in validate
            hasText: 'common.hasText', //when hasText isn't valid this message will be visible in screen
        },
    },
    email:{
        regex:/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i, //regex to a regex validation
        validate: ['regex'],
        attributes: {
            maxLength: 64,
        },
        error: {
            regex: 'email.regex',
        }
    },
    date:{
        regex:/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
        mask:[[/\D/g, ''],[/(\d{2})(\d)/, '$1/$2'],[/(\d{2})(\d)/, '$1/$2'],[/(\d{4})(\d)/, '$1']], //An array with regex mask replace
        validate: ['regex', 'validDate'],
        error: {
            regex: 'common.dateFormat',// when regex fails this will be the message error
            validDate: 'date.validDate'//when validDate fails this will be the message error
        },
        modifier: { //modifiers, all objects inside will inherit the validation of your standard behavior
            age: { // age is a modifier of date
                validate: ['regex', 'validateAge'], //regex will be inherit of date and validDate will be replaced by validateAge
                params: { //params this will pass values to your functions in validate
                    validateAge: [18, 130] //the parameters values to validateAge
                },
                error: {
                    regex: 'common.dateFormat',
                    validateAge: 'date.modifier.age.validateAge'
                }
            }
        }
    }
};
```
This will be the main configure to your form but you need another 2 files to this will be completed.

### Validation

In rules We use functions name in "validate" and all functions names using in rules are to be here inside validation, all functions expected to return a boolean and all functions needed to be return as a object will all of then in the end of CustomValidation.

```javascript
import { calculateAge, isValidDate, validateCPF } from "./util";

export const CustomValidation = function(value, rule, modifier = null) {
    function regex() { // The Rules.validate will use this name to invoke this function
        return (rule.modifier && rule.modifier[modifier]?.regex) ? rule.modifier[modifier].regex.test(value) : rule.regex.test(value); // all returns must be a boolean
    }

    function hasText() {
        return value.replace(/\s/g, '').length > 0;
    }

    function validDate() {
        return isValidDate(value);
    }

    function validateAge(minAge, maxAge) {
        const age = calculateAge(value, minAge, maxAge)
        return age >= minAge && age <= maxAge;
    }

    function cpf() {
        return validateCPF(value);
    }

    return {
        regex: regex,
        hasText: hasText,
        validDate: validDate,
        validateAge: validateAge,
        cpf: cpf,
    } // all validate function in rules needs to be in this return
}
```

### i18n
The last file you need to configure is i18n with your json with translated texts
```javascript
const i18n = (language) => {
    const translateError = require(`./error/${language}.json`);

    return {
        error: translateError
    }; //you must return a object with error inside
}

export default i18n;
```
This is a example of i18n to errors. The errors in RULES.js will be the path to access this errors text
```json
{
    "common": {
        "hasText": "Please, fill the field",
        "dateFormat": "Please, fill with a valid date format"
    },
    "email": {
        "regex": "Please, fill with a valid email format"
    },
    "phone": {
        "regex": "Please, fill with a valid phone format"
    },
    "dd": {
        "regex": "Please, fill with a valid dd format"
    },
    "date": {
        "validDate": "Invalid date, please select a valid date",
        "modifier": {
            "age": {
                "validateAge": "Invalid age, we only accept people with 18 years or more"
            }
        }
    },
    "cpf": {
        "cpf": "Please, fill with a valid CPF"
    }
}
```