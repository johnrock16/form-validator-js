import { calculateAge, isValidDate, validateCPF } from "./util";

const Validation = (value, rule, modifier = null) => {
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

export default Validation;