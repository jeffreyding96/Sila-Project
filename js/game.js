var game = new Phaser.Game("99%", "99%", Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render });

var roomWidth = 1000;

var WIDTH = 7 * roomWidth;
var HEIGHT = 500;

var facts = ["About 1.3 million gallons of oil are spilled into U.S. waters each year.",
    "Climate change is largely responsible for the bleaching of coral reefs.",
    "8 million tons of plastic are dumped in the ocean each year.", 
    "The oceans absorbed 4.8 to 12.7 million metric tons of plastic trash in 2010.", 
    "We have only explored about 5% of earth's oceans.", 
    "The ocean produces more oxygen than all the rain forests combined."];

var quizzes = [{question: "What source produces the most oxygen?", answers: ["Factories", "The Ocean", "Rain Forests"], answer: 2},
    {question: "How much plastic is dumped in the ocean each year?", answers: ["4 million tons", "6 million tons", "8 million tons"], answer: 3},
    {question: "What object/animal is responsible for the most deaths each year?", answers: ["Sharks", "Mangoes", "Coconuts"], answer: 3},
    {question: "What type of shark can survive in both fresh water and salt water?", answers: ["The Bull Shark", "The Tiger Shark", "The Nurse Shark"], answer: 1}];

var currAnswer;
var gotCorrect = false;
var paperToDestroy;
var previousCheckpoint = 0;
var random;
var confirmButton;
var newItem;

var startButton;
var mysteryBox;
var graphics;
var playing = false;
var content;

var playerGroup;
var obstacleGroup;
var itemGroup;
var uiGroup;
var factMenuGroup;
var quizMenuGroup;
var boxGroup;

var upperBound = HEIGHT / 2 - HEIGHT / 3;
var lowerBound = upperBound + HEIGHT;
var upperLine;
var lowerLine;

var roomLines = [];
var papers = [];
var obstacles = [];
var evolutionTypes = ['clown','beluga', 'dolphin','blacktip','mako', 'hammerhead','greatwhite', 'killer'];
var evolutionHats = ['clownhat','belugahat', 'dolphinhat','blacktiphat','makohat', 'hammerheadhat','greatwhitehat', 'killerhat'];
var obstacleTypes = ['oil', 'bag', 'tire', 'trash'];
var evolution = ['animatedFish', 'clown', 'crab', 'octopus', 'dolphin', 'greatwhite', 'killer']

var factMenu = {};
var quizMenu = {};
var boxMenu = {};

var quizIndex = 0;

var points = 0;
var scoreCounter;
var logo;
var oceancommotion;

var music;
var sound = {};

var Player = function(game, x, y, rot) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.evolveNum = 0;
    this.sprite = game.add.sprite(x, y, 'animatedFish');
    this.sprite.width = 100;
    this.sprite.height = 50;
    this.sprite.rotation = rot;
    this.sprite.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    this.sprite.play('animation');

    Player.prototype.evolveFish = function() {
        this.evolveNum++;
        var oldX = this.sprite.x;
        var oldY = this.sprite.y;
        this.sprite.kill();
        this.sprite = this.game.add.sprite(oldX, oldY, evolution[this.evolveNum]);
        this.sprite.width = 100;
        this.sprite.height = 50;
    }

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

var Obstacle = function(game, x, y, rot) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.speed = getRandBetween(2, 5);
    this.type = obstacleTypes[getRandIntBetween(0, obstacleTypes.length)];
    this.sprite = game.add.sprite(x, y, this.type);
    this.sprite.width = 100;
    this.sprite.height = 150;
    this.sprite.rotation = rot;
    this.changeDirectionTime = game.time.now;
    this.changeDirectionDelay = getRandBetween(1000, 2000);
    this.moveUp = false;

    Obstacle.prototype.update = function() {
        this.move();
    }

    Obstacle.prototype.move = function() {
        if (!playing) {
            return;
        }

        if (game.time.now > this.changeDirectionTime + this.changeDirectionDelay) {
            this.moveUp = !this.moveUp;
            this.changeDirectionTime = game.time.now;
        }
        var movement = this.speed;

        if (this.moveUp) {
            this.sprite.y += movement;
        }
        else {
            this.sprite.y -= movement;
        }
    }
}

function preload() {
    game.load.image('logo', 'assets/logo1.png');
    game.load.image('oceancommotion', 'assets/Ocean Commotion Logo.png');
    game.load.image('white', 'assets/white.png');
    game.load.image('earth', 'assets/light_sand.png');
    game.load.image('waterSprite', 'assets/waterSprite.png');
    game.load.image('fish', 'assets/fish.png');
    game.load.spritesheet('animatedFish', 'assets/animatedFish.png', 252, 209);
    game.load.image('oil', 'assets/oil1.png');
    game.load.image('bag', 'assets/plastic-bags.png');
    game.load.image('crab', 'assets/Crab.png');
    game.load.image('tire', 'assets/tire.png');
    game.load.image('trash', 'assets/trash.png');
    game.load.image('octopus', 'assets/octopus.png');
    game.load.image('dolphin', 'assets/dolphin.png');
    game.load.image('hammerhead', 'assets/hammerhead.png');
    game.load.spritesheet('start', 'assets/start2.png', 120, 40); 
    game.load.spritesheet('mystery', 'assets/chest.png', 48, 38);
    game.load.image('paper', 'assets/paper.png');
    game.load.image('spongebob', 'assets/spongebob.png');
    game.load.spritesheet('water', 'assets/water.png', 32, 400, 32);
    game.load.spritesheet('confirm','assets/confirm.png',109,29);
    game.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt');
    game.load.image('beluga', 'assets/beluga.png');
    game.load.image('blacktip', 'assets/blacktip-shark.png');
    game.load.image('clown', 'assets/clownfish.png');
    game.load.image('dolphin', 'assets/dolphin.png');
    game.load.image('greatwhite', 'assets/greatwhite.png');
    game.load.image('hammerhead', 'assets/hammerhead.png');
    game.load.image('killer', 'assets/killerwhale.png');
    game.load.image('mako', 'assets/mako.png');
    game.load.image('octopus', 'assets/octopus.png');
    game.load.image('belugahat', 'assets/belugahat.png');
    game.load.image('blacktiphat', 'assets/blacktip-sharkhat.png');
    game.load.image('clownhat', 'assets/clownfishhat.png');
    game.load.image('dolphinhat', 'assets/dolphinhat.png');
    game.load.image('greatwhitehat', 'assets/greatwhitehat.png');
    game.load.image('hammerheadhat', 'assets/hammerheadhat.png');
    game.load.image('killerhat', 'assets/killerwhalehat.png');
    game.load.image('makohat', 'assets/makohat.png');
    game.load.image('octopushat', 'assets/octopushat.png');
    game.load.image('newitem', 'assets/newitem.png');
    game.load.audio('kirbymusic', 'assets/kirby_underwater.mp3');
    game.load.audio('underwater', 'assets/underwater.mp3');
    game.load.audio('chatter', 'assets/dolphinchatter.mp3');
    game.load.audio('hmm', 'assets/hmm.mp3');
    game.load.audio('zing', 'assets/zing.mp3');
    game.load.audio('bleh', 'assets/bleh.mp3');
    game.load.audio('aww', 'assets/aww.mp3');
}

function create() {
    land = game.add.tileSprite(0, 0, WIDTH, HEIGHT * 2, 'waterSprite');
    game.world.setBounds(0, 0, WIDTH, HEIGHT);

    createLayers();

    game.stage.disableVisibilityChange = true;
    game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    music = game.add.audio('underwater');
    music.volume -= 2;
    music.loop = true;
    music.play();

    sound.chatter = game.add.audio('chatter');
    sound.hmm = game.add.audio('hmm');
    sound.hmm.volume += 2;
    sound.bleh = game.add.audio('bleh');
    sound.zing = game.add.audio('zing');
    sound.aww = game.add.audio('aww');
    sound.aww.volume += 5;

    player = new Player(game, 0, HEIGHT / 2, 0);
    playerGroup.add(player.sprite);
    game.camera.follow(player.sprite);

    logo = game.add.sprite(0, 0, 'logo');
    logo.fixedToCamera = true;
    logo.cameraOffset.x = 20;
    logo.cameraOffset.y = 15;
    logo.width = 100;
    logo.height = 100;
    uiGroup.add(logo);

    oceancommotion = game.add.sprite(0, 0, 'oceancommotion');
    oceancommotion.fixedToCamera = true;
    oceancommotion.width = 500;
    oceancommotion.height = 300;
    oceancommotion.cameraOffset.x = 0;
    oceancommotion.cameraOffset.y = game.camera.height - oceancommotion.height / 2;
    uiGroup.add(oceancommotion);

    scoreCounter = game.add.bitmapText(0, 0, 'font', '0', 48);
    scoreCounter.fixedToCamera = true;
    scoreCounter.cameraOffset.x = game.camera.width / 2 - scoreCounter.width / 2;
    scoreCounter.cameraOffset.y = 20;
    uiGroup.add(scoreCounter);

    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(5, 0xffffff, 1);
    obstacleGroup.add(graphics);

    createButtons();
    createBorderLines(graphics);
    createRoomLines(graphics);
    createPapers();
    createObstacles();
    createFactMenu();
    createQuizMenu();
}

function createButtons() {
    startButton = game.add.button(750, 400, 'start', actionOnClick, this, 1, 0, 2);
    startButton.x = game.camera.width / 2;
    startButton.y = game.camera.height / 2 - startButton.height / 2;

    startButton.anchor.set(0.5,0.5);
    mysteryBox = game.add.button(game.camera.width - 50, 50, 'mystery', boxOpen, this, 1, 0, 1);
    mysteryBox.anchor.set(0.5,0.5);

    uiGroup.add(startButton);
    uiGroup.add(mysteryBox);
}

function createLayers() {
    obstacleGroup = game.add.group();
    itemGroup = game.add.group();
    playerGroup = game.add.group();
    uiGroup = game.add.group();
    factMenuGroup = game.add.group();
    quizMenuGroup = game.add.group();
    boxGroup = game.add.group();

    game.world.bringToTop(obstacleGroup);
    game.world.bringToTop(itemGroup);
    game.world.bringToTop(playerGroup);
    game.world.bringToTop(uiGroup);
    game.world.bringToTop(factMenuGroup);
    game.world.bringToTop(quizMenuGroup);
    game.world.bringToTop(boxGroup);

    factMenuGroup.visible = false;
    quizMenuGroup.visible = false;
    boxGroup.visible = false;
}

function createBorderLines(graphics) {
    graphics.moveTo(0, upperBound);
    graphics.lineTo(WIDTH, upperBound);
    graphics.moveTo(0, lowerBound);
    graphics.lineTo(WIDTH, lowerBound);
    graphics.endFill();
}

function createRoomLines(graphics) {
    var i = roomWidth;
    while (i < WIDTH) {
        graphics.moveTo(i, upperBound);
        graphics.lineTo(i, lowerBound);

        roomLines.push(i);
        i += roomWidth;
    }
    graphics.endFill();
}

function createPapers() {
    var i = roomWidth;
    while (i < WIDTH) {
        var yVal = getRandBetween(upperBound + 100, lowerBound - 200);
        var paperSprite = game.add.sprite(i - 100, yVal, 'paper');
        paperSprite.width = 50;
        paperSprite.height = 50;
        papers.push(paperSprite);
        itemGroup.add(paperSprite);

        i += roomWidth;
    }
    var paperSprite = game.add.sprite(i - 100, (lowerBound - upperBound) / 2, 'paper');
    paperSprite.y = (lowerBound - upperBound) / 2 + paperSprite.height / 2;
    paperSprite.width = 50;
    paperSprite.height = 50;
    papers.push(paperSprite);
    itemGroup.add(paperSprite);
}

function createObstacles() {
    var count = 100;
    while (count < WIDTH) {
        for (var i = 0; i < 4; i++) {
            var randX;
            while (true) {
                randX = getRandIntBetween(count, count + roomWidth - 400);
                var tooClose = false;
                if (obstacles.length == 0) {
                    break;
                }
                for (var j = 0; j < obstacles.length; j++) {
                    if (Math.abs(obstacles[j].x - randX) < 100) {
                        tooClose = true;
                    }
                }
                if (!tooClose) {
                    break;
                }
            }
            var midPoint = (lowerBound - upperBound) / 2;
            var randY = getRandBetween(upperBound - 100, lowerBound - 200);
            var obs = new Obstacle(game, randX, randY, 0);
            obstacles.push(obs);
            obstacleGroup.add(obs.sprite);
        }
        count += roomWidth;
    }
}

function createFactMenu() {
    factMenu.background = game.add.sprite(0, 0, 'white');
    factMenu.background.width = game.camera.width * 0.75;
    factMenu.background.height = game.camera.height * 0.75;
    factMenu.background.x = game.camera.width * 0.125;
    factMenu.background.y = game.camera.height * 0.125;
    factMenu.background.tint = "#000000";

    factMenu.title = game.add.bitmapText(0, 0, 'font', 'Uh oh! You hit something bad!\nDid you know:');
    factMenu.title.maxWidth = factMenu.background.width * 0.8;
    factMenu.title.align = 'center';
    factMenu.title.x = game.camera.width / 2 - factMenu.title.width / 2;
    factMenu.title.y = factMenu.background.y + 50;

    factMenu.fact = game.add.bitmapText(0, 0, 'font', '1', 32);
    factMenu.fact.maxWidth = factMenu.background.width * 0.8;
    factMenu.fact.align = 'center';
    factMenu.fact.x = game.camera.width / 2 - factMenu.fact.width / 2;
    factMenu.fact.y = game.camera.height / 2 - factMenu.fact.height / 2;
    factMenu.fact.text = "";

    factMenu.okay = game.add.bitmapText(0, 0, 'font', 'Okay', 32);
    factMenu.okay.inputEnabled = true;
    factMenu.okay.align = 'center';
    factMenu.okay.x = game.camera.width / 2 - factMenu.okay.width / 2; 
    factMenu.okay.y = factMenu.background.y + factMenu.background.height - 50;
    factMenu.okay.input.useHandCursor = true;
    factMenu.okay.events.onInputOver.add(function() {
        factMenu.okay.tint = 0xff0000;
    }, this);
    factMenu.okay.events.onInputOut.add(function() {
        factMenu.okay.tint = 0xffffff;
    }, this);
    factMenu.okay.events.onInputDown.add(function() {
        playing = true;
        factMenuGroup.visible = false;
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].sprite.x = obstacles[i].x;
            obstacles[i].sprite.y = obstacles[i].y;
            obstacles[i].changeDirectionTime = game.time.now;
            obstacles[i].moveUp = true;
        }
        if (gotCorrect) {
            gotCorrect = false;
            papers.splice(paperToDestroy, 1);
            points += 5;
            goNextRoom();
            return;
        }
        player.sprite.x = previousCheckpoint;
        player.sprite.y = HEIGHT / 2;
    }, this);

    factMenuGroup.add(factMenu.background);
    factMenuGroup.add(factMenu.title);
    factMenuGroup.add(factMenu.fact);
    factMenuGroup.add(factMenu.okay);
}

function createQuizMenu() {
    quizMenu.background = game.add.sprite(0, 0, 'white');
    quizMenu.background.width = game.camera.width * 0.75;
    quizMenu.background.height = game.camera.height * 0.75;
    quizMenu.background.x = game.camera.width * 0.125;
    quizMenu.background.y = game.camera.height * 0.125;
    quizMenu.background.tint = "#000000";

    quizMenu.question = game.add.bitmapText(0, 0, 'font', '1', 32);
    quizMenu.question.maxWidth = quizMenu.background.width * 0.8;
    quizMenu.question.align = 'center';
    quizMenu.question.x = game.camera.width / 2 - quizMenu.question.width / 2;
    quizMenu.question.y = quizMenu.background.y + 50;

    quizMenu.answer1 = game.add.bitmapText(0, 0, 'font', '111111', 24);
    quizMenu.answer1.inputEnabled = true;
    quizMenu.answer1.maxWidth = quizMenu.background.width * 0.8;
    quizMenu.answer1.align = 'center';
    quizMenu.answer1.x = game.camera.width / 2 - quizMenu.answer1.width / 2;
    quizMenu.answer1.y = quizMenu.background.y + quizMenu.background.height - 20 - 4 * (quizMenu.answer1.height + 40); 
    quizMenu.answer1.input.useHandCursor = true;
    quizMenu.answer1.events.onInputOver.add(function() {
        quizMenu.answer1.tint = 0xff0000;
    }, this);
    quizMenu.answer1.events.onInputOut.add(function() {
        quizMenu.answer1.tint = 0xffffff;
    }, this);
    quizMenu.answer1.events.onInputDown.add(function() {
        answerQuiz(1);
    }, this);

    quizMenu.answer2 = game.add.bitmapText(0, 0, 'font', '111111', 24);
    quizMenu.answer2.inputEnabled = true;
    quizMenu.answer2.maxWidth = quizMenu.background.width * 0.8;
    quizMenu.answer2.align = 'center';
    quizMenu.answer2.x = game.camera.width / 2 - quizMenu.answer2.width / 2;
    quizMenu.answer2.y = quizMenu.background.y + quizMenu.background.height - 20 - 3 * (quizMenu.answer2.height + 40); 
    quizMenu.answer2.input.useHandCursor = true;
    quizMenu.answer2.events.onInputOver.add(function() {
        quizMenu.answer2.tint = 0xff0000;
    }, this);
    quizMenu.answer2.events.onInputOut.add(function() {
        quizMenu.answer2.tint = 0xffffff;
    }, this);
    quizMenu.answer2.events.onInputDown.add(function() {
        answerQuiz(2);
    }, this);

    quizMenu.answer3 = game.add.bitmapText(0, 0, 'font', '111111', 24);
    quizMenu.answer3.inputEnabled = true;
    quizMenu.answer3.maxWidth = quizMenu.background.width * 0.8;
    quizMenu.answer3.align = 'center';
    quizMenu.answer3.x = game.camera.width / 2 - quizMenu.answer3.width / 2;
    quizMenu.answer3.y = quizMenu.background.y + quizMenu.background.height - 20 - 2 * (quizMenu.answer3.height + 40); 
    quizMenu.answer3.input.useHandCursor = true;
    quizMenu.answer3.events.onInputOver.add(function() {
        quizMenu.answer3.tint = 0xff0000;
    }, this);
    quizMenu.answer3.events.onInputOut.add(function() {
        quizMenu.answer3.tint = 0xffffff;
    }, this);
    quizMenu.answer3.events.onInputDown.add(function() {
        answerQuiz(3);
    }, this);

    quizMenu.answer4 = game.add.bitmapText(0, 0, 'font', '111111', 24);
    quizMenu.answer4.inputEnabled = true;
    quizMenu.answer4.maxWidth = quizMenu.background.width * 0.8;
    quizMenu.answer4.align = 'center';
    quizMenu.answer4.x = game.camera.width / 2 - quizMenu.answer4.width / 2;
    quizMenu.answer4.y = quizMenu.background.y + quizMenu.background.height - 20 - 1 * (quizMenu.answer4.height + 40); 
    quizMenu.answer4.input.useHandCursor = true;
    quizMenu.answer4.events.onInputOver.add(function() {
        quizMenu.answer4.tint = 0xff0000;
    }, this);
    quizMenu.answer4.events.onInputOut.add(function() {
        quizMenu.answer4.tint = 0xffffff;
    }, this);
    quizMenu.answer4.events.onInputDown.add(function() {
        answerQuiz(4);
    }, this);

    quizMenuGroup.add(quizMenu.background);
    quizMenuGroup.add(quizMenu.question);
    quizMenuGroup.add(quizMenu.answer1);
    quizMenuGroup.add(quizMenu.answer2);
    quizMenuGroup.add(quizMenu.answer3);
    quizMenuGroup.add(quizMenu.answer4);
}

function answerQuiz(num) {
    if (num == currAnswer) {
        quizIndex++;
        sound.zing.play();
        factMenu.fact.text = "Great job!\nYou can move on to the next zone!";
        gotCorrect = true;
    }
    else {
        sound.aww.play();
        factMenu.fact.text = "Sorry, that's not right...";
        gotCorrect = false;
    }
    factMenu.background.width = game.camera.width * 0.75;
    factMenu.background.height = game.camera.height * 0.75;
    factMenu.background.x = game.camera.x + game.camera.width * 0.125;
    factMenu.background.y = game.camera.y + game.camera.height * 0.125;
    factMenu.title.text = "";
    factMenu.title.x = game.camera.x + game.camera.width / 2 - factMenu.title.width / 2;
    factMenu.title.y = factMenu.background.y + 50;
    factMenu.fact.x = game.camera.x + game.camera.width / 2 - factMenu.fact.width / 2;
    factMenu.fact.y = game.camera.y + game.camera.height / 2 - factMenu.fact.height / 2;
    factMenu.okay.x = game.camera.x + game.camera.width / 2 - factMenu.okay.width / 2; 
    factMenu.okay.y = factMenu.background.y + factMenu.background.height - 50;
    factMenuGroup.visible = true;
    quizMenuGroup.visible = false;
}

function update() {
    player.update();
    updateCollisions();

    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
    }

    scoreCounter.text = points;
}

function actionOnClick () {
    startButton.destroy();
    mysteryBox.destroy();
    playing = true;
}

function boxOpen(){
    boxMenu.background = game.add.sprite(0, 0, 'white');
    boxMenu.background.width = game.camera.width * 0.75;
    boxMenu.background.height = game.camera.height * 0.75;
    boxMenu.background.x = game.camera.width * 0.125;
    boxMenu.background.y = game.camera.height * 0.125;
    boxGroup.add(boxMenu.background);
    boxGroup.visible = true;
    mysteryBox.destroy();
    newItem = game.add.sprite(game.camera.width/2-175,game.camera.height/2-300,'newitem');
    content = game.add.sprite(game.camera.width/2,game.camera.height/2, evolutionHats[getRandIntBetween(0,8)]);
    content.width = 400;
    content.height = 300;
    content.anchor.set(0.5,0.5);
    confirmButton = game.add.button(game.camera.width/2,game.camera.height/2+165,'confirm',confirmClick, 3,2,3);
    confirmButton.anchor.set(0.5,0.5);
}

function confirmClick(){
    confirmButton.destroy();
    content.destroy();
    newItem.destroy();
    boxGroup.visible = false;
}
function updateCollisions() {
    var xPos = player.sprite.x;
    var yPos = player.sprite.y;
    if (xPos <= 0) {
        player.sprite.x = 0;
    }
    if (xPos >= WIDTH - player.sprite.width) {
        player.sprite.x = WIDTH - player.sprite.width;
    }
    if (yPos <= upperBound) {
        player.sprite.y = upperBound;
    }
    if (yPos >= lowerBound - player.sprite.height) {
        player.sprite.y = lowerBound - player.sprite.height;
    }

    if (playing) {
        handlePapers();
        handleObstacles();
        handleRoomLines();
    }
}
function handlePapers() {
    for (var i = 0; i < papers.length; i++) {
        if (isRectangleCollision(player.sprite.x, player.sprite.y, player.sprite.width, player.sprite.height, papers[i].x, papers[i].y, papers[i].width, papers[i].height)) {
            // var randQuiz = quizzes[getRandIntBetween(0, quizzes.length)];
            var randQuiz = quizzes[quizIndex % quizzes.length];
            var paperToDestroy = i;

            quizMenu.answer1.text = "";
            quizMenu.answer2.text = "";
            quizMenu.answer3.text = "";
            quizMenu.answer4.text = "";

            quizMenu.question.text = randQuiz.question;
            quizMenu.answer1.text = randQuiz.answers[0];
            quizMenu.answer2.text = randQuiz.answers[1];
            quizMenu.answer3.text = randQuiz.answers[2];
            if (quizMenu.length > 3)
                quizMenu.answer4.text = randQuiz.answers[3];

            currAnswer = randQuiz.answer;

            quizMenu.background.x = game.camera.x + game.camera.width * 0.125;
            quizMenu.background.y = game.camera.y + game.camera.height * 0.125;
            quizMenu.question.x = game.camera.x + game.camera.width / 2 - quizMenu.question.width / 2;
            quizMenu.question.y = quizMenu.background.y + 50;
            quizMenu.answer1.x = game.camera.x + game.camera.width / 2 - quizMenu.answer1.width / 2;
            quizMenu.answer1.y = quizMenu.background.y + quizMenu.background.height - 20 - 4 * (quizMenu.answer1.height + 40); 
            quizMenu.answer2.x = game.camera.x + game.camera.width / 2 - quizMenu.answer2.width / 2;
            quizMenu.answer2.y = quizMenu.background.y + quizMenu.background.height - 20 - 3 * (quizMenu.answer2.height + 40); 
            quizMenu.answer3.x = game.camera.x + game.camera.width / 2 - quizMenu.answer3.width / 2;
            quizMenu.answer3.y = quizMenu.background.y + quizMenu.background.height - 20 - 2 * (quizMenu.answer3.height + 40); 
            quizMenu.answer4.x = game.camera.x + game.camera.width / 2 - quizMenu.answer4.width / 2;
            quizMenu.answer4.y = quizMenu.background.y + quizMenu.background.height - 20 - 1 * (quizMenu.answer4.height + 40); 

            if (papers.length == 1) {
                quizMenu.question.text = "You made it! You are the king of the ocean.\nHelp your other fish grow by eliminating waste and recycling!";
                quizMenu.question.y = quizMenu.background.y + quizMenu.background.height / 2 - quizMenu.question.height / 2;
                quizMenu.answer1.text = "";
                quizMenu.answer2.text = "";
                quizMenu.answer3.text = "";
                quizMenu.answer4.text = "";
            }

            playing = false;
            quizMenuGroup.visible = true;

            sound.hmm.play();
        }
    }
}
function handleObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        if (isRectangleCollision(player.sprite.x, player.sprite.y, player.sprite.width, player.sprite.height, obstacles[i].sprite.x, obstacles[i].sprite.y, obstacles[i].sprite.width, obstacles[i].sprite.height)) {
            var randFact = facts[getRandIntBetween(0, facts.length)];

            factMenu.background.width = game.camera.width * 0.75;
            factMenu.background.height = game.camera.height * 0.75;
            factMenu.background.x = game.camera.x + game.camera.width * 0.125;
            factMenu.background.y = game.camera.y + game.camera.height * 0.125;
            factMenu.title.text = "Uh oh! You hit something bad!\nDid you know:";
            factMenu.title.x = game.camera.x + game.camera.width / 2 - factMenu.title.width / 2;
            factMenu.title.y = factMenu.background.y + 50;
            factMenu.fact.text = randFact;
            factMenu.fact.x = game.camera.x + game.camera.width / 2 - factMenu.fact.width / 2;
            factMenu.fact.y = game.camera.y + game.camera.height / 2 - factMenu.fact.height / 2;
            factMenu.okay.x = game.camera.x + game.camera.width / 2 - factMenu.okay.width / 2; 
            factMenu.okay.y = factMenu.background.y + factMenu.background.height - 50;

            playing = false;
            factMenuGroup.visible = true;

            points -= 2;

            sound.chatter.play();
            // sound.bleh.play();
        }
    }
}

function handleRoomLines() {
    if (player.sprite.x >= roomLines[0] - player.sprite.width) {
        player.sprite.x = roomLines[0] - player.sprite.width;
    }
}

function goNextRoom() {
    graphics.lineStyle(5, 0x00ff00, 1);
    graphics.moveTo(roomLines[0], upperBound);
    graphics.lineTo(roomLines[0], lowerBound);
    graphics.endFill();
    previousCheckpoint = roomLines[0];
    roomLines.splice(0, 1);
    player.evolveFish();
    playerGroup.add(player.sprite);
    game.camera.follow(player.sprite);
}

function render() {

}

function getRandBetween(x, y) {
    return Math.random() * (y - x) + x;
}
function getRandIntBetween(x, y) {
    return Math.floor(getRandBetween(x, y));
}
function isRectangleCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 < x2 + w1 && x1 + w1 > x2 &&
        y1 < y2 + h2 && h1 + y1 > y2) {
        return true;
    }
    return false;
}
