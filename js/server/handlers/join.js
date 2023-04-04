const crypto = require("crypto");
const Game = require("../game/game");

module.exports.PLAYER_1 = null;
module.exports.PLAYER_2 = null;
module.exports.GAME = null;

module.exports.handleJoin = function (body) {
  const data = JSON.parse(body);

  if (data.group === undefined) {
    return [{ error: "Group not defined" }, 400];
  } else if (data.nick === undefined) {
    return [{ error: "User not defined" }, 400];
  } else if (data.password === undefined) {
    return [{ error: "Password not defined" }, 400];
  } else if (data.initial === undefined) {
    return [{ error: "Initial seed amount not defined" }, 400];
  } else if (data.size === undefined) {
    return [{ error: "Board size not defined" }, 400];
  }

  const GAME_HASH = createGameHash(data.group, data.initial, data.size);

  if (module.exports.PLAYER_1 === null && module.exports.PLAYER_2 === null) {
    module.exports.PLAYER_1 = data.nick;
    return [{ game: GAME_HASH }, 200];
  }

  if (module.exports.PLAYER_1 !== null && module.exports.PLAYER_2 === null) {
    if (module.exports.PLAYER_1 !== data.nick) {
      module.exports.PLAYER_2 = data.nick;

      module.exports.GAME = new Game(
        data.size,
        data.initial,
        module.exports.PLAYER_1,
        module.exports.PLAYER_2
      );

      console.log("Game on join");
      console.log(module.exports.GAME);

      return [{ game: GAME_HASH }, 200];
    } else {
      return [{ error: "User already playing" }, 400];
    }
  }

  return [{ error: "Game already has two players" }, 400];
};

function createGameHash(group, initial, size) {
  const currentDate = new Date();
  const time =
    currentDate.getFullYear().toString() +
    (currentDate.getMonth() + 1).toString() +
    currentDate.getDate().toString() +
    currentDate.getHours().toString() +
    currentDate.getMinutes().toString();

  const gameData =
    group.toString() + initial.toString() + size.toString() + time;

  return crypto.createHash("md5").update(gameData).digest("hex");
}
