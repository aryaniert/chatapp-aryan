const socket = io()

let namea;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area')

do{
   namea = prompt('Please enter your name :');
}while(!namea)

textarea.addEventListener('keyup',(e)=>{
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
})

function sendMessage(message){
    let msg = {
        user: namea,
        message: message.trim()
    }

    //append message

    appendMessage(msg,'outgoing')
    textarea.value = ''


    socket.emit('message',msg)
    // console.log(msg);
}
function appendMessage (msg,type){

    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className,'message')
    // console.log(msg);

    let markUp = `
       <h4>${msg.user}</h4>
       <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markUp;
    messageArea.appendChild(mainDiv)
    scrollToBottom();
}

//recieved
socket.on('message',(msg)=>{
  appendMessage(msg,'incoming');
  scrollToBottom();
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight 
}