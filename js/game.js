var game = new Phaser.Game("100%", "100%", Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render });
var WIDTH = 2000;
var HEIGHT = 2000;
var playing = false;

var startButton;
var mysteryBox;
var player;
var land;

var Player = function(game, x, y, rot) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.sprite = game.add.sprite(x, y, 'fish');
    this.sprite.width = 50;
    this.sprite.height = 50;

    Player.prototype.update = function() {
        this.checkMovement();
    }

    Player.prototype.checkMovement = function() {
        var movement = 4;
        if(playing == true){
            if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.sprite.x -= movement;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                this.sprite.y -= movement;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                this.sprite.y += movement;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.sprite.x += movement;
            }
        }
   } 
}

function preload() {
    game.load.image('earth', 'assets/light_sand.png');
    game.load.image('fish', 'assets/fish.png');
    game.load.spritesheet('start', 'assets/start2.png',120,40); 
    game.load.spritesheet('mystery', 'assets/chest.png',48,38);
}

function create() {
    game.world.setBounds(0, 0, WIDTH, HEIGHT);
    land = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'earth');
    player = new Player(game, 50, 50, 0);
    startButton = game.add.button(750,400, 'start', actionOnClick, this, 1,0,2);
    startButton.anchor.set(0.5,0.5);
    mysteryBox = game.add.button(1400, 75, 'mystery', boxOpen, this, 1, 0, 1);
    mysteryBox.anchor.set(0.5,0.5);

    /*button.OnInputOver.add(over, this);
    button.OnInputOver.add(out,this);
    button.OnInputOver.add(up,this);*/
}

function update() {
    player.update();
}

function actionOnClick () {
    startButton.destroy();
    playing = true;
}

function boxOpen(){
    playing = true;
}

function render() {

}
