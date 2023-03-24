import '../styles/main.scss'
import Form from './formValidator/form'

const form = Form('form', (submitData) => {
    console.log('submitou', submitData)
}, 'en-US');
form.init();