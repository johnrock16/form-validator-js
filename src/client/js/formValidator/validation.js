const Validation = (value, rule, modifier = null, CustomValidation = null) => {
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
        if(CustomValidation && typeof CustomValidation === 'function') {
            const customValidation = CustomValidation(value, rule, modifier);
            Object.keys(customValidation).forEach((key) => {
                this[key] = customValidation[key];
            });
        }

        return modifier ? validateRules.call(this, rule.modifier[modifier]) : validateRules.call(this, rule);
    }


    return ({
        validate: validate
    });
}

export default Validation;