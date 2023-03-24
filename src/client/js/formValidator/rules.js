import { calculateAge, isValidDate, validateCPF } from "./util";

export const RULES = {
    name:{
        validate: ['hasText'],
        error: {
            hasText: 'common.hasText',
        }
    },
    email:{
        regex:/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i,
        validate: ['regex'],
        error: {
            regex: 'email.regex',
        }
    },
    phone:{
        regex:/^[0-9]{4}-[0-9]?[0-9]{4}$/,
        mask:[[/\D/g, ''],[/(\d{4})(\d)/, '$1-$2']],
        validate: ['regex'],
        error: {
            regex: 'phone.regex',
        }
    },
    dd:{
        regex:/^\d{2}$/,
        mask:[[/\D/g, ''],[/(\d{2})(\d)/, '$1']],
        validate: ['regex'],
        error: {
            regex: 'dd.regex',
        }
    },
    date:{
        regex:/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
        mask:[[/\D/g, ''],[/(\d{2})(\d)/, '$1/$2'],[/(\d{2})(\d)/, '$1/$2'],[/(\d{4})(\d)/, '$1']],
        validate: ['regex', 'validDate'],
        error: {
            regex: 'common.dateFormat',
            validDate: 'date.validDate'
        },
        modifier: {
            age: {
                validate: ['regex', 'validateAge'],
                params: [18, 130],
                error: {
                    regex: 'common.dateFormat',
                    validateAge: 'date.modifier.age.validateAge'
                }
            }
        }
    },
    cpf:{
        mask:[[/\D/g, ''],[/(\d{3})(\d)/, '$1.$2'],[/(\d{3})(\d)/, '$1.$2'],[/(\d{3})(\d{1,2})/, '$1-$2'],[/(-\d{2})\d+?$/, '$1']],
        validate: ['cpf'],
        error: {
            cpf: 'cpf.cpf',
        },
    }
}

export const Mask = () => {
    function generateMask(value, maskArray) {
        let textMasked = value;
        maskArray.forEach((mask) => {
            textMasked = textMasked.replace(mask[0], mask[1]);
        });
        return textMasked;
    }

    function addInputMask() {
        const inputsMask = document.querySelectorAll('[class^="mask-"]');
        inputsMask.forEach((inputMask) => {
            inputMask.addEventListener('keyup', function(e) {
                const INPUT_RULE = e.target.classList.toString().split('mask-')[1].split(/\s/)[0];
                setTimeout(()=> {
                    e.target.value = generateMask(e.target.value, RULES[INPUT_RULE].mask);
                }, 400);
            });
        })
    }

    return ({
        addInputMask: addInputMask
    })
}

export const Validation = (value, rule, modifier = null) => {
    function regex() {
        return rule.regex.test(value);
    }

    function hasText() {
        return value.replace(/\s/g, '').length > 0;
    }

    function cpf() {
        return validateCPF(value);
    }

    function validDate() {
        return isValidDate(value);
    }

    function validateAge(minAge, maxAge) {
        return calculateAge(value, minAge, maxAge) >= minAge;
    }

    function validateRules(rule) {
        let error;
        const isValid = !rule.validate.some((validation) => {
            const isInvalid = (rule.params && rule.params.length > 0) ? !this[validation](...rule.params) : !this[validation]();
            if(isInvalid && !error && rule?.error[validation]) error = rule.error[validation];
            return isInvalid;
        });
        return {isValid, error};
    }

    function validate() {
        return modifier ? validateRules.call(this, rule.modifier[modifier]) : validateRules.call(this, rule);
    }

    return ({
        regex: regex,
        hasText: hasText,
        cpf: cpf,
        validDate: validDate,
        validateAge: validateAge,
        validate: validate
    });
}