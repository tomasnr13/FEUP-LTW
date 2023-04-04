const Model = require("../model/model");
const MancalaController = require("../controller/controller");

module.exports = function (size, seeds, player1, player2) {
  this.model_ = new Model(size, seeds, player1, player2);
  this.controller_ = new MancalaController(this.model_);

  this.getModel = () => {
    return this.model_;
  };

  this.getController = () => {
    return this.controller_;
  };
};
