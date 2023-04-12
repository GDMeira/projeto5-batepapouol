axios.defaults.headers.common['Authorization'] = 'Vak8ZeLiKi68KIDffThdHIKq';

document.body.querySelector("#nickname").addEventListener("input", checkNickname);
let nickname = '';

class Message {
    constructor(text, writerNickname, isPivate=false, receiverNickname='') {
        this.text = text;
        this.writerNickname = writerNickname;
        this.isPivate = isPivate;
        this.receiverNickname = receiverNickname;
    }
}

let idStayOnline = -1;



function checkNickname() {
   
    const acessChatButton = document.body.querySelector("#acessChat");
    
    // habilita o botão com 3 ou mais caracteres digitados
    if (this.value.length >= 3) {
        acessChatButton.disabled = false;
        acessChatButton.style.background = 'aquamarine';
    } else {
        acessChatButton.disabled = true;
        acessChatButton.style.background = '#e7e7e7';
    }
    
}

function acessChat() {
    nickname = document.body.querySelector("#nickname").value;
    const objNickname = {name: nickname};
    const response = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', objNickname);
    response.then(closeLogin);
    response.catch(connectionError);
}

function closeLogin() {
    document.querySelector('.login').style.display = 'none';
    const timeBetweenVerificationsMilliseconds = 5000;
    idStayOnline = setInterval(stayOnline, timeBetweenVerificationsMilliseconds);
}

function connectionError(error) {
    console.log(error);
    alert(`code ${error.response.status} \n${error.response.statusText}`);
    document.querySelector('.login').style.display = 'flex';

    if (idStayOnline !== -1) {
        clearInterval(idStayOnline);
    }
}

function stayOnline() {
    const objNickname = {name: nickname};
    const response = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', objNickname);
    response.catch(connectionError);
}