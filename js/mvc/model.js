export class Mancala {
  constructor(size, seeds) {
    this.size_ = Number(size);

    this.currentPlayer_ = "one";
    this.player1Pits_ = Array(size).fill(Number(seeds));
    this.player2Pits_ = Array(size).fill(Number(seeds));
    this.player1Store_ = 0;
    this.player2Store_ = 0;
  }

  getCurrentPlayer() {
    return this.currentPlayer_;
  }

  getOtherPlayer() {
    return this.currentPlayer_ === "one" ? "two" : "one";
  }

  getSize() {
    return this.size_;
  }

  getPlayer1Pits() {
    return this.player1Pits_;
  }

  getPlayer2Pits() {
    return this.player2Pits_;
  }

  getPlayer1Store() {
    return this.player1Store_;
  }

  getPlayer2Store() {
    return this.player2Store_;
  }

  getPlayer1StoreIdx() {
    return this.getSize();
  }

  getPlayer2StoreIdx() {
    return this.getSize() * 2 + 1;
  }

  getStones(pit) {
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
  }

  setCurrentPlayer(player) {
    this.currentPlayer_ = player;
  }

  setPlayer1Pits(pits) {
    this.player1Pits_ = pits;
  }

  setPlayer2Pits(pits) {
    this.player2Pits_ = pits;
  }

  setPlayer1Store(store) {
    this.player1Store_ = store;
  }

  setPlayer2Store(store) {
    this.player2Store_ = store;
  }

  setStones(pit, stones) {
    if (pit === this.getPlayer1StoreIdx()) {
      this.player1Store_ = stones;
    } else if (pit === this.getPlayer2StoreIdx()) {
      this.player2Store_ = stones;
    } else if (pit < this.getSize()) {
      this.player1Pits_[pit] = stones;
    } else if (pit > this.getSize()) {
      this.player2Pits_[pit - (this.getSize() + 1)] = stones;
    }
  }

  addStones(pit, stones) {
    if (pit === this.getPlayer1StoreIdx()) {
      this.player1Store_ += stones;
    } else if (pit === this.getPlayer2StoreIdx()) {
      this.player2Store_ += stones;
    } else if (pit < this.getSize()) {
      this.player1Pits_[pit] += stones;
    } else if (pit > this.getSize()) {
      this.player2Pits_[pit - (this.getSize() + 1)] += stones;
    }
  }
}
