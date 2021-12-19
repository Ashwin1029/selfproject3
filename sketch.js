/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/sonic1.png","assets/sonic2.png","assets/sonic3.png");
  kangaroo_collided = loadAnimation("assets/sonic4.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/coin.png");
  shrub2 = loadImage("assets/coin.png");
  shrub3 = loadImage("assets/coin.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  mosquitoImg = loadImage("assets/mosquito.png");
  fireballImg = loadImage("assets/fireball.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  //jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(50,displayHeight-60,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  //kangaroo.scale = 0.15;
  kangaroo.setCollider("circle",0,0,100)
    kangaroo.debug=false
  invisibleGround = createSprite(400,displayHeight-50,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(displayWidth/2,displayHeight/2-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,displayHeight/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.75;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  mosquitoGroup= new Group()
  score = 0;

}

function draw() {
  background(255);
  
  kangaroo.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-5

    if(jungle.x<100)
    {
       jungle.x=400
    }
   //console.log(kangaroo.y)
    if(keyDown("space")&& kangaroo.y>700) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.6

if(keyDown(UP_ARROW)&&kangaroo.y>displayHeight-400){

  var fireball = createSprite(camera.position.x+100,displayHeight-100,40,10);
  //fireball.velocityY = -3
  fireball.addImage(fireballImg);
  fireball.y=mosquitoGroup.y
  fireball.lifetime = 100;
fireball.scale = 0.7;


}

if(keyDown(RIGHT_ARROW)&&kangaroo.y>displayHeight-400){

  var fireball = createSprite(camera.position.x+100,displayHeight-100,40,10);
  //fireball.velocityX = 3
  fireball.addImage(fireballImg);
  fireball.y=mosquitoGroup.y
  fireball.lifetime = 100;
fireball.scale = 0.7;


}




    spawnShrubs();
    spawnObstacles();
spawnMosquitos()
destroy()
    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){
      score = score + 10;
      shrubsGroup.destroyEach();
      jungle.velocityX=-7
    }

  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    //change the trex animation
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    //set velcity of each game object to 0
    jungle.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    
    //change the kangaroo animation
    kangaroo.changeAnimation("collided",kangaroo_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  }
  

  drawSprites();

  textSize(50);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x+500,70);
  
  if(score >=100){
    kangaroo.visible = false;
    textSize(50);
    stroke(3);
    fill("black");
    text("congratulations!! You win the game!! ", displayWidth/2-300,displayHeight/2);
    gameState = WIN;
  }

   

}

function spawnShrubs() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {

    var shrub = createSprite(camera.position.x+500,displayHeight-70,40,10);

    shrub.velocityX = -(10 + 3*score/100)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the shrub           
    shrub.scale = 0.25;
     //assign lifetime to the variable
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    //add each cloud to the group
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+300,displayHeight-70,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(10 + 3*score/100)
    obstacle.scale = 0.35;
    //assign scale and lifetime to the obstacle           

    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
  }
}

function spawnMosquitos(){
if(frameCount % 180 === 0){

  var mosquito = createSprite(camera.position.x+400,displayHeight-400,40,40);
  //mosquito.setcollider()
  mosquito.addImage(mosquitoImg);
  mosquito.velocityX=-(5+3*score/100);
  mosquito.scale=0.5;
  mosquito.lifetime = 400;

mosquitoGroup.add(mosquito);
}

}

function destroy(){
if (mosquitoGroup.isTouching(kangaroo))
{mosquitoGroup.destroyEach()}

}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  kangaroo.visible = true;
  kangaroo.changeAnimation("running", kangaroo_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  score = 0;
}
