//game states
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Declaration of global variables
var player, player_running;
var ground, invisibleGround, groundImg;
 
var foodGroup, banana, bananaImage;
var obstacleGroup, obstacle, obstacleImage;
var backImage;
var score = 0;
var survivalTime = 0;
var jumpSound , checkPointSound, collidedSound;
var gameOver, restart;

function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav");
  collidedSound = loadSound("assets/sounds/collided.wav")
  
 backImg = loadImage("assets/jungle.jpg")
  player_running =            loadAnimation("assets/Monkey_01.png","assets/Monkey_02.png","assets/Monkey_03.png","assets/Monkey_04.png","assets/Monkey_05.png","assets/Monkey_06.png","assets/Monkey_07.png","assets/Monkey_08.png", "assets/Monkey_09.png", "assets/Monkey_10.png");
  
  //to load images
  bananaImage = loadImage("assets/banana.png");
  obstacleImage = loadImage("assets/stone.png")
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("restart.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  player = createSprite(50,height-70,20,50);
    
  player.addAnimation("running", player_running);
  player.setCollider('circle',0,0,350);
  player.scale = 0.15;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#00FFFF";
  invisibleGround.visible = false;
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.15;

  gameOver.visible = false;
  restart.visible = false;

  foodGroup = new Group();
  obstacleGroup = new Group();
  
  score = 0;
}

function draw() {
  background(backImg);
 //displaying score and survival Time               
 stroke("white");
 textSize(18);
 textFont("Arial Black");
 fill("white");
 text("Score : "+score,20,35);
 text("Survival Time : "+survivalTime, 450, 35);  
 
  if (gameState===PLAY){
   backImg.velocityX = -(6 + 3*score/100);
    
   //Scoring
   if(player.isTouching(foodGroup)){
   foodGroup.destroyEach();
   score=score+2;
   }
    
   //Survival time
   survivalTime = Math.ceil(frameCount/frameRate());
    
    if((touches.length > 0 || keyDown("SPACE")) && player.y  >= height-150) {
      jumpSound.play( )
      player.velocityY = -15;
      touches = [];
    }
    
    player.velocityY = player.velocityY + 0.8
  
    if (backImg.x < 0){
     backImg.x = backImg.width/2;
    }
  
    player.collide(invisibleGround);
     
    switch(score){
      case 10: player.scale = 0.18;
               break;
      case 20: player.scale = 0.20;
               break;
      case 30: player.scale = 0.22;
               break;
      case 40: player.scale = 0.24;
               break;
      default: break;
    }
    //spawn the food
    spawnFood();
    
    //spawn the obstacles on the ground
    spawnObstacles();
  
    if(obstacleGroup.isTouching(player)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    backImg.velocityX = 0;
    player.velocityY = 0;
    foodGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    foodGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  drawSprites();
}

function spawnObstacles(){
  if (frameCount % 300 === 0){
    var obstacle = createSprite(400,380,10,40);
    obstacle.velocityX = -(6 + score/100);
    
    obstacle.scale = 0.12;
    obstacle.addImage(obstacleImage)
    obstacle.lifetime = 120;
    obstacleGroup.add(obstacle);
  }
}

function spawnFood(){
  //code to spawn the foods
  if (frameCount % 80 === 0){
    var banana = createSprite(600,165,10,40);
    banana.y = Math.round(random(200, 300));
    banana.addImage(bananaImage);
    banana.scale = 0.08;
    banana.velocityX = -5;
    
    //assign lifetime to the variable
    banana.lifetime = 130;
    
    foodGroup.add(banana);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  foodGroup.destroyEach();
  player.scale = player.scale-0.02;
  survivalTime=0;
  score = 0; 
}