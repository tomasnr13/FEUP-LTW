const fs = require("fs");

exports.handleRanking = () => {
  const filePath = "./handlers/ranking.json";

  try {
    const fileData = fs.readFileSync(filePath, {
      encoding: "utf-8",
      flag: "r",
    });

    const line = fileData.split(/\r?\n/)[0];
    return [line, 200];
  } catch (err) {
    console.error(err);
  }
};
