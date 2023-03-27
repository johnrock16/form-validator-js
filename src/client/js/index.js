import '../styles/main.scss'
import Form from './formValidator/form'

const form = Form('form', (submitData) => {
    console.log('submited', submitData)
}, 'en-US');
form.init();