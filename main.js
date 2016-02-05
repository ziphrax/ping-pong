$(function(){
  $('#send').click(function(e){
    e.preventDefault();
    var playerBat, computerBat, ball;
    var playerScore = 0, computerScore = 0;
    var computerBatSpeed = 190;
    var ballSpeed = 200;
    var ballReleased = false;
    var playerBatHalfWidth;
    var playerScoreText,computerScoreText;
    var user_input = $('#chat_box').val();
    if(user_input == '/play pong'){
      //removeCurrentGame();  maybe need to add function to remove current game.*/
      var chat_history = $('#chat_history')
        .append($("<li class='list-group-item current_game'></li>"));
      var current_game = $('li:last-child')
        .append($('<div id="current_game"></div'));

        current_game.hide();

        var hidden = true;

      var game = new Phaser.Game(400,300,Phaser.AUTO,'current_game',{ preload: preload, create: create, update: update });

      function preload(){
        game.load.image('bat', 'assets/paddle.png');
        game.load.image('ball', 'assets/ball.png');
        game.load.image('background', 'assets/starfield.png');
      }

      function create(){
         game.add.tileSprite(0,0,400,300,'background');
         game.physics.startSystem(Phaser.Physics.ARCADE);

         playerBat = createBat(game.world.centerX, 280);

         computerBat = createBat(game.world.centerX, 20);

         playerScoreText = game.add.text(50,10,'',{ font: "15px Arial", fill: "#19de65" ,fontWeight: 'bold'});
         computerScoreText = game.add.text(350,10,'',{ font: "15px Arial", fill: "#19de65" ,fontWeight: 'bold'});

         ball = createBall(game.world.centerX, game.world.centerY);
         playerBatHalfWidth = playerBat.width / 2;



         game.input.onDown.add(setBall, this);
      }

      function update (){
        if(hidden){
          hidden = false;
          current_game.slideDown();
        }
        controlPlayerPaddle(this.game.input.x);
        controlComputerPaddle();
        processBallAndPaddleCollisions();
        checkGoal();
        updateScores();
      }

      function updateScores(){
        playerScoreText.setText(playerScore);
        computerScoreText.setText(computerScore);

        if(playerScore > 4){
          endGame(true);
        } else if ( computerScore > 4){
          endGame(false);
        }
      }

      function createBat (x,y) {
         var bat = game.add.sprite(x,y, 'bat');
         game.physics.enable(bat);
         bat.anchor.setTo(0.5,0.5);
         bat.body.collideWorldBounds = true;
         bat.body.bounce.setTo(1,1);
         bat.body.immovable = true;
         return bat;
       }
       function createBall (x,y) {
         var tmpBall = game.add.sprite(x,y, 'ball');
         game.physics.enable(tmpBall);
         tmpBall.anchor.setTo(0.5,0.5);
         tmpBall.body.collideWorldBounds = true;
         tmpBall.body.bounce.setTo(1, 1);
         return tmpBall;
       }
       function setBall () {
         if (ballReleased) {
           ball.x = game.world.centerX;
           ball.y = game.world.centerY;
           ball.body.velocity.x = 0;
           ball.body.velocity.y = 0;
           ballReleased = false;
         } else {
           ball.body.velocity.x = ballSpeed;
           ball.body.velocity.y = -ballSpeed;
           ballReleased = true;
         }
       }
       function controlPlayerPaddle (x) {
         playerBat.x = x;
         if (playerBat.x < playerBatHalfWidth) {
           playerBat.x = playerBatHalfWidth;
         } else if (playerBat.x > game.width - playerBatHalfWidth) {
           playerBat.x = game.width - playerBatHalfWidth;
         }
       }
       function controlComputerPaddle () {
         if (computerBat.x - ball.x < -15) {
           computerBat.body.velocity.x = computerBatSpeed;
         } else if(computerBat.x - ball.x > 15) {
           computerBat.body.velocity.x = -computerBatSpeed;
         } else {
           computerBat.body.velocity.x = 0;
         }
       }
       function processBallAndPaddleCollisions () {
         game.physics.arcade.collide(ball, playerBat, ballHitsBat, null, this);
         game.physics.arcade.collide(ball, computerBat, ballHitsBat, null, this);
       }
       function ballHitsBat (_ball, _bat) {
         var diff = 0;
         if (_ball.x < _bat.x) {
           diff = _bat.x - _ball.x;
         } else if (_ball.x > _bat.x) {
           diff = _ball.x - _bat.x;
           _ball.body.velocity.x = (10*diff);
         } else {
           _ball.body.velocity.x = 2 + Math.random() * 8;
         }
       }
       function checkGoal () {
         if (ball.y < 13) {
           playerScore++;
           setBall();
         } else if (ball.y > 285) {
           computerScore++;
           setBall();
         }
       }
       function endGame(playerWon){
         game.destroy();
         if(playerWon){
           current_game.html('Congratulations! you won.');
         } else {
           current_game.html('Sorry, you lost.');
         }
       }

    }
  });




});
