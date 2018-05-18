/* Inicializamos una variable llamda juego y despues en los argumentos declaramos: ANCHO, ALTO, COMPILADOR DEL JUEGO O RENDER Y  */
//var game = new Phaser.Game(800,400,Phaser.AUTO,'block_game');
var backgroundgame;
var ship;
var cursors;
var bullets;
var bullet_time = 0;
var button_shot;
var bullet;
var enemies;

var game = new Phaser.Game(370,550,Phaser.Canvas,'block_game');

var StateMain = {
    /* Carga todos los recursos */
    preload: function () {
        //Cargamos la imagen el primer parametro es el nombre que le asignaremos y el segundo la ruta de donde estamos llamando a la imagen
        game.load.image('background','images/space.png');
        game.load.image('ship-space','images/ship.png');
        game.load.image('laser','images/laser.png');
        game.load.image('enemy','images/ememy_invaders.png');
    },
    /* Mostramos en pantalla */
    create: function () {
        // Mostramos en pantalla la imagen en la posicion (x1,y1) = (0,0) (x2,y2)=(370,550)
        backgroundgame = game.add.tileSprite(0,0,370,550,'background');
        ship = game.add.sprite(game.width/2,500,'ship-space');
        ship.anchor.setTo(0.5);
        ship.scale.setTo(0.5);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(ship);
        ship.body.collideWorldBounds = true;
        cursors = game.input.keyboard.createCursorKeys();
        button_shot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // Creamos un grupo de balas
        bullets = game.add.group();
        // Decimos que las balas tengan un ccuerpo
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        // Creamos la cantidad de balas que disparara la nave
        bullets.createMultiple(20,'laser');
        bullets.setAll('anchor.x',0.5);
        bullets.setAll('anchor.y',1);
        bullets.setAll('outOfBoundsKill',true);
        bullets.setAll('checkWorldBounds',true);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        // Crear enemigos y mostrarlos en pantalla
        for(var y = 0; y < 6; y++){
            for(var x = 0; x < 7; x++){
                var enemy = enemies.create(x*40,y*20,'enemy');
                enemy.anchor.setTo(0.5);
            }
        }
        enemies.x = 50;
        enemies.y = 30;
        var animation = game.add.tween(enemies).to({x:100}, 1000, Phaser.Easing.Linear.None,true,0,1000,true);
        //animation.onLoop.add(descend,this);
        animation.onRepeat.add(descend,this);
    },
    /* Animamos el juego*/
    update: function () {
        backgroundgame.tilePosition.y += 1 ;
        if(cursors.right.isDown){
            ship.position.x += 3;
        }
        else if(cursors.left.isDown){
            ship.position.x -= 3;
        }
        if(button_shot.isDown){
            if(game.time.now > bullet_time){
                bullet = bullets.getFirstExists(false);
            }
            if(bullet){
                bullet.reset(ship.x,ship.y);
                bullet.body.velocity.y = -300;
                bullet_time = game.time.now + 100;
            }
        }
        game.physics.arcade.overlap(bullets,enemies,collision,null,this);
    }
};
function collision(bullet,enemy) {
    bullet.kill();
    enemy.kill();
}
function descend() {
    enemies.y +=10;
}
game.state.add('main',StateMain);
game.state.start('main');