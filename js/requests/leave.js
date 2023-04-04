import { MyRequest } from "./requests.js";
import { nick, pass } from "./auth/login.js";
import {GAME_ID} from "./join.js";

function leave() {
    const request = new MyRequest("POST", "leave", getParams());

    let response = request.sendRequest();

    response.then(function (result) {
        processLeave(result);
    });
}

function getParams() {
    let data = {
        game: GAME_ID,
        nick: nick,
        password: pass
    };

    return data;
}

function processLeave(result) {
    console.log(result);
    //end game eventsource
}
