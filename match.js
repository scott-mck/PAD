(function () {
  window.Match = function Match (board, orbs) {
    this.board = board;
    this.orbs = [];
    this.color = orbs[0].color;

    this.add(orbs);
  };

  Match.prototype.add = function (orb) {
    if (!orb) return;

    if (orb.constructor.name === 'Array') {
      this.addOrbs(orb);
    } else if (orb.constructor.name === 'Orb') {
      if (this.orbs.indexOf(orb) < 0) {
        this.orbs.push(orb);
        orb.match = this;
      }
    }
  };

  Match.prototype.addOrbs = function (orbs) {
    for (var i = 0; i < orbs.length; i++) {
      if (this.orbs.indexOf(orbs[i]) < 0) {
        orbs[i].match = this;
        this.orbs.push(orbs[i]);
      }
    }
  };

  Match.prototype.isConnected = function (match2) {
    if (this.color !== match2.color) return false;

    for (var i = 0; i < this.orbs.length; i++) {
      for (var j = 0; j < match2.orbs.length; j++) {
        if (this.orbsConnectedOrSame(this.orbs[i], match2.orbs[j])) {
          return true;
        }
      }
    }
  };

  Match.prototype.merge = function (match2) {
    for (var i = 0; i < match2.orbs.length; i++) {
      if (this.orbs.indexOf(match2.orbs[i]) < 0) {
        this.add(match2.orbs[i]);
      }
    }
  };

  Match.prototype.orbsConnectedOrSame = function (orb1, orb2) {
    if (orb1.pos[0] === orb2.pos[0]) {
      // check for same position
      if (orb1.pos[1] === orb2.pos[1]) return true;
      // check for horizontal connection
      if (orb1.pos[1] + 1 === orb2.pos[1] || orb1.pos[1] - 1 === orb2.pos[1]) {
        return true;
      }
    }

    if (orb1.pos[1] === orb2.pos[1]) {
      // check for vertical connection
      if (orb1.pos[0] + 1 === orb2.pos[0] || orb1.pos[0] - 1 === orb2.pos[0]) {
        return true;
      }
    }

    return false;
  };

  Match.prototype.randomize = function () {
    for (var i = 0; i < this.orbs.length; i++) {
      this.orbs[i].randomizeColor();
    }
  };

  Match.prototype.remove = function () {
    this.orbs.forEach(function (orb) {
      this.board.removeOrb(orb);
      orb.remove();
    }.bind(this));
  };

  Match.prototype.removeOrb = function (orb) {
    var idx = this.orbs.indexOf(orb);
    var removedOrb = this.orbs.splice(idx, 1);
    removedOrb.match = undefined;
  };
})();
