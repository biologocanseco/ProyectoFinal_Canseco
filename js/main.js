//Crear una funcion que guarde la preferencia del usuario si desea recordar o no susudatos
const inputUser = document.querySelector("#user"),
    inputPass = document.querySelector("#pass"),
    checkbox = document.querySelector("#check"),
    form = document.querySelector("form");
//console.log(form);
function guardarEnLS(storage) {
    //funcionalidad
    const user = {
        usuario: inputUser.value,
        pass: inputPass.value,
    };
    if (storage == "local") {
        localStorage.setItem("usuario", JSON.stringify(user));
    }
    if (storage == "session") {
        sessionStorage.setItem("usuario", JSON.stringify(user));
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (checkbox.checked) {
        guardarEnLS("local");
    } else {
        guardarEnLS("session");
    }

});