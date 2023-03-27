import { validateCPF } from "../formValidator/util";

export const CustomValidation = function(value) {
    function cpf() {
        return validateCPF(value);
    }

    return {
        cpf: cpf
    }
}