class Player {

    constructor(game, playerSettings){
        this.game = game;
        this.id = playerSettings.id;
        this.name = playerSettings.name;
        this.zoneTilesLeft = game.settings.playerStartWith.floorTilesCount
        this.tiles = [];
    }


}