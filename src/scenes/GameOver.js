export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data){
        this.score = data["score"]
    }

    create() {
        this.add.text(400, 100, "Game Over!", {fontFamily:"Digi Lalezar Plus", fontSize:50, fill:"#000"}).setOrigin(0.5);
        this.add.text(400, 180, 'Score: '+this.score , {fontFamily:"Digi Lalezar Plus", fontSize:20, fill:"#000"}).setOrigin(0.5);
        const button = this.add.image(400, 300, "gameover-button").setInteractive();

        button.on('pointerdown', () => {
            this.scene.start('Game')
        })
    }
}
