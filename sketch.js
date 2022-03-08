var player, playerImg;
var enemy,enemyImg,enemyImg2,enemyImg3,enemyImg4;
var bullet, bulletImg;
var bgImg, bgImg2, bgImg3;
var enemyGroup;
var bulletGroup; 
var playLife=3;
var score=0;
var badLife=2;
var edges;
var gameState="start"
var playButton,playButtonImg;
var resetButton, resetButtonImg;
var repair, repairImg;
var title, titleImg;
var badBullet, badBulletImg;
var shoot, enemyBoom, hit, badBulletHit, bulletHit, heal, bgSong, winSong;
var muteBtn, muteImg;



function preload(){
    playerImg=loadImage("assets/player.png")
    bulletImg=loadImage("assets/bullet.png")
    badBulletImg=loadImage("assets/bulletBill.png")

    repairImg=loadImage("assets/wrench.png")

    titleImg=loadImage("assets/Untitled.png")

    bgImg=loadImage("assets/background.jpg")
    bgImg2=loadImage("assets/background2.jpg")
    bgImg3=loadImage("assets/winScreen.jpg")

    playButtonImg=loadImage("assets/playbutton.png")
    resetButtonImg=loadImage("assets/restart.png")

    enemyImg=loadImage("assets/enemy.png")
    enemyImg2=loadImage("assets/enemy2.png")
    enemyImg3=loadImage("assets/enemy3.png")
    enemyImg4=loadImage("assets/enemy4.png")

    shoot=loadSound("assets/shot.mp3")
    enemyBoom=loadSound("assets/boom.mp3")
    hit=loadSound("assets/hit.mp3")
    badBulletHit=loadSound("assets/hit2.mp3")
    bulletHit=loadSound("assets/oof.mp3")
    heal=loadSound("assets/heal.mp3")
    bgSong=loadSound("assets/coolmusic.mp3")
    winSong=loadSound("assets/win.mp3")

    muteImg=loadAnimation("assets/mute.png")
}

function setup(){
    createCanvas(windowWidth,windowHeight)
    player=createSprite(100,300,20,20)
    player.addImage(playerImg)
    player.scale=0.2

    playButton=createSprite(width/2,height/2+150)
    playButton.addImage(playButtonImg)

    resetButton=createSprite(width/2,height/2-30)
    resetButton.addImage(resetButtonImg)
    resetButton.scale=1.75

    title=createSprite(width/2+50,height/2-100)
    title.addImage(titleImg)
    title.scale=1.4

    edges=createEdgeSprites()

    bulletGroup=new Group()
    enemyGroup=new Group()
    badBulletGroup=new Group()
    repairGroup=new Group()

    bgSong.play()
    bgSong.looping=true
    bgSong.setVolume(0.3)

    muteBtn=createImg("assets/mute.png")
    muteBtn.position(width-200,50);
    muteBtn.size(100,100);
    muteBtn.mouseClicked(muteSong);

    // if(gameState==="win"){
    //     bgSong.stop()
    //     winSong.play()
    // }
}



function draw(){
    if(gameState==="start"){
        background("black")
        player.visible=false
        playButton.visible=true
        title.visible=true
        resetButton.visible=false
        if(mousePressedOver(playButton)){
            gameState="play"
        }

        fill("yellow")
        textSize(30)
        text("Controls:",width/20,height/2-110)
        textSize(25)
        text("Use WASD to move around",width/20,height/2-70)
        text("Press T to shoot",width/20,height/2-40)

        fill("green")
        textSize(30)
        text("What you need to know:", width/20, height/2+50)
        textSize(20)
        text("Bullets can bounce back and hit you", width/20, height/2+80)
        text("Enemy Bullets are not the same as yours",width/20, height/2+110)
        text("Wrenches can help increase your HP", width/20, height/2+140)

        fill("blue")
        textSize(40)
        text("Tips:",width/2+450,height/2-30)
        textSize(30)
        text("Just spam the bullets",width/2+450,height/2+10)

        fill("red")
        textSize(20)
        text("Win Condition is to get your score above 50", width/2+300,height/2+200)
    }

    if(gameState==="play"){
        background(bgImg)

        player.visible=true
        playButton.visible=false
        resetButton.visible=false
        title.visible=false

        addEnemies()
        addRepair()
        if(score>4){
            addBadBullet()
        }
      
        player.bounceOff(edges);
    
        enemyGroup.bounceOff(edges[3]);
        enemyGroup.bounceOff(edges[2]);
        enemyGroup.bounceOff(edges[1]);
    
        bulletGroup.bounceOff(edges[1])
    
        playerControl()
    
        //bulletgroup[]   enemygroup[]
        
        for(var a=0; a<bulletGroup.length; a++){
            for(var i=0; i<enemyGroup.length; i++){
                if(bulletGroup[a].isTouching(enemyGroup[i])){
                    bulletGroup[a].remove();
                    enemyGroup[i].remove();
                    score=score+1;
                    enemyBoom.play()
                }
            }
        } 
        
        for(var a=0; a<bulletGroup.length; a++){
            if(bulletGroup[a].isTouching(player)){
                bulletGroup[a].remove()
                playLife=playLife-1
                bulletHit.play()
             
            }
        } 

        for(var a=0; a<badBulletGroup.length; a++){
            if(badBulletGroup[a].isTouching(player)){
                badBulletGroup[a].remove()
                playLife=playLife-1
                badBulletHit.play()
            }
        } 
    
        for(var x=0;x<enemyGroup.length;x++){
            if(enemyGroup[x].isTouching(player)){
                enemyGroup[x].remove()
                playLife=playLife-1
                hit.play()
            }
        }   

        
        for(var x=0;x<repairGroup.length;x++){
            if(repairGroup[x].isTouching(player)){
                repairGroup[x].remove()
                playLife=playLife+1
                heal.play()
            }
        }   
        
        if(playLife<1){
            gameState="end"
        }

        if(score>49){
            gameState="win"
        }
        
        fill("yellow")
        textSize(25)
        text("HP: "+playLife,25,50)
        fill("red")
        textSize(25)
        text("Score:  "+score,25,75)
    }

    if(gameState==="end"){
        background(bgImg2)
        fill("yellow")
        textSize(55)
        text("You died.",width/2-105,height/2+100)
        fill("red")
        textSize(30)
        text("Press the button to try again",width/2-180,height/2-125)

        player.visible=false
        playButton.visible=false
        resetButton.visible=true
        title.visible=false

        enemyGroup.destroyEach()
        bulletGroup.destroyEach()
        badBulletGroup.destroyEach()
        repairGroup.destroyEach()

        bgSong.stop()

        if(mousePressedOver(resetButton)){
            reset()
        }
    }

    if(gameState==="win"){
        background(bgImg3)
        fill("blue")
        textSize(30)
        text("You won and got the CASH PRIZE!!",width/2-230,height/2-165)
        fill("green")
        textSize(30)
        text("Do you want to try again and get more?",width/2-250,height/2-125)
        fill("black")
        textSize(40)
        text("Replay the game",width/2-160,height/2+75)

        player.visible=false
        playButton.visible=false
        resetButton.visible=true
        title.visible=false

        enemyGroup.destroyEach()
        bulletGroup.destroyEach()
        badBulletGroup.destroyEach()
        repairGroup.destroyEach()

        if(mousePressedOver(resetButton)){
            reset()
        }
    }
    drawSprites()
}



function addEnemies(){
    if(frameCount%45===0){
        enemy=createSprite(width+10,random(50,height-50),20,20)
        //enemy.debug=true;
        enemy.setCollider("circle",0,0,80)
        enemy.addImage(enemyImg)
        enemy.scale=0.3
        enemyGroup.add(enemy)
        enemy.velocity.x=-(score/10+7)
        enemy.velocity.y=random(-5,5);
       

        //randomizing whole numbers
        var r=Math.round(random(1,4))

        //add different images to the numbers
        switch(r){
            case 1: enemy.addImage(enemyImg)
            break;
            case 2: enemy.addImage(enemyImg2)
            enemy.setCollider("circle",0,0,150)
            enemy.scale=0.15
            break;
            case 3: enemy.addImage(enemyImg3)
            enemy.scale=0.6
            break;
            case 4: enemy.addImage(enemyImg4)
            enemy.scale=0.2
            enemy.setCollider("circle",0,0,200)
            break;
            default: break
        }
    }  
}

function addBadBullet(){
    if(frameCount%55===0){
        badBullet=createSprite(width+10,random(25,height-25))
        badBullet.addImage(badBulletImg)
        badBullet.scale=0.2
        badBulletGroup.add(badBullet)
        badBullet.velocity.x=score/-10-20
    }
}

function addRepair(){
    if(frameCount%200===0){
        repair=createSprite(width+10,random(25,height-25))
        repair.addImage(repairImg)
        repair.scale=0.1
        repairGroup.add(repair)
        repair.velocity.x=score/-10-2.5
    }
}



function playerControl(){
    if(keyDown("w")){
        player.position.y-=5
    }
    if(keyDown("s")){
        player.position.y+=5
    }
    if(keyDown("a")){
        player.position.x-=5
    }
    if(keyDown("d")){
        player.position.x+=5
    }
    if(keyWentDown("t")){
        bullet=createSprite(player.x+60,player.y,20,20)
        bullet.addImage(bulletImg)
        //bullet.debug=true;
        bullet.scale=0.03
        bulletGroup.add(bullet)
        shoot.play()
        bullet.velocity.x=score/10+20
        bullet.lifetime=400
    }
}

function reset(){
    player.x=100
    player.y=300
    enemyGroup.destroyEach()
    bulletGroup.destroyEach()
    playLife=3
    score=0
    gameState="start"
}

function muteSong()
{
  if(bgSong.isPlaying()){
      bgSong.stop();
  }
  else{
      bgSong.play()
  } 
}



