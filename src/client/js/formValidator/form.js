import Mask from "./mask";
import Validation from "./validation";
import { getFormDataObject } from "../formRules/util";

const Form = (formSelector, onSubmit, {language = 'en-US', i18n = {}, customValidation = {}, RULES}) => {
    const ERROR = i18n(language).error;
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
            const validate = Validation(input.value, RULES[INPUT_RULE], RULE_MODIFIER, customValidation);
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
            const RULE = RULE_MODIFIER ? RULES[INPUT_RULE].modifier[RULE_MODIFIER] : RULES[INPUT_RULE];

            if(RULE.attributes) {
                Object.keys(RULE.attributes).forEach((attribute) => {
                    input[attribute] = RULE.attributes[attribute];
                });
            }
        }
    }

    function initMask() {
        Mask(RULES).addInputMask();
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
        formElement.addEventListener('reset', function() {
            const errorElements = document.querySelectorAll('.rule__error');
            const inputInvalidElements = document.querySelectorAll('.rule--invalid');
            if(errorElements && errorElements.length > 0) {
                errorElements.forEach((errorElement) => {
                    errorElement.classList.remove('invalid');
                    errorElement.innerText = '';
                });
            }
            if(inputInvalidElements && inputInvalidElements.length > 0) {
                inputInvalidElements.forEach((errorElement) => {
                    errorElement.classList.remove('rule--invalid');
                });
            }
            state.onceError = false;
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