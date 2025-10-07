import {Player} from '../gameObjects/Player.js'

export class Game extends Phaser.Scene {
    constructor(){
        super('Game');
    }

    create(){
        this.add.image(400, 300, 'sky');

        this.platform = this.physics.add.staticGroup();

        this.platform.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platform.create(600, 400, 'ground');
        this.platform.create(50, 250, 'ground');
        this.platform.create(750, 220, 'ground');

        this.player = new Player(this, 100, 450);

        this.physics.add.collider(this.player, this.platform);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70}
        });

        this.stars.children.iterate(child => {
            child.setBounce(1);
            child.setCollideWorldBounds();
            child.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-100, 100));
        });

        this.physics.add.collider(this.stars, this.platform);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)

        this.score = 0
        this.scoreText = this.add.text(19, 19, 'Score: 0', { fontSize: '32px', fill: '#000' });
        
        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platform);
        this.physics.add.collider(this.bombs, this.bombs);
        this.physics.add.collider(this.bombs, this.stars);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this)
    }

    update(){
        if (this.cursors.left.isDown){
            this.player.moveLeft();
        }
        else if (this.cursors.right.isDown){
            this.player.moveRight();
        }
        else {
            this.player.idle();
        }
        if (this.cursors.up.isDown){
            this.player.jump();
        }
    }

    collectStar(player, star){
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0){
            this.stars.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
                child.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-100, 100))
            });
        }
        if ((this.score + 30) % 40 === 0){
            this.releaseBomb();
        }
    }

    hitBomb(player, bomb){
        this.physics.pause();
      
        player.setTint(0xff0000);

        player.anims.play('turn')

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver', {score: this.score});
        })
    }

    releaseBomb(){
        let x = (this.player.x < 400) ? Phaser.Math.Between(400, 800): Phaser.Math.Between(0, 400);

        let bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}
