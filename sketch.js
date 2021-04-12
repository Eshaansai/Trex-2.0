var PLAY = 1;
var END = 0;
var gameState = PLAY;
var backgroundImage;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var barsGroup,barImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var edges;
var coinsGroup,coinImage,coin;
var score=0,coinsScore=0;
var bar,coin
var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("Images/trex1-removebg-preview.png","Images/trex3-removebg-preview.png","Images/trex4-removebg-preview.png");
  trex_collided = loadAnimation("Images/trex_collided-removebg-preview.png");
  
  groundImage = loadImage("Images/ground2.png");
  cloudImage = loadImage("Images/cloud.png");
  
  obstacle1 = loadImage("Images/obstacle1.png");
  obstacle2 = loadImage("Images/obstacle2.png");
  obstacle3 = loadImage("Images/obstacle3.png");
  obstacle4 = loadImage("Images/obstacle4.png");
  obstacle5 = loadImage("Images/obstacle5.png");
  obstacle6 = loadImage("Images/obstacle6.png");
  
  gameOverImg = loadImage("Images/gameOver.png");
  restartImg = loadImage("Images/restart.png");
  backgroundImage=loadImage("Images/bg1.jpg");
  barImage =loadImage("Images/bar.png");
  coinImage=loadImage("Images/coin.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  edges=createEdgeSprites();
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,80);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.1;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  barsGroup=new Group();
  coinsGroup=new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImage);
  text("Score: "+ score, 500,50);
  text("Coins: "+ coinsScore,500,60);
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    
    
  
    if(keyDown("space")&& trex.y>9) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnbar();  
    trex.collide(edges);
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }

    if(barsGroup.isTouching(trex)){
      trex.velocityY=0;
      if(keyDown("space")) {
        trex.velocityY = -12;
      }
    }

    if(trex.isTouching(coinsGroup)){
      coinsScore++;
      coinsGroup.destroyEach();
    }

    
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velocity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    barsGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    barsGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(50,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}
function spawnbar() {
  //write code here to spawn the bars
  if(frameCount % 60 === 0){
     bar = createSprite(700,150,60,30);
    bar.y = Math.round(random(80,120));
    bar.addImage(barImage);
    bar.scale = 0.1;
    bar.velocityX= -4;

    //assign lifetime to the variable
    bar.lifetime=300;

    //adjust the depth
    bar.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each bar to the group
    barsGroup.add(bar);

    coin =createSprite(705,140,60,30);
    coin.y = bar.y-20
    coin.addImage(coinImage);
    coin.scale=0.06;
    coin.velocityX=-4;

    //assign lifetime to the variable
    coin.lifetime=300;

    
    //adjust the depth
    coin.depth = trex.depth;
    trex.depth = trex.depth + 1;

 

    //add each coin to the group
    coinsGroup.add(coin);

  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  barsGroup.destroyEach();
  coinsGroup.destroyEach(); 
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  coinsScore=0;
  
}