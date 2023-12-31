;(function(exports) {
  function Bullet(center, angle, creator) {
    this.creator = creator;
    this.game = creator.game;
    this.color = creator.color;
    this.created = Date.now();
    this.isEnemy = creator.isEnemy;
    this.isDead = false;

    this.angle = angle;
    this.speed = 3;

    // Set points and lines about bullet center.
    this.center = { x: center.x, y: center.y };
    this.resetPoints();
    this.resetLineSegments();
	
	//Audio
	this.shootSound = new Audio('./res/shootSound.mp3');
	
	this.shootSound.playbackRate = 15;
	this.shootSound.play();
  }

  Bullet.prototype = {
    //Updates position of the bullet
    update: function() {
      //Move center by speed and angle
      this.game.trig.translatePoint(this.center, this.speed, this.angle);

      //Reset points and lines about new center
      this.resetPoints();
      this.resetLineSegments();

      //Kill off-screen bullets
      if (this.game.offScreen(this)) {
        this.die();
      }
    },

    //Draws the bullet on the screen
    draw: function(screen) {
	  screen.lineWidth = 10;
      screen.strokeStyle = this.color;
      screen.beginPath();
      screen.arc(this.center.x, this.center.y, 1, 0, this.game.FULL_ROTATION);
      screen.stroke();
    },

    //Handles events occurring upon the destruction of the bullet
    die: function() {
      //Ensure the bullet is removed at most once
      if (this.isDead) return;
      this.isDead = true;

      //Remove the dead bullet from the list of game bodies
      this.game.removeBody(this);
    },

    //Resets the points of the path of the bullet between time t-1 and t, relative to its center
    resetPoints: function() {
      this.points = [
        { x: this.center.x - this.speed *  Math.cos(this.angle),
          y: this.center.y - this.speed * -Math.sin(this.angle) },
        { x: this.center.x, y: this.center.y }
      ];
    },

    //Resets the line segment of the path of the bullet between time t-1 and t, relative to its points. Used for collision detection
    resetLineSegments: function() {
      this.lineSegments = [{ p1: this.points[0], p2: this.points[1] }];
    }
  };

  exports.Bullet = Bullet;
})(this);
