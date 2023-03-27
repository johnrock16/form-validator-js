import { calculateAge, isValidDate, validateCPF } from "./util";

const Validation = (value, rule, modifier = null) => {
    function regex() {
        return (rule.modifier && rule.modifier[modifier]?.regex) ? rule.modifier[modifier].regex.test(value) : rule.regex.test(value);
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
        const age = calculateAge(value, minAge, maxAge)
        return age >= minAge && age <= maxAge;
    }

    function validateRules(rule) {
        let error;
        const isValid = !rule.validate.some((validation) => {
            const isInvalid = (rule.params && rule.params[validation] && rule.params[validation].length > 0) ? !this[validation](...rule.params[validation]) : !this[validation]();
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