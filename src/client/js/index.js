import Form from './formValidator/form';
import { CustomValidation } from './formRules/validation';
import { CUSTOM_RULE } from './formRules/rules';
import '../styles/main.scss'
import i18n from './formRules/i18n/i18n';

const form = Form('form', (submitData) => {
    console.log('submited', submitData)
}, {language: 'en-US', i18n: i18n, customValidation: CustomValidation, RULES: CUSTOM_RULE});
form.init();