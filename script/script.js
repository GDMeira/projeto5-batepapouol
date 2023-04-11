document.body.querySelector("#nickname").addEventListener("input", checkNickname);



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
    document.querySelector('.login').style.display = 'none';
}