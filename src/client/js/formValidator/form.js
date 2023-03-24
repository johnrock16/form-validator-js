import { Mask, RULES, Validation } from "./rules";
import { getFormDataObject } from "./util";

const Form = (formSelector, onSubmit) => {
    const errorsActives = {};

    function toggleErrorMessage(input, rule, error, isValid) {
        if(!isValid || errorsActives[rule]) {
            const errorElement = input.parentElement.querySelector('.rule__error');
            if(errorElement) {
                errorElement.classList[isValid ? 'remove' : 'add']('invalid');
                errorElement.innerText = isValid ? '' : error;
            }
        }
        errorsActives[rule] = !isValid;
    }

    function initMask() {
        Mask().addInputMask();
    }

    function initValidation() {
        const form = document.querySelector(formSelector);
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let formValidate = [];
            const data = getFormDataObject(this);

            this.querySelectorAll('input').forEach((input) => {
                if(input.dataset.rule) {
                    const INPUT_RULE = input.dataset.rule.split('--')[0];
                    const RULE_MODIFIER = input.dataset.rule.split('--').length > 1 ? input.dataset.rule.split('--')[1] : ''
                    const validate = Validation(input.value, RULES[INPUT_RULE], RULE_MODIFIER);
                    const {isValid, error} = validate.validate();

                    formValidate.push(isValid);
                    input.classList[isValid ? 'remove' : 'add']('rule--invalid');

                    toggleErrorMessage(input, INPUT_RULE+RULE_MODIFIER, error, isValid)
                }
            });

            if(!formValidate.some((element) => !element)) {
                onSubmit(data);
            }
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