module.exports = function (model) {
  this.model_ = model;

  this.getModel = () => {
    return this.model_;
  };

  this.isRowEmpty = (pits) => {
    return pits.every(function (stones) {
      return stones === 0;
    });
  };

  this.doPlayerTurn = (pitNo) => {
    let row = undefined;
    if (pitNo < this.getModel().getPlayer1StoreIdx()) {
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
  };

  this.switchTurn = () => {
    this.getModel().setCurrentPlayer(this.getModel().getOtherPlayer());
  };

  this.checkGameOver = () => {
    let winner = this.checkWinner();

    if (winner < 0) {
      return false;
    }
    // Determine which player holds the most stones
    if (winner === 1) {
      this.getModel().setWinner(this.getModel().player1_);
    } else if (winner === 2) {
      this.getModel().setWinner(this.getModel().player2_);
    } else {
      this.getModel().setWinner(null);
    }

    return true;
  };

  this.moveStones = (pit) => {
    // return if pit has no stones
    if (this.getModel().getStones(pit) < 1) {
      return false;
    }

    // take stones out of pit
    let stones = this.getModel().getStones(pit);
    this.getModel().setStones(pit, 0);

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

      return true;
    }

    // the user's turn ended if the stones did not end in the storage pit
    return (
      pit !== this.getModel().getPlayer1StoreIdx() &&
      pit !== this.getModel().getPlayer2StoreIdx()
    );
  };

  this.checkWinner = () => {
    if (this.getModel().getCurrentPlayer() === "one") {
      const player2Out = this.isRowEmpty(this.getModel().getPlayer2Pits());

      if (!player2Out) {
        return -1;
      } else {
        for (let pit = 0; pit < this.getModel().getSize(); pit++) {
          this.getModel().addStones(
            this.getModel().getPlayer1StoreIdx(),
            this.getModel().getStones(pit)
          );
          this.getModel().setStones(pit, 0);
        }
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
        }
      }
    }

    if (this.getModel().getPlayer1Store() > this.getModel().getPlayer2Store()) {
      return 1;
    } else if (
      this.getModel().getPlayer2Store() > this.getModel().getPlayer1Store()
    ) {
      return 2;
    } else {
      return 0;
    }
  };
};
