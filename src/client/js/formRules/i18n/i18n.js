const i18n = (language) => {
    const translateError = require(`./error/${language}.json`);

    return {
        error: translateError
    };
}

export default i18n;