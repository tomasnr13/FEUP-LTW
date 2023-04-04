import { MyRequest } from "./requests.js";

let RANKING = undefined;
const rankingButton = document.getElementById("scoreboard");
const rankingClose = document.getElementById("ranking-modal-close");
const rankingModal = document.getElementById("ranking-modal");

function ranking() {
  const request = new MyRequest("POST", "ranking", {});

  let response = request.sendRequest();

  response.then((result) => {
    processRanking(result);
  });
}

function processRanking(result) {
  RANKING = result.ranking;
  const rankingContent = document.getElementById("ranking-table");

  rankingContent.innerHTML = `<tr><th>Name</th><th>Games</th><th>Victories</th></tr>`;
  rankingModal.style.display = "block";
  for (let i = 0; i < RANKING.length; i++) {
    rankingContent.innerHTML += `<tr><td>${RANKING[i].nick}</td><td>${RANKING[i].games}</td><td>${RANKING[i].victories}</td></tr>`;
  }
}

rankingButton.onclick = ranking;
rankingClose.onclick = () => {
  rankingModal.style.display = "none";
};
