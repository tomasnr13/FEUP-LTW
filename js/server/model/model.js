module.exports = function (size, seeds, player1, player2) {
  this.size_ = Number(size);

  this.currentPlayer_ = player1;
  this.player1_ = player1;
  this.player2_ = player2;
  this.winner_ = undefined;

  this.player1Pits_ = Array(size).fill(Number(seeds));
  this.player2Pits_ = Array(size).fill(Number(seeds));
  this.player1Store_ = 0;
  this.player2Store_ = 0;

  this.getCurrentPlayer = () => {
    return this.currentPlayer_;
  };

  this.getWinner = () => {
    return this.winner_;
  };

  this.setWinner = (winner) => {
    this.winner_ = winner;
  };

  this.getOtherPlayer = () => {
    return this.currentPlayer_ === this.player1_
      ? this.player2_
      : this.player1_;
  };

  this.getSize = () => {
    return this.size_;
  };

  this.getPlayer1Pits = () => {
    return this.player1Pits_;
  };

  this.getPlayer2Pits = () => {
    return this.player2Pits_;
  };

  this.getPlayer1Store = () => {
    return this.player1Store_;
  };

  this.getPlayer2Store = () => {
    return this.player2Store_;
  };

  this.getPlayer1StoreIdx = () => {
    return this.getSize();
  };

  this.getPlayer2StoreIdx = () => {
    return this.getSize() * 2 + 1;
  };

  this.getStones = (pit) => {
    if (pit === this.getPlayer1StoreIdx()) {
      return this.player1Store_;
    } else if (pit === this.getPlayer2StoreIdx()) {
      return this.player2Store_;
    } else if (pit < this.getSize()) {
      return this.player1Pits_[pit];
    } else if (pit > this.getSize()) {
      return this.player2Pits_[pit - (this.getSize() + 1)];
    }

    return NaN;
  };

  this.setCurrentPlayer = (player) => {
    this.currentPlayer_ = player;
  };

  this.setPlayer1Pits = (pits) => {
    this.player1Pits_ = pits;
  };

  this.setPlayer2Pits = (pits) => {
    this.player2Pits_ = pits;
  };

  this.setPlayer1Store = (store) => {
    this.player1Store_ = store;
  };

  this.setPlayer2Store = (store) => {
    this.player2Store_ = store;
  };

  this.setStones = (pit, stones) => {
    if (pit === this.getPlayer1StoreIdx()) {
      this.player1Store_ = stones;
    } else if (pit === this.getPlayer2StoreIdx()) {
      this.player2Store_ = stones;
    } else if (pit < this.getSize()) {
      this.player1Pits_[pit] = stones;
    } else if (pit > this.getSize()) {
      this.player2Pits_[pit - (this.getSize() + 1)] = stones;
    }
  };

  this.addStones = (pit, stones) => {
    if (pit === this.getPlayer1StoreIdx()) {
      this.player1Store_ += stones;
    } else if (pit === this.getPlayer2StoreIdx()) {
      this.player2Store_ += stones;
    } else if (pit < this.getSize()) {
      this.player1Pits_[pit] += stones;
    } else if (pit > this.getSize()) {
      this.player2Pits_[pit - (this.getSize() + 1)] += stones;
    }
  };
};
