export class MancalaController {
  constructor(model, view) {
    this.model_ = model;
    this.view_ = view;
  }

  getModel() {
    return this.model_;
  }

  getView() {
    return this.view_;
  }

  isRowEmpty(pits) {
    return pits.every(function (stones) {
      return stones === 0;
    });
  }

  end_stones_idx(idx, stones){
    let mod = (idx+stones) % (2*this.getModel().getSize()+2);
    let res;
    if(mod==0 && idx+stones>0){
      res= mod+2*this.getModel().getSize();
    }
    else{
      res= mod;
    }
    if(idx+stones > 3*this.getModel().getSize()+2){
      res++
    }
    return res;
  }

  ai_play(level) {
    let pitToPlay = 0;
    let pitSet = false;
    let avlblpits = [];
    if (level == 0) {
      for (
        let i = this.getModel().getSize();
        i <= 2 * this.getModel().getSize();
        i++
      ) {
        if (i === this.getModel().getSize()) {
          continue;
        }
        if (this.getModel().getStones(i) > 0) {
          avlblpits.push(i);
        }
      }

      pitToPlay = avlblpits[Math.floor(Math.random() * avlblpits.length)];
      /*if(this.getModel().getStones(pitToPlay) > 0){
        pitSet=true;
      }*/
    } else if (level==1){
        //first goal-> last seed on empty space and seeds on front
        //second goal -> last seed on store
        //third goal-> last seed on empty space
        //fourth goal->
        for (
          let i = this.getModel().getSize();
          i <= 2 * this.getModel().getSize();
          i++
        ) {
          if (i === this.getModel().getSize()) {
            continue;
          }
          if (this.getModel().getStones(i) > 0) {
            avlblpits.push(i);
          }
        }

        pitSet=false;
        let loops=0;
        while (!pitSet) {
          for(let i=0;i<avlblpits.length;i++){
            let idx_stop= this.end_stones_idx(avlblpits[i],this.getModel().getStones(i));
            if(loops==0 && idx_stop!=this.getModel().getPlayer2StoreIdx()){
              if(this.getModel().getStones(idx_stop)==0){
                let inverse = 2 * this.getModel().getSize() - idx_stop;
                if (this.getModel().getStones(inverse) > 0 && (inverse<this.getModel().getSize())){
                  pitToPlay=avlblpits[i];
                  pitSet=true;
                  break;
                }
              }
            }
            else if (loops==1){
              if(idx_stop!=this.getModel().getPlayer2StoreIdx()){
                pitToPlay=avlblpits[i];
                pitSet=true;
                break;
              }
            }
            else{
              pitToPlay=avlblpits[avlblpits.length-1];
              pitSet=true;
              break;
            }
          }
          loops++;
          console.log("loop");
          console.log(pitToPlay);
        }
    }

    let row = this.getModel().getPlayer2Pits();

    let turnOver = this.moveStones(pitToPlay);

    if (turnOver || this.isRowEmpty(row)) {
      this.switchTurn();
    } else {
      this.ai_play(0);
    }

    // make sure that a player hasn't run out of stones
    if (this.checkGameOver()) {
      return true;
    }

    // change the player if the current turn is ended

    return false;
  }

  doPlayerTurn(pit) {
    let pitNo = parseInt(pit.getAttribute("data-pit"));
    if (this.getModel().getCurrentPlayer() === "two") {
      pitNo += this.getModel().getSize() + 1;
    }
    let row = undefined;
    if (pit.parentNode.classList.contains("player-one")) {
      row = this.getModel().getPlayer1Pits();
    } else {
      row = this.getModel().getPlayer2Pits();
    }
    // perform the player's action
    let turnOver = this.moveStones(pitNo);

    if (turnOver || this.isRowEmpty(row)) {
      this.switchTurn();
    }

    // make sure that a player hasn't run out of stones
    if (this.checkGameOver()) {
      return true;
    }

    // change the player if the current turn is ended

    return false;
  }

  switchTurn() {
    this.getModel().setCurrentPlayer(this.getModel().getOtherPlayer());

    let currentPlayer = this.getModel().getCurrentPlayer();
    setTimeout(function () {
      document
        .getElementsByTagName("section")
        .item(0)
        .setAttribute("data-player", currentPlayer);
      let player = document.querySelector(".current-player");
      if (player === null) return;
      if (player.textContent === "one") {
        document.querySelector(".current-player").textContent = "two";
      } else if (player.textContent === "two") {
        document.querySelector(".current-player").textContent = "one";
      }
    }, 500);
  }

  checkGameOver() {
    let winner = this.checkWinner();

    if (winner < 0) {
      return false;
    }
    //TODO: Figure out what this does
    document.getElementsByTagName("section").item(0).classList.add("game-over");
    let status = document.querySelector(".status");

    // Determine which player holds the most stones
    if (winner === 1) {
      status.innerHTML = "Player one wins!";
    } else if (winner === 2) {
      status.innerHTML = "Player two wins!";
    } else {
      status.innerHTML = "Draw!";
    }

    this.addScoreStorage();

    return true;
  }

  moveStones(pit) {
    console.log("I am moving pit " + pit);
    // return if pit has no stones
    if (this.getModel().getStones(pit) < 1) {
      return false;
    }

    // take stones out of pit
    let stones = this.getModel().getStones(pit);
    this.getModel().setStones(pit, 0);

    this.getView().renderPitNo(pit);

    while (stones > 0) {
      ++pit;
      // wrap around the board before reaching other player's store
      if (
        (pit > this.getModel().getSize() * 2 &&
          this.getModel().getCurrentPlayer() == "one") ||
        (pit == this.getModel().getSize() * 2 + 2 &&
          this.getModel().getCurrentPlayer() == "two")
      ) {
        pit = 0;
      } else if (
        pit == this.getModel().getSize() &&
        this.getModel().getCurrentPlayer() == "two"
      ) {
        pit++;
      }

      this.getModel().addStones(pit, 1);
      stones--;

      if (
        pit === this.getModel().getSize() ||
        pit === this.getModel().getSize() * 2 + 1
      ) {
        this.getView().renderStoreNo(pit);
      } else {
        this.getView().renderPitNo(pit);
      }
    }

    // Invert the pit number (number of opposite pit in opponent's row)
    if (
      this.getModel().getCurrentPlayer() == "one" &&
      pit < this.getModel().getSize() &&
      this.getModel().getStones(pit) === 1
    ) {
      let inverse = this.getModel().getSize() - 1 - pit;
      let seeds = this.getModel().getPlayer2Pits()[inverse];
      if (seeds === 0) {
        return true;
      }
      this.getModel().setPlayer1Store(
        this.getModel().getPlayer1Store() + seeds + 1
      );
      this.getModel().setStones(pit, 0);
      this.getModel().setStones(this.getModel().getSize() + 1 + inverse, 0);

      this.getView().renderStoreNo(this.getModel().getSize());
      this.getView().renderPitNo(pit);
      this.getView().renderPitNo(this.getModel().getSize() + 1 + inverse);

      return true;
    }

    if (
      this.getModel().getCurrentPlayer() === "two" &&
      pit > this.getModel().getSize() &&
      pit != this.getModel().getPlayer2StoreIdx() &&
      this.getModel().getStones(pit) === 1
    ) {
      let inverse = 2 * this.getModel().getSize() - pit;
      let seeds = this.getModel().getPlayer1Pits()[inverse];
      if (seeds === 0) {
        return true;
      }
      this.getModel().setPlayer2Store(
        this.getModel().getPlayer2Store() + seeds + 1
      );

      this.getModel().setStones(pit, 0);
      this.getModel().setStones(inverse, 0);
      this.getView().renderStoreNo(this.getModel().getSize() * 2 + 1);
      this.getView().renderPitNo(pit);
      this.getView().renderPitNo(inverse);

      return true;
    }

    // the user's turn ended if the stones did not end in the storage pit
    return (
      pit !== this.getModel().getPlayer1StoreIdx() &&
      pit !== this.getModel().getPlayer2StoreIdx()
    );
  }

  getTotalScore(player) {
    let stones = 0;
    if (player == 1) {
      for (let i = 0; i < this.getModel().getSize(); i++) {
        stones += this.getModel().getStones(i);
      }
    } else {
      for (let i = 0; i < this.getModel().getSize(); i++) {
        stones += this.getModel().getStones(i + this.getModel().getSize());
      }
    }
    return stones;
  }

  getScore(player) {
    if (player == 1) {
      return this.getModel().getPlayer1Store();
    } else {
      return this.getModel().getPlayer2Store();
    }
  }

  addScore() {
    let scores = document.getElementById("scores_d");
    let newscore = document.createElement("div");
    newscore.innerHTML = this.getScore(1) + "-" + this.getScore(2);
    scores.appendChild(newscore);
  }

  addScoreStorage() {
    //relative to user, when user registers, nr_games is put to 0
    this.addScore();

    let username = document.getElementById("username").innerHTML;

    if (
      localStorage.getItem(username + "-nr_games") === null ||
      isNaN(localStorage.getItem(username + "-nr_games"))
    ) {
      localStorage.setItem(username + "-nr_games", JSON.stringify(0));
    }

    let ngame = parseInt(localStorage.getItem(username + "-nr_games")) + 1;
    localStorage.setItem(username + "-nr_games", JSON.stringify(ngame));
    localStorage.setItem(
      username + "-g-" + String(ngame),
      JSON.stringify(this.getScore(1) + "-" + this.getScore(2))
    );
  }

  checkWinner() {
    if (this.getModel().getCurrentPlayer() === "one") {
      const player2Out = this.isRowEmpty(this.getModel().getPlayer2Pits());

      if (!player2Out) {
        return -1;
      } else {
        for (let pit = 0; pit < this.getModel().getSize(); pit++) {
          console.log(
            "pit " + pit + " has " + this.getModel().getStones(pit) + " seeds"
          );
          this.getModel().addStones(
            this.getModel().getPlayer1StoreIdx(),
            this.getModel().getStones(pit)
          );
          this.getModel().setStones(pit, 0);
          this.getView().renderPitNo(pit);
        }
        this.getView().renderStoreNo(this.getModel().getPlayer1StoreIdx());
      }
    } else if (this.getModel().getCurrentPlayer() === "two") {
      const player1Out = this.isRowEmpty(this.getModel().getPlayer1Pits());

      if (!player1Out) {
        return -1;
      } else {
        for (
          let pit = this.getModel().getSize() + 1;
          pit < this.getModel().getSize() * 2 + 1;
          pit++
        ) {
          this.getModel().addStones(
            this.getModel().getPlayer2StoreIdx(),
            this.getModel().getStones(pit)
          );
          this.getModel().setStones(pit, 0);
          this.getView().renderPitNo(pit);
        }
        this.getView().renderStoreNo(this.getModel().getPlayer2StoreIdx());
      }
    }

    console.log("Store 1: " + this.getModel().getPlayer1Store());
    console.log("Store 2: " + this.getModel().getPlayer2Store());

    if (this.getModel().getPlayer1Store() > this.getModel().getPlayer2Store()) {
      return 1;
    } else if (
      this.getModel().getPlayer2Store() > this.getModel().getPlayer1Store()
    ) {
      return 2;
    } else {
      return 0;
    }
  }

}
