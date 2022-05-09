class Player {

    constructor(game, playerSettings){
        this.game = game;
        this.id = playerSettings.id;
        this.name = playerSettings.name;
        this.state = {
            hasDrawnHisZone: false
        }
    }


}