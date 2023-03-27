export const CUSTOM_RULE =  {
    cpf:{
        mask:[[/\D/g, ''],[/(\d{3})(\d)/, '$1.$2'],[/(\d{3})(\d)/, '$1.$2'],[/(\d{3})(\d{1,2})/, '$1-$2'],[/(-\d{2})\d+?$/, '$1']],
        validate: ['cpf'],
        attributes: {
            maxLength: 14,
        },
        error: {
            cpf: 'cpf.cpf',
        },
    }
};