import { MyRequest } from "../requests.js";
import { nick, pass } from "./login.js";

const registerButton = document.getElementById("register-submit");

function register() {
  const request = new MyRequest("POST", "register", getRegisterUserData());

  let response = request.sendRequest();

  response.then(function (result) {
    processRegister(result);
  });

  localStorage.setItem(getRegisterUserData().nick+"-nr_games",0);
}

function processRegister(result) {
  const authModal = document.getElementById("auth-modal");
  const paramsModal = document.getElementById("myModal");
  if (isEmpty(result)) {
    const navbar = document.getElementById("navbar");
    let name = document.createElement("li");
    name.innerHTML = "<h2>" + getRegisterUserData().nick + "</h2>";
    navbar.appendChild(name);

    authModal.style.display = "none";
    paramsModal.style.display = "block";
  } else {
    const form = document.getElementById("register-form");
    const error = document.createElement("span");
    error.innerHTML = "Username already exists!";

    form.appendChild(error);
  }
}

function getRegisterUserData() {
  const username = document.getElementById("username-register");
  const password = document.getElementById("password-register");

  const data = {
    nick: username.value,
    password: password.value,
  };

  nick = username.value;
  pass = password.value;

  return data;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

registerButton.onclick = register;
