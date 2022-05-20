class Player {

    constructor(gameSettings, playerSettings, gameScreen, map){
        this.map = map;
        this.gameSettings = gameSettings;
        this.gameScreen = gameScreen;
        this.id = playerSettings.id;   // game.settings
        this.name = playerSettings.name;
        this.color = playerSettings.color;
        this.zoneTilesLeft = this.gameSettings.playerStartWith.floorTilesCount;
        this.doorTilesLeft = this.gameSettings.playerStartWith.doorTilesCount;
        this.tiles = [];
        this.characters = this.initCharacters(playerSettings.characters);
        this.territory = false;
        this.characterSelected = false;
        this.drawingPathDone = false;
    }

    initCharacters(characters){
        var chars = [];
        for (const characterSettings of characters) {
            var character = new Character(this.gameSettings, characterSettings, this.gameScreen);
            chars.push(character)
        }
        return chars;
    }

    setTerritory()
    {
        this.territory = new Territory(this.id, this.gameSettings, this.gameScreen, this.map)
    }

    drawTerritory(){
        this.territory.draw()
    }

}