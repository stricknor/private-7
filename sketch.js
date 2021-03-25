/* 

GAME PROJECT
I.J.
INTRODUCTION TO PROGRAMMING I

*/


// GLOBAL VARIABLES

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var trees_x;
var mountain;
var canyon;
var collectable;

var game_score;
var flagpole;
var lives;
var isDead;

var enemies;

var jumpSound;
var collectSound;
var fallSound;
var loseSound;
var winSound;
var bgMusic;

var fontGame;

var r1;
var r2;
var g1;


function preload()
{
    soundFormats('wav', 'mp3');

    // LOAD SOUNDS
    
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    collectSound = loadSound('assets/collect.wav');
    collectSound.setVolume(0.3);
    
    fallSound = loadSound('assets/fall.wav');
    fallSound.setVolume(0.6);
    
    loseSound = loadSound('assets/lose.wav');
    loseSound.setVolume(0.3);
    
    winSound = loadSound('assets/win.wav');
    winSound.setVolume(0.4);
    
    // CREDIT: https://freesound.org/people/PatrickLieberkind/
    bgMusic = loadSound('assets/bgmusic.wav');
    bgMusic.setVolume(0.2);
    
    // LOAD FONT(S)
    fontGame = loadFont('assets/Gameplay.ttf');
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    
    bgMusic.loop();
    
    lives = 3;

    startGame();
}

function draw()
{
	
    // RANDOMIZED GRADIENT BACKGROUND 
    
    setGradient(c1, c2);
    
    function setGradient(c1, c2)
    {
        noFill();
        for (var y = 0; y < floorPos_y; y++)
        {
            var inter = map(y, 0, floorPos_y, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(0, y, width, y);
        }
    }

	// GREEN GROUND
    
    noStroke();
	fill(10,170,40);
	rect(0, floorPos_y, width, height/4);
    
    // START BANNER
    if(isPlummeting !== true)
    {
    fill(40,80);
    rect(gameChar_x - 15,floorPos_y,30,10,10);
    }
    
    push();
    translate(scrollPos,0);
    
    // GRID OF STARS
    drawStars();

    // DRAW CLOUDS
    drawClouds();
    
    // DRAW MOUNTAINS
    drawMountains();
    
    // DRAW TREES
    drawTrees();
    
    // DRAW CANYONS
    for(var i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }

	// DRAW COLLECTABLES
    for(var i = 0; i < collectable.length; i++)
    {
        if(!collectable[i].isFound)
            {
                checkCollectable(collectable[i]);
                drawCollectable(collectable[i]);
            }
    }
    
    
    // DRAW FLAGPOLE
    renderFlagpole();
    
    // DRAW ENEMIES
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact)
        {
            if(lives > 0)
            {
                fallSound.play();
                startGame();
                lives -= 1;
                break;
            }
            if (lives == 0)
            {
                loseSound.play();
                break;
            }
        }
    }
    
    pop();
    
	// DRAW GAME CHARACTER
	drawGameChar();
    
    // DRAW INSTRUCTIONS
    instructButton();
    
    // CALCULATE & DISPLAY GAME SCORE
    fill(255);
    noStroke();
    textSize(18);
    textFont(fontGame);
    text("score : " + game_score,30,35);
    
    // RETURN "GAME OVER" IF PLAYER IS OUT OF LIVES
    if(lives < 1)
    {
        textSize(100);
        textFont(fontGame);
        strokeWeight(8);
        stroke(0);
        text("GAME OVER", random(200,202), random(height/2 + 30, 320));
        textSize(27);
        noStroke();
        text("PRESS Q TO PLAY AGAIN", 340, 360);
        return;
    }
    
    // RETURN "LEVEL COMPLETE" IF THE FLAGPOLE IS REACHED
    if(flagpole.isReached)
    {
        textSize(100);
        stroke(0);
        strokeWeight(8);
        text("YOU WON!", random(width/3 - 90,width/3 - 88),random(height/2 + 30, 320));
        textSize(27);
        noStroke();
        text("PRESS Q TO PLAY AGAIN", 330, 360);
        //winSound.play();
        return;
        
    }

	// LOGIC TO MAKE GAME CHARACTER MOVE + BACKGROUND SCROLL
    
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // NEGATIVE FOR MOVING AGAINST BACKGROUND
		}
	}

	// LOGIC TO MAKE GAME CHARACTER RISE AND FALL
    
    if (gameChar_y < floorPos_y + 10)
    {    
        gameChar_y += 3;
    }
    
    else
    {
        isFalling = false;
    }
    
    

	// UPDATE REAL-TIME POSITION OF gameChar FOR COLLISION DETECTION
    
	gameChar_world_x = gameChar_x - scrollPos;
    
    if(flagpole.isReached == false)
    {
         checkFlagpole();
    }
    
    if(isDead == false)
    {
        checkPlayerDie();
    }
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    
     if (keyCode == 37)
    {
        isLeft = true;
    }
    
    else if (keyCode == 39)
    {
        isRight = true;
    }

    if (keyCode == 32 && gameChar_y >= floorPos_y + 10)
    {
        isFalling = true;
        gameChar_y = gameChar_y - 100;
        jumpSound.play();
    }
    
    if (keyCode == 81 && lives == 0)
    {
        lives = 3;
        startGame();
    }
    if (keyCode == 81 && flagpole.isReached)
    {
        lives = 3;
        startGame();
    }
    

}

function keyReleased()
{
    
     if (keyCode == 37)
    {
        console.log("left");
        isLeft = false;
    }
    
    else if (keyCode == 39)
    {
        console.log("right");
        isRight = false;
    }

}

// ------------------------------
// Game character render function
// ------------------------------

// FUNCTION: DRAW GAME CHARACTER

function drawGameChar()
{
    if(isLeft && isFalling)
	{
		// JUMPING FACING-LEFT
        
        fill(222,184,135);
        rect(gameChar_x - 10,gameChar_y - 60,20,30);
        
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 45, 3,7);
        // TORSO
        fill(178,34,34);
        rect(gameChar_x - 10,gameChar_y - 35,20,15);
        // FEET
        fill(89,39,9);
        rect(gameChar_x - 10,gameChar_y - 25,12,12);
        fill(129,69,39);
        rect(gameChar_x - 2,gameChar_y - 25,12,12);
        // ARM
        fill(139,0,0);
        rect(gameChar_x + 10,gameChar_y - 35,10,8);
        rect(gameChar_x - 15,gameChar_y - 35,5,8);
	}
    
	else if(isRight && isFalling)
	{
		// JUMPING FACING-RIGHT
        
        fill(222,184,135);
        rect(gameChar_x - 10,gameChar_y - 60,20,30);
        //EYES
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 45, 3,7);
        // TORSO
        fill(178,34,34);
        rect(gameChar_x - 10,gameChar_y - 35,20,15);
        // FEET
        fill(89,39,9);
        rect(gameChar_x - 2,gameChar_y - 25,12,12);
        fill(129,69,39);
        rect(gameChar_x - 10,gameChar_y - 25,12,12);
        // ARM
        fill(139,0,0);
        rect(gameChar_x - 20,gameChar_y - 35,10,8);
        rect(gameChar_x + 10,gameChar_y - 35,5,8);
	}
    
	else if(isLeft)
	{
		// WALKING LEFT
        
        fill(222,184,135);
        rect(gameChar_x - 10,gameChar_y - 60,20,30);
        // EYES
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 45, 3,7);
        // TORSO
        fill(178,34,34);
        rect(gameChar_x - 10,gameChar_y - 35,20,15);
        // FEET
        fill(89,39,9);
        rect(gameChar_x - 10,gameChar_y - 20,12,12);
        fill(129,69,39);
        rect(gameChar_x - 2,gameChar_y - 20,12,12);
        // ARM
        fill(139,0,0);
        rect(gameChar_x + 5,gameChar_y - 32,9,12);
        rect(gameChar_x - 12,gameChar_y - 32,3,12);
	}
    
	else if(isRight)
	{
		// WALKING RIGHT
        
        fill(222,184,135);
        rect(gameChar_x - 10,gameChar_y - 60,20,30);
        // EYES
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 45, 3,7);
        // TORSO
        fill(178,34,34);
        rect(gameChar_x - 10,gameChar_y - 35,20,15);
        // FEET
        fill(89,39,9);
        rect(gameChar_x - 2,gameChar_y - 20,12,12);
        fill(129,69,39);
        rect(gameChar_x - 10,gameChar_y - 20,12,12);
        // ARM
        fill(139,0,0);
        rect(gameChar_x - 12,gameChar_y - 32,9,12);
        rect(gameChar_x + 10,gameChar_y - 32,3,12);    
	}
    
	else if(isFalling || isPlummeting)
	{
		// JUMPING FACING-FORWARD
        
        fill(222,184,135);
        rect(gameChar_x - 15,gameChar_y - 60,30,30);
        // EYES
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 40, 3,7);
        ellipse(gameChar_x + 5, gameChar_y - 40, 3,7);
        // TORSO
        fill(178,34,34);
        rect(gameChar_x - 15,gameChar_y - 35,30,15);
        // FEET
        fill(89,39,9);
        rect(gameChar_x + 3,gameChar_y - 24,12,12);
        rect(gameChar_x - 15,gameChar_y - 24,12,12);
        // ARMS
        fill(139,0,0);
        rect(gameChar_x + 15,gameChar_y - 35,7,10);
        rect(gameChar_x - 22,gameChar_y - 35,7,10);
	}
    
	else
    {
        // FACING FORWARD
        
        fill(222,184,135);
        rect(gameChar_x - 15,gameChar_y - 60,30,30);
        // EYES
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 45, 3,7);
        ellipse(gameChar_x + 5, gameChar_y - 45, 3,7);
        // TORSO
        fill(178,34,34);
        rect(gameChar_x - 15,gameChar_y - 35,30,15);
        // FEET
        fill(89,39,9);
        rect(gameChar_x + 3,gameChar_y - 20,12,12);
        rect(gameChar_x - 15,gameChar_y - 20,12,12);
    }      

}



// ---------------------------
// Background render functions
// ---------------------------

// FUNCTION: DRAW GRID OF STARS

function drawStars()
{
      for(var i = 0; i < 5; i++)
    {
        for(var j = 0; j < 50; j++)
        {
            fill(255,100);
            ellipse(random(30,32) + j*60, 30 + i*60, 2, 10);
            ellipse(random(30,32) + j*60, 30 + i*60, 10, 2);
        }
    }
}

// FUNCTION: DRAW CLOUD OBJECTS

function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        fill(255);
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size*1.5, clouds[i].size*1.3);
        ellipse(clouds[i].x_pos - 50, clouds[i].y_pos + 10, clouds[i].size, clouds[i].size);
        ellipse(clouds[i].x_pos + 50, clouds[i].y_pos + 10, clouds[i].size, clouds[i].size);
    };
}

// FUNCTION: DRAW MOUNTAIN OBJECTS

function drawMountains()
{
    for(var i = 0; i < mountain.length; i++)
    {
        fill(40,35,45);
        triangle(mountain[i].x_pos + 100,
                 mountain[i].y_pos - 300,
                 mountain[i].x_pos,
                 mountain[i].y_pos,
                 mountain[i].x_pos + 200,
                 mountain[i].y_pos);
    };
}

// FUNCTION: DRAW TREE OBJECTS

function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(160,82,45);
        rect(trees_x[i],floorPos_y - 145,20,146);
        fill(30,99,53);
        ellipse(trees_x[i] +10,floorPos_y - 150,90,100);
        ellipse(trees_x[i] +10,floorPos_y - 200,60,100);
    };
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// FUNCTION: DRAW CANYON OBJECTS

function drawCanyon(t_canyon)
{
    fill(80,42,25);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 144);
    fill(r2,g1,205);
    rect(t_canyon.x_pos +10, floorPos_y, t_canyon.width - 20, 144);
}

// FUNCTION: CHECK IF PLAYER IS ABOVE CANYON

function checkCanyon(t_canyon)
{
    if (gameChar_world_x > t_canyon.x_pos + 10 &&
        gameChar_world_x < (t_canyon.x_pos + t_canyon.width - 10) &&
        gameChar_y >= floorPos_y + 10)
    {
        isPlummeting = true;
    }
    
    if (isPlummeting == true)
    {
        gameChar_y += 3;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// FUNCTION: DRAW COLLECTABLE COINS

function drawCollectable(t_collectable)
{
    fill(190,190,0);
    ellipse(t_collectable.x_pos,t_collectable.y_pos,
            t_collectable.size,t_collectable.size);
    fill(255,255,0);
    ellipse(t_collectable.x_pos,t_collectable.y_pos,
            t_collectable.size/1.5,t_collectable.size/1.5);
    // Sparkle
    fill(255,150);
        ellipse(t_collectable.x_pos + 8,t_collectable.y_pos - 5,5,25);
        ellipse(t_collectable.x_pos + 8,t_collectable.y_pos - 5,25,5); 
}

// FUNCTION: CHECK IF COIN HAS BEEN COLLECTED

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos) < 65)
    {
        t_collectable.isFound = true;
        game_score = game_score + 1;
        collectSound.play();
    }
    
}
    
// FUNCTION: DRAW FLAGPOLE

function renderFlagpole()
{
    push();
    
    strokeWeight(6);
    stroke(140);
    line(flagpole.x_pos, floorPos_y - 3, flagpole.x_pos, floorPos_y - 200);
    noStroke();
    fill(255,30,30);
    
    if(flagpole.isReached)
    {
         // CHECKERBOARD FLAG PATTERN AT TOP
        
         for (var i = 0;  i < 6; i++)
         {
                for (var j = 0; j < 10; j++)
                {
                        noStroke();
                        if(j % 2 == 0 && i %2 == 0)
                        {
                            fill(255);
                        }
                        else
                        {
                            fill(0)
                        }
                        if (i % 2 != 0 && j % 2 != 0)
                        {
                            fill(255);
                        }
                    rect((flagpole.x_pos - 3) + 10*j, (floorPos_y - 197) + 10*i,10,10);
                }
         }
    }
    
    else
    {
        // CHECKERBOARD FLAG PATTERN AT BOTTOM
        
        for (var i = 0;  i < 6; i++)
         {
                for (var j = 0; j < 10; j++)
                {
                        noStroke();
                        if(j % 2 == 0 && i %2 == 0)
                        {
                            fill(255);
                        }
                        else
                        {
                            fill(0)
                        }
                        if (i % 2 != 0 && j % 2 != 0)
                        {
                            fill(255);
                        }
                    rect((flagpole.x_pos - 3) + 10*j, (floorPos_y - 60) + 10*i,10,10);
                }
         }
    }
    
    pop();
}


// FUNCTION: CHECK IF PLAYER IS CLOSE ENOUGH TO THE FLAGPOLE

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 3 && isPlummeting == false)
    {
        flagpole.isReached = true;
        winSound.play();
    }
}


// FUNCTION: CHECK IF PLAYER HAS DIED

function checkPlayerDie()
{
    if(gameChar_y > height + 200)
    {
        isDead = true;
        lives = lives - 1;
        fallSound.play();
        startGame();
    }
    
    else
    {
        isDead = false;
    }
        
    if (lives == 0)
    {
        lives = 0;
        loseSound.play();
    }
    
    drawTokens();
    
}

// FUNCTION: DRAW PLAYER LIVES AS TOKENS

function drawTokens()
{
    for(var i = lives; i > 0; i--)
    {
        fill(255);
        textSize(18);
        textFont(fontGame);
        noStroke();
        text("lives : ", 30, 65);
        
        noFill();
        stroke(255);
        rect(110,43,79,28);
        
        noStroke();
        fill(0,180,0);
        rect(190-(i*25),47,20,20);
    }
    
}

// FUNCTION: RENDER ENEMIES

function Enemy(x, y, range, inc)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = inc;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -inc;
        }
        
        else if(this.currentX < this.x)
        {
            this.inc = inc;
        }   
    }
    
    this.draw = function()
    {
        // DRAW GHOST
        this.update();
        fill(0,50);
        ellipse(this.currentX, this.y + 30, 40, 15);
        fill(255);
        ellipse(this.currentX, this.y, 30, 50);
        ellipse(this.currentX - 11.5, this.y + 15, 8, 30);
        ellipse(this.currentX, this.y + 15, 13, 30);
        ellipse(this.currentX + 11.5, this.y + 15, 8, 30);
//      fill(255,25,30);
//      rect(this.currentX - 15.5, this.y, 31, 21);
        fill(0);
        ellipse(this.currentX - 5, this.y - 7, 5, 12);
        ellipse(this.currentX + 5, this.y - 7, 5, 12);
        fill(255,150);
        textFont('Helvetica');
        textStyle('bold');
        textSize(12);
        text("boo!", this.currentX - 12, this.y - 30);
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y + 15);
        
        if(d < 25)
        {
            return true;
        }
        
        return false;
    }
}

// FUNCTION: DRAW INSTRUCTIONS BUTTON

function instructButton()
{
    strokeWeight(3);
    stroke(255);
    fill(50,100,200);
    ellipse(970,43,60,60);
    noStroke(); 
    fill(255);
    textSize(25);
    text("?",961,54);
        if(dist(mouseX, mouseY, 970, 43) < 30 && lives > 0 && flagpole.isReached !== true)
    {
        instructBox();
    }

}


// FUNCTION: DRAW INSTRUCTIONS BOX

function instructBox()
{
    noStroke();
    fill(0);
    rect(330, 40, 400, 500);
    
    stroke(255);
    noFill();
    rect(340, 50, 380, 480);
    
    noStroke();
    fill(255);
    textSize(40);
    textFont(fontGame);
    text("Instructions", 367, 105);
    
    fill(255);
    rect(487,140,80,50,5);
    rect(397,200,80,50,5);
    rect(487,200,80,50,5);
    rect(577,200,80,50,5);
    rect(397,260,260,50,5);
    
    fill(0);
    textFont("Georgia");
    textSize(45);
    text("→", 595,230);
    text("←", 415, 230);
    text("↑", 514, 175);
    text("↓", 514, 235);
    textFont(fontGame);
    textSize(15);
    text("right", 593,245);
    text("left", 417, 245);
    text("Spacebar to jump", 440, 293);

    fill(255);
    textSize(20);
    text("Collect coins,",440,360);
    text("Jump over canyons,",410,390);
    text("& make it to the finish line.",365,420);
    text("You have three lives.", 395, 470);
    text("Good luck.", 465, 500);
}

// FUNCTION: START THE GAME

function startGame()
{   
    r1 = random(0,255);
    r2 = random(0,255);
    g1 = random(0,155);
    
    c1 = color(r1,g1,50);
    c2 = color(r2,g1,205);
    
    gameChar_x = width/2;
	gameChar_y = floorPos_y + 10;
    
    isDead = false;
    game_score = 0;
    
	// VAR TO CONTROL BACKGROUND SCROLLING
    
	scrollPos = 0;

	// VAR TO STORE THE REAL-TIME POSITION OF gameChar
	// world. Needed for collision detection.
    
	gameChar_world_x = gameChar_x - scrollPos;

	// BOOLEAN VARIABLES TO CONTROL MOVEMENT OF PLAYER
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// INITIALISE ARRAYS OF SCENERY OBJECTS
    
    clouds = [];
    
    for(var i = 0; i < 25; i++)
    {
        clouds.push({x_pos: 10 + i*random(200,300),
                     y_pos: 120 + i*random(10,15),
                     size: 45+(i*random(0,1))});
    }
    
    trees_x = [150,400,570,730,1100,1250,1750];
    
    mountain = [
            {x_pos: -150,y_pos: 432},
            {x_pos: 140,y_pos: 432},
            {x_pos: 400,y_pos: 432},
            {x_pos: 700,y_pos: 432},
            {x_pos: 1200,y_pos: 432},
            {x_pos: 1600,y_pos: 432},
            {x_pos: 1700,y_pos: 432}
            ];
    
    canyon = [
            {x_pos: 50, width: 100},
            {x_pos: 600, width: 100},
            {x_pos: 950, width: 100},
            {x_pos: 1500, width: 100},
            {x_pos: 2000, width: 100}
            ];

    
    collectable = [
            {x_pos: random(200,300), y_pos: random(350,400), size: 50, isFound: false},
            {x_pos: random(350,400), y_pos: (370,400), size: 50, isFound: false},
            {x_pos: 800, y_pos: 400, size: 50, isFound: false},
            {x_pos: 900, y_pos: 340, size: 50, isFound: false},
            {x_pos: 1000, y_pos: random(310,400), size: 50, isFound: false},
            {x_pos: random(1100,1150), y_pos: 340, size: 50, isFound: false},
            {x_pos: random(1200,1400), y_pos: random(310,400), size: 50, isFound: false},
            {x_pos: 1820, y_pos: 400, size: 50, isFound: false},
            {x_pos: random(1900,2000), y_pos: random(350,400), size: 50, isFound: false},
            {x_pos: random(2000,2080), y_pos: random(310,400), size: 50, isFound: false}
            ];
    
    flagpole = {x_pos: 2180, isReached: false};
    
    enemies = [];
    
    enemies.push(new Enemy(750, floorPos_y - 20, 150, 1));
    enemies.push(new Enemy(1200, floorPos_y - 20, 200, 1));
    enemies.push(new Enemy(1700, floorPos_y - 20, 200, 2));

}
