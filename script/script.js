//initial configs
axios.defaults.headers.common['Authorization'] = 'Vak8ZeLiKi68KIDffThdHIKq';

document.body.querySelector("#nickname").addEventListener("input", checkNickname);
let nickname = '';
let idStayOnline = -1;
let idRenderMessages = -1;
let messages;
let nameListPeopleOnline;
let sendMessageTo = 'Todos';
let sendMessageType = 'message';

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

function acessChat() { //post niockname
    nickname = document.body.querySelector("#nickname").value;
    const objNickname = {name: nickname};
    const response = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', objNickname);
    response.then(closeLoginPage);
    response.catch(connectionError);
    waitingResponse(); //loading page
}

function closeLoginPage() { //online persistence
    const loadingTime = 4000;
    setTimeout(() => {
        document.querySelector('.login').style.display = 'none';},
        loadingTime);
    const timeBetweenVerificationsMilliseconds = 5000;
    idStayOnline = setInterval(stayOnline, timeBetweenVerificationsMilliseconds);
    chat();
}

function connectionError(error) {
    console.log(error);
    alert(`Erro de conexão com o servidor\n
        code ${error.response.status} \n
        ${error.response.statusText}`);
    document.querySelector('.login').style.display = 'flex';
    document.querySelector('.acess').style.display = 'flex';
    document.querySelector('.waiting').style.display = 'none';

    if (idStayOnline !== -1) {
        clearInterval(idStayOnline);
    }
}

function stayOnline() {
    const objNickname = {name: nickname};
    const response = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', objNickname);
    response.catch(connectionError);
}

function waitingResponse() {
    document.querySelector('.acess').style.display = 'none';
    document.querySelector('.waiting').style.display = 'flex';
}

function getMessages() {
    const promise = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promise.then(m => {
        messages = m;
        renderMessages();});
    promise.catch(error => alert(`Não foi possível carregar as mensagens.
                                 \n status ${error.response.status}\n 
                                 ${error.response.statusText}`));
}

function chat() {
    const timeToRenderMessagesMilliseconds = 3000;
    idRenderMessages = setInterval(getMessages, timeToRenderMessagesMilliseconds);
    //lidar com requisições
}

function renderMessages() {
    const containerMessages = document.querySelector('main ul');
    containerMessages.innerHTML = '';

    messages.data.forEach(message => {
        if (message.type === 'status'){
            containerMessages.innerHTML += `
            <li>
                <p class="container-message">
                    <span class="time">(${message.time}) </span> 
                    <span class="bold">${message.from}</span> ${message.text}
                </p>
            </li>
            `;
        } else if (message.type === 'message'){
            containerMessages.innerHTML += `
            <li>
                <p class="container-message">
                    <span class="time">(${message.time}) </span>
                    <span class="bold">${message.from}</span> para 
                    <span class="bold">${message.to}</span>: ${message.text}
                </p>
            </li>
            `;
        } else {
            containerMessages.innerHTML += `
            <li>
            <p class="container-message">
            <span class="time">(${message.time}) </span>
            <span class="bold">${message.from}</span> reservadamente para 
            <span class="bold">${message.to}</span>: ${message.text}
        </p>
            </li>
            `;
        }

        document.querySelector('main ul li:last-child').classList.add(`${message.type}`)
    });

    const viewMessages = document.querySelector('main');
    viewMessages.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
}

function showSideBarMenu() {
    getPeopleOnline();

    //select person (todos come selected as default)
    //
}

function getPeopleOnline() {
    const promise = axios.get('https://mock-api.driven.com.br/api/vm/uol/participants');
    promise.then((list) => {
        nameListPeopleOnline = list;
        renderSideBarMenu();});
    promise.catch(error => alert(`Não foi possível carregar a lista de pessoas.
                                 \n status ${error.response.status}\n 
                                 ${error.response.statusText}`));
}

function renderSideBarMenu() {
    const containerSideBarMenu = document.querySelector('.container-side-bar-menu');
    containerSideBarMenu.style.display = 'flex';
    const peopleList = containerSideBarMenu.querySelector('ul');
    peopleList.innerHTML = `
                            <li class="selectedPerson" onclick="selectPerson(this)">
                                <ion-icon name="people"></ion-icon>
                                <h3>Todos</h3>
                                <ion-icon name="checkmark-outline" class="check"></ion-icon>
                            </li>
    `;

    nameListPeopleOnline.data.forEach(person => {
        peopleList.innerHTML += `
                            <li onclick="selectPerson(this)">
                                <ion-icon name="person-circle"></ion-icon>
                                <h3>${person.name}</h3>
                                <ion-icon name="checkmark-outline" class="check"></ion-icon>
                            </li>
        `;
    })

}

function closeSideBar() {
    const containerSideBarMenu = document.querySelector('.container-side-bar-menu');
    containerSideBarMenu.style.display = 'none';
}

function selectPerson(option) {
    const selected = document.querySelector('.selectedPerson');
    selected.classList.remove('selectedPerson');
    option.classList.add('selectedPerson');

    sendMessageTo = option.querySelector('h3').textContent;
}

function selectType(option) {
    const selected = document.querySelector('.selectedType');
    selected.classList.remove('selectedType');
    option.classList.add('selectedType');

    sendMessageType = option.querySelector('h3').textContent;
}


