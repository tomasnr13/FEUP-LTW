export class SeedView {
  render() {
    const seed = document.createElement("div");
    seed.classList.add("seed");
    let randAngle = parseInt(Math.random() * 360);
    let randY = parseInt(Math.random() * (80 - 10) + 10);
    let randX = parseInt(Math.random() * (75 - 18) + 18);

    seed.style.transform = "rotate(" + randAngle + "deg)";
    seed.style.top = randY + "%";
    seed.style.left = randX + "%";
    return seed;
  }
}
