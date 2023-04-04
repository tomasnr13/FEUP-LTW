const game = require("./join");

module.exports.GAME_OVER = false;

module.exports.handleNotify = function (body) {
  const data = JSON.parse(body);

  if (data.nick === undefined) {
    return [{ error: "User not defined" }, 400];
  } else if (data.password === undefined) {
    return [{ error: "Password not defined" }, 400];
  } else if (data.game === undefined) {
    return [{ error: "Game not defined" }, 400];
  } else if (data.move === undefined) {
    return [{ error: "Move not defined" }, 400];
  }

  console.log("Game on notify");
  console.log(game);

  if (game.GAME === null) {
    return [{ error: "No game with ID of " + data.game }, 400];
  }

  if (game.GAME.getModel().getCurrentPlayer() !== data.nick) {
    return [{ error: "Not your turn to play" }, 400];
  }

  if (isNaN(parseInt(data.move))) {
    return [{ error: "Invalid move" }, 400];
  }

  let move = parseInt(data.move);

  if (move < 0 || move >= game.GAME.getModel().getPlayer1StoreIdx()) {
    return [{ error: "Invalid move" }, 400];
  }

  if (data.nick === game.PLAYER_2) {
    move += game.GAME.getModel().getSize() + 1;
  }

  if (game.GAME.getModel().getStones(move) === 0) {
    return [{ error: "Empty pit" }, 400];
  }

  makeMove(game.GAME, move);
  return [{}, 200];
};

function makeMove(game, move) {
  let gameOver = game.getController().doPlayerTurn(move);

  if (!gameOver) {
    game.getController().switchTurn();
  } else {
    module.exports.GAME_OVER = true;
  }
}
