import { MyRequest } from "./requests.js";
import { isEmpty } from "./auth/login.js";

function processUpdate(result) {
    if(result===undefined){
    }
    else{
        console.log("Error: " + result.error);
    }
}

function update(game_id,username) {
    let data = {
        game: game_id,
        nick: username,
    };
    const request = new MyRequest("GET", "update", data);

    let response = request.sendRequest();

    response.then((result) => {
        processUpdate(result);
    });
}

export {update};

