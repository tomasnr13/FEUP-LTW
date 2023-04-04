import { MyRequest } from "../requests.js";
export { nick, pass, isEmpty };

const loginButton = document.getElementById("login-submit");

let nick = null;
let pass = null;

function login() {
  const request = new MyRequest("POST", "register", getLoginUserData());

  let response = request.sendRequest();

  response.then(function (result) {
    processLogin(result);
  });

  document.getElementById("username").innerHTML=String(nick);
  let scores = document.getElementById("scores_d");
  let ngames = parseInt(localStorage.getItem(nick+"-nr_games"));

  for(let i=1;i<=ngames;i++){
    let sc=document.createElement('div');
    sc.innerHTML=JSON.parse(localStorage.getItem(nick+"-g-"+String(i)));
    scores.appendChild(sc);
  }
}

function getLoginUserData() {
  const username = document.getElementById("username-login");
  const password = document.getElementById("password-login");

  const data = {
    nick: username.value,
    password: password.value,
  };

  nick = username.value;
  pass = password.value;

  return data;
}

function processLogin(result) {
  const authModal = document.getElementById("auth-modal");
  const paramsModal = document.getElementById("myModal");
  if (isEmpty(result)) {
    authModal.style.display = "none";
    paramsModal.style.display = "block";
  } else {
    const form = document.getElementById("login-form");
    const error = document.createElement("span");
    error.innerHTML = "Wrong username and Password combination";

    form.appendChild(error);
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

loginButton.onclick = login;

