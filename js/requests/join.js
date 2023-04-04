import { MyRequest } from "./requests.js";
import { update } from "../requests/update.js";
import { nick, pass } from "./auth/login.js";
import { Board } from "../board.js";
import { playGame } from "../mvc/script.js";
const GROUP_ID = 44;
let GAME_ID = undefined;

const paramsButton = document.getElementById("parameters");
const paramsModal = document.getElementById("myModal");

function join() {
  const request = new MyRequest("POST", "join", getParams());

  let response = request.sendRequest();

  response.then(function (result) {
    processJoin(result);
  });
}

function processJoin(result) {
  if (result.game === undefined) {
  } else {
    GAME_ID = result.game;
    console.log(getParams());
    setGame(getParams().initial, getParams().size);
    paramsModal.style.display = "none";

    //waiting for event
    update(GAME_ID,nick);
  }
}

function getParams() {
  const sizeInput = document.getElementById("pitNo");
  const seedInput = document.getElementById("seedNo");
  const size = sizeInput.value === "" ? 6 : sizeInput.value;
  const initial = seedInput.value === "" ? 4 : sizeInput.value;

  let data = {
    group: GROUP_ID,
    nick: nick,
    password: pass,
    size: size,
    initial: initial,
  };

  return data;
}

function setGame(seedAmount, pitAmount) {
  let board = new Board(pitAmount, seedAmount);
  board.render();
  playGame(pitAmount, seedAmount);
}

paramsButton.addEventListener("click",function() {
  if(document.getElementById("pvp_mode").checked){
    paramsButton.onclick = join;
  }
  else {
    setGame(getParams().initial, getParams().size);
    paramsModal.style.display = "none";
  }
});

export { GAME_ID };
