(function  () {
  window.Game = function Game (board) {
    this.board = board;
    board.populate();
    this.mouseEventsEnable();
  };

  Game.prototype.createSkyfallOrb = function (pos) {
    var col = pos[1];
    for (var i = 0; i < 5; i++) {
      if (!this.board[5 + i][col]) {
        var orb = new Orb.skyfall([5 + i, col], this.board);
        orb.addToBoard();
        return;
      }
    }
  };

  Game.prototype.detectOrbSwap = function (newPos) {
    if (!newPos) return;

    if (this.currentPos[0] !== newPos[0] || this.currentPos[1] !== newPos[1]) {
      var currentOrb = this.board.orbAtPosition(this.currentPos);
      var newOrb = this.board.orbAtPosition(newPos);
      this.board.swapOrbs(currentOrb, newOrb);

      this.currentPos = newPos;
    }
  };

  Game.prototype.hoverOrbContain = function (e) {
    var $boardEl = this.board.$el;
    if (e.pageX < $boardEl.offset().left + 45) {
      e.pageX = $boardEl.offset().left + 45;
    } else if (e.pageX > $boardEl.offset().left + $boardEl.width() - 45) {
      e.pageX = $boardEl.offset().left + $boardEl.width() - 45;
    }

    if (e.pageY < $boardEl.offset().top + 45) {
      e.pageY = $boardEl.offset().top + 45;
    } else if (e.pageY > $boardEl.offset().top + $boardEl.height() - 45) {
      e.pageY = $boardEl.offset().top + $boardEl.height() - 45;
    }
  };

  Game.prototype.hoverOrbShow = function (e) {
    var src = $(e.target).attr('src');
    this.$hoverOrb = $('<img class="orb">').attr('src', src)
    this.$hoverOrb.attr('id', 'drag');

    this.hoverOrbUpdate(e);
    $('body').append(this.$hoverOrb);
  };

  Game.prototype.hoverOrbUpdate = function (e) {
    this.hoverOrbContain(e);
    this.$hoverOrb.css('top', e.pageY - 45 + 'px');
    this.$hoverOrb.css('left', e.pageX - 45 + 'px');
  };

  Game.prototype.match = function () {
    var matches = this.board.getMatches();
    var firstMatch = matches.pop();
    if (!firstMatch) return;

    firstMatch.remove();
    var id = setInterval(function () {
      var match = matches.pop();
      if (match) {
        match.remove();
      } else {
        clearInterval(id);
        // this.skyfall();
      }
    }.bind(this), 500);
  };

  Game.prototype.mousedown = function (e) {
    e.preventDefault();
    $(window).on('mousemove', this.mousemove.bind(this));

    this.hoverOrbShow(e);
    this.currentPos = this.board.getBoardLocation(e);
    this.board.orbAtPosition(this.currentPos).click();

    $(window).one('mouseup', this.mouseup.bind(this));
  };

  Game.prototype.mouseEventsDisable = function () {
    this.board.mouseEventsDisable();
  };

  Game.prototype.mouseEventsEnable = function () {
    this.board.$el.on('mousedown', this.mousedown.bind(this));
  };

  Game.prototype.mouseEventsDisable = function () {
    this.board.$el.off('mousedown');
  };

  Game.prototype.mousemove = function (e) {
    this.hoverOrbUpdate(e);

    var newPos = this.board.getBoardLocation(e);
    this.detectOrbSwap(newPos);
  };

  Game.prototype.mouseup = function () {
    $(window).off('mousemove');
    this.$hoverOrb && this.$hoverOrb.remove();
    this.board.orbAtPosition(this.currentPos).release();
    this.match();
  };

  Game.prototype.getEmpties = function () {
    var empties = [];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 6; j++) {
        if (!this.board[i][j]) {
          empties.push([i, j]);
        }
      }
    }
    return empties;
  };

  Game.prototype.getOrbsAbovePos = function (pos) {
    var orbs = [];
    for (var i = 1; pos[0] + i < 10; i++) {
      var orb = this.board[pos[0] + i][pos[1]];
      if (orb) orbs.push(orb);
    }
    return orbs;
  };

  Game.prototype.gravity = function (empties) {
    $('.skyfall').removeClass('skyfall');

    var orbsToFall = [];
    for (var i = 0; i < empties.length; i++) {
      orbsToFall = orbsToFall.concat(this.getOrbsAbovePos(empties[i]));
    }
    for (var idx = 0; idx < orbsToFall.length; idx++) {
      orbsToFall[idx].fall();
      if (idx === orbsToFall.length - 1) {
        orbsToFall[idx].$orb.one('transitionend', function () {
          $('.gravity').removeClass('gravity');
          setTimeout(this.match.bind(this), 100);
        }.bind(this));
      }
    }
  };

  Game.prototype.skyfall = function () {
    var empties = this.getEmpties();

    for (var i = 0; i < empties.length; i++) {
      this.createSkyfallOrb(empties[i]);
    }

    setTimeout(function () {
      this.gravity(empties);
    }.bind(this), 100);
  };
})();
