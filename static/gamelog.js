const LOG_BOX = document.getElementById("logbox");
const STATUS_BOX = document.getElementById("statusbox");

const write_message = (mess) => {
    LOG_BOX.innerHTML += mess + "<br>";
    LOG_BOX.scrollTop = STATUS_BOX.scrollHeight;
    STATUS_BOX.innerHTML = mess;
}
const clear_statusbox = () => {
    LOG_BOX.innerHTML = '';
    STATUS_BOX.innerHTML = mess;
    write_message('<i>Status Cleared</i>');
}

