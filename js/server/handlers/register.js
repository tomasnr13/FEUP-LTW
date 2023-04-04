const fs = require("fs");
const crypto = require("crypto");

exports.handleRegister = function (body) {
  const data = JSON.parse(body);
  const filePath = "./handlers/users.jsonl";
  let nick, pass;

  for (const key in data) {
    if (key === "nick") {
      nick = data[key];
    } else if (key === "password") {
      pass = data[key];
    } else {
      return [{ error: "Invalid parameter in request" }, 400];
    }
  }

  if (nick === undefined) {
    return [{ error: "Nick not specified" }, 400];
  }

  if (pass === undefined) {
    return [{ error: "Password not specified" }, 400];
  }

  try {
    let isFound = false;

    const fileData = fs.readFileSync(filePath, {
      encoding: "utf-8",
      flag: "r",
    });

    const lines = fileData.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== "") {
        const lineData = JSON.parse(lines[i]);

        if (lineData.nick === nick) {
          if (
            lineData.pass ===
            crypto.createHash("md5").update(pass).digest("hex")
          ) {
            isFound = true;
            return [{}, 200];
          } else {
            isFound = true;
            return [
              { error: "User registered with a different password" },
              401,
            ];
          }
        }
      }
    }

    if (!isFound) {
      const hashPass = crypto.createHash("md5").update(pass).digest("hex");

      const newUser = {
        nick: nick,
        pass: hashPass,
      };

      fs.appendFileSync(filePath, JSON.stringify(newUser) + "\n", (err) => {
        if (err) {
          throw err;
        }
      });

      return [{}, 200];
    }
  } catch (err) {
    console.error(err);
  }
};
