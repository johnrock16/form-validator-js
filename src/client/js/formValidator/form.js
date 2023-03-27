import Mask from "./mask";
import RULES from "./rules";
import { getFormDataObject } from "./util";
import Validation from "./validation";

const Form = (formSelector, onSubmit, {language = 'en-US', customValidation = {}, customRule = {}}) => {
    const ERROR = require(`./i18n/error/${language}.json`);
    const RULES_VALIDATION = {...RULES, ...customRule};
    const errorsActives = {};
    let state = {
        onceError: false
    }

    function getTranslatedError(error) {
        if(error) {
            const errorPath = error.split('.')
            let textVessel = ERROR[errorPath[0]];

            if(errorPath.length > 1) {
                errorPath.shift();
                errorPath.forEach(element => {
                    textVessel = textVessel[element];
                });
            }
            return textVessel;
        }
        return '';
    }

    function toggleErrorMessage(input, rule, error, isValid) {
        if(!isValid || errorsActives[rule]) {
            const errorElement = input.parentElement.querySelector('.rule__error');
            if(errorElement) {
                errorElement.classList[isValid ? 'remove' : 'add']('invalid');
                errorElement.innerText = getTranslatedError(error);
            }
        }
        errorsActives[rule] = !isValid;
    }

    function inputValidation(input) {
        if((input.dataset.rule && input.required) || (!input.required && input.value != '')) {
            const INPUT_RULE = input.dataset.rule.split('--')[0];
            const RULE_MODIFIER = input.dataset.rule.split('--').length > 1 ? input.dataset.rule.split('--')[1] : ''
            const validate = Validation(input.value, RULES_VALIDATION[INPUT_RULE], RULE_MODIFIER, customValidation);
            const {isValid, error} = validate.validate();
            input.classList[isValid ? 'remove' : 'add']('rule--invalid');

            toggleErrorMessage(input, INPUT_RULE+RULE_MODIFIER, error, isValid)
            return isValid;
        }
        return true;
    }

    function addAttributes(input) {
        if(input.dataset.rule) {
            const INPUT_RULE = input.dataset.rule.split('--')[0];
            const RULE_MODIFIER = input.dataset.rule.split('--').length > 1 ? input.dataset.rule.split('--')[1] : ''
            const RULE = RULE_MODIFIER ? RULES_VALIDATION[INPUT_RULE].modifier[RULE_MODIFIER] : RULES_VALIDATION[INPUT_RULE];

            if(RULE.attributes) {
                Object.keys(RULE.attributes).forEach((attribute) => {
                    input[attribute] = RULE.attributes[attribute];
                });
            }
        }
    }

    function initMask() {
        Mask(RULES_VALIDATION).addInputMask();
    }

    function initValidation() {
        const formElement = document.querySelector(formSelector);
        const formFieldsElement = formElement.querySelectorAll('input');
        formFieldsElement.forEach((input)=>{
            input.addEventListener('change', function(e) {
                if(state.onceError) {
                    inputValidation(input);
                }
            });
            addAttributes(input);
        })
        formElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = getFormDataObject(this);
            if(formFieldsElement) {
                const formValidators = [...formFieldsElement].map((input) => inputValidation(input));
                if(formValidators.some((element) => !element)){
                    state.onceError = true;
                    return;
                };
            }
            onSubmit(data);
        });
    }

    function init(initOptions = { methods: ['initValidation', 'initMask']}) {
        if(initOptions.methods && initOptions.methods.length > 0) {
            initOptions.methods.forEach((method) => {
                if(this[method] && typeof this[method] === 'function') {
                    this[method]();
                }
            });
        }
    }

    return({
        initValidation: initValidation,
        initMask: initMask,
        init: init
    })
}

export default Form;