export class Board {
  constructor(size, seeds) {
    this.size_ = size;
    this.seeds_ = size;
  }

  getSize() {
    return this.size_;
  }
  getSeeds() {
    return this.seeds_;
  }
  render() {
    let rowOne = document.querySelector(".row.player-one");
    let rowTwo = document.querySelector(".row.player-two");

    for (let i = 0; i < this.getSize(); i++) {
      let pitAndTracker1 = document.createElement("div");
      let pitAndTracker2 = document.createElement("div");

      let pitPlayer1 = document.createElement("div");
      let pitPlayer2 = document.createElement("div");

      let pitTracker1 = document.createElement("div");
      let pitTracker2 = document.createElement("div");

      pitPlayer1.classList.add("pit");
      pitPlayer2.classList.add("pit");

      pitTracker1.classList.add("tracker");
      pitTracker2.classList.add("tracker");

      pitAndTracker1.classList.add("pitAndTracker");
      pitAndTracker2.classList.add("pitAndTracker");

      pitAndTracker1.appendChild(pitPlayer1);
      pitAndTracker1.appendChild(pitTracker1);

      pitAndTracker2.appendChild(pitPlayer2);
      pitAndTracker2.appendChild(pitTracker2);

      rowOne.appendChild(pitAndTracker1);
      rowTwo.appendChild(pitAndTracker2);
    }
  }
}
