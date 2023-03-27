import Form from './formValidator/form';
import { CustomValidation } from './formRules/validation';
import { CUSTOM_RULE } from './formRules/rules';
import '../styles/main.scss'

const form = Form('form', (submitData) => {
    console.log('submited', submitData)
}, {language: 'en-US', customValidation: CustomValidation, RULES: CUSTOM_RULE});
form.init();