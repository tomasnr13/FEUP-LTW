import { MancalaController } from "./controller.js";
import { MancalaView } from "./view.js";
import { Mancala } from "./model.js";
import { nick, pass, isEmpty } from "../requests/auth/login.js";
import { GAME_ID } from "../requests/join.js";
import { update } from "../requests/update.js";
import { MyRequest } from "../requests/requests.js";
import { Board } from "../board.js";

export class Game {
  constructor(size, seeds) {
    this.model_ = new Mancala(size, seeds);
    this.view_ = new MancalaView(this.model_);
    this.controller_ = new MancalaController(this.model_, this.view_);
  }

  getModel() {
    return this.model_;
  }

  getView() {
    return this.view_;
  }

  getController() {
    return this.controller_;
  }

  init() {
    this.getView().render();
  }
}

let game;

export function playGame(size, seeds) {
    game = new Game(size, seeds);
    let waitingForMove = true;

    game.init();

    let bindPitsAction = function (player, row) {
        let processNotify = function (result, pit) {
            if (isEmpty(result)) {
                if (
                    game.getModel().getCurrentPlayer() === player &&
                    waitingForMove
                ) {
                    waitingForMove = false;
                    if (!game.getController().doPlayerTurn(pit)) {
                        waitingForMove = true;
                    }
                }

                //waiting for event
                update(GAME_ID,nick);
                //leave
                const myTimeout = setTimeout(function () {
                  leaveGame(game, nick, pass)
                }, 5000);

            } else {
              console.log(game);
              console.log("Error: " + result.error);
            }
        };

        let clickAction = function () {
          if (
              game.getModel().getCurrentPlayer() === player &&
              waitingForMove
          ) {
              waitingForMove = false;
              let pit = this;

              if (!game.getController().doPlayerTurn(pit)) {
                  waitingForMove = true;
              }
              
              console.log("curr player");
              console.log(game.getModel().getCurrentPlayer());
              if(document.getElementById("ai_mode").checked && game.getModel().getCurrentPlayer()=="two" && waitingForMove){
                console.log("entered");
                if(document.getElementById("ai_intelligence").checked){
                  game.getController().ai_play(1);
                }
                else{
                  game.getController().ai_play(0);
                }
              }
          }
          
          /*const myTimeout = setTimeout(function () {
            leaveGame(game, nick, password)
          }, 5000);*/
        };
        

        let notify = function () {
            const move = Number(this.getAttribute("data-pit"));
            const data = {
                nick: nick,
                password: pass,
                game: GAME_ID,
                move: move,
            };

            const request = new MyRequest("POST", "notify", data);

            let response = request.sendRequest();

            let pit = this;
            response.then((result) => {
                processNotify(result, pit);
            });
        };

        for (let pit = 0; pit < row.length; pit++) {
            row[pit].setAttribute("data-pit", pit);
            if(document.getElementById("pvp_mode").checked){
              row[pit].onclick = notify;
            }
            else{
              row[pit].onclick = clickAction;
            }
        }
    };

    bindPitsAction(
        "one",
        document.querySelectorAll(".row.player-one .pitAndTracker")
    );

    if(!document.getElementById("ai_mode").checked){
      bindPitsAction(
          "two",
          document.querySelectorAll(".row.player-two .pitAndTracker")
      );
    };

    document.getElementById("reset").addEventListener('click', function() { 
      if(document.getElementById("pvp_mode").checked){
        leaveGame();
      }
      else{
        leaveGameOff(game);
      }
    });
}



function leaveGame() {
  if(document.getElementById("pvp_mode").checked){
    const data = {
        game: GAME_ID,
        nick: nick,
        password: pass,
    };

    const request = new MyRequest("POST", "leave", data);

    let response = request.sendRequest();

    response.then((result) => {
        processLeave(result);
    });
  }
}


function processLeave(result){
  if (isEmpty(result)){
    let status = document.querySelector(".status");

    if (game.getController().getScore(1) > game.getController().getScore(2)) {
      status.innerHTML = "Player one wins!";
    } else if (game.getController().getScore(2) > game.getController().getScore(1)) {
      status.innerHTML = "Player two wins!";
    } else {
      status.innerHTML = "Draw!";
    }
    game.getController().addScoreStorage();

    //ver configs e correr novo jogo
    playGame(6, 4);
  }
  else{
    console.log(game);
    console.log("Error: " + result.error);
  }
}

function leaveGameOff(game){
  let status = document.querySelector(".status");

  if (game.getController().getScore(1) > game.getController().getScore(2)) {
    status.innerHTML = "Player one wins!";
  } else if (game.getController().getScore(2) > game.getController().getScore(1)) {
    status.innerHTML = "Player two wins!";
  } else {
    status.innerHTML = "Draw!";
  }
  game.getController().addScoreStorage();

  //initiate new game
  //get 6 and 4 from  config
  //create new board
  //let board = new Board(6, 4);
  //board.render();

  //ver configs e correr novo jogo
  playGame(6, 4);
}

