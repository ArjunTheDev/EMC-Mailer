import axios from 'axios';

export const sendMail = async ( message, emails ) => {
    return await axios.post('http://localhost:8080/sendMail', {message: message, emailList: emails })
};