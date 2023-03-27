import { calculateAge, isValidDate, validateCPF } from "./util";

export const CustomValidation = function(value, rule, modifier = null) {
    function regex() {
        return (rule.modifier && rule.modifier[modifier]?.regex) ? rule.modifier[modifier].regex.test(value) : rule.regex.test(value);
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
    }
}