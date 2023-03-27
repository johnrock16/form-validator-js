import Form from './formValidator/form';
import { CustomValidation } from './formRules/validation';
import { CUSTOM_RULE } from './formRules/rules';
import i18n from './formRules/i18n/i18n';
import '../styles/main.scss'

const form = Form('form', (submitData) => {
    console.log('submited', submitData);
    alert('submited! look the console')
}, {language: 'en-US', i18n: i18n, customValidation: CustomValidation, RULES: CUSTOM_RULE});
form.init();