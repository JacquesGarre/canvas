class Map {

    constructor(settings, screen)
    {
        this.screen = screen
        this.settings = settings;
        this.width = this.getWidth();
        this.heigth = this.getHeight();
        this.xOffset = this.getXOffset();
        this.yOffset = this.getYOffset();
        this.tiles = [];
        this.settings.map.displayFog = false;
    }

    // Returns map x offset from left border of the screen (in pixels)
    getXOffset()
    {
        return (this.settings.screen.width-this.width)/2
    }

    // Returns map y offset from top border of the screen (in pixels)
    getYOffset()
    {
        return (this.settings.screen.height-this.height)/2
    }

    // Returns width of the map (in pixels)
    getWidth()
    {
        return this.settings.map.x * this.settings.tile.width;
    }

    // Returns height of the map (in pixels)
    getHeight()
    {
        return this.settings.map.y * this.settings.tile.height;
    }

    // Draws the map on canvas
    draw()
    {
        // Debug mode : fill background as white
        if(this.settings.debug){
            this.screen.fillStyle = this.settings.map.debug.backgroundColor;
            this.screen.strokeStyle = this.settings.map.debug.borderColor;
        }
    
        this.screen.fillRect(
            this.xOffset, 
            this.yOffset,
            this.width,
            this.height
        )

        // Draw tiles
        this.drawFloorTiles();

    }

    drawFloorTiles()
    {   
        
        state.currentPlayer = state.players[state.currentPlayerID];
        if(state.players[state.currentPlayerID].tiles == undefined || state.players[state.currentPlayerID].tiles.length == 0){
            state.players[state.currentPlayerID].tiles = [];
            for(var x = 0; x <= this.settings.map.x - 1; x++){
                state.players[state.currentPlayerID].tiles[x] = [];
                for(var y = 0; y <= this.settings.map.y - 1; y++){
                    var tileID = x + y; 
                    var tile = new Tile(tileID, this.settings, {
                        type: 'floor',
                        position: {
                            x: x,
                            y: y
                        },
                    }, this.screen);
                    tile.draw();
                    this.tiles.push(tile);
                    state.players[state.currentPlayerID].tiles[x][y] = tile;      
                }
            }
        } else {
            for(var x = 0; x <= this.settings.map.x - 1; x++){
                for(var y = 0; y <= this.settings.map.y - 1; y++){
                    if(state.currentPlayer.tiles[x] !== undefined && state.currentPlayer.tiles[x][y] !== undefined){
                        state.currentPlayer.tiles[x][y].draw()
                    }
                }
            }
        }


    }

    drawPathsForCharacters()
    {
        if(state.keydown){
            
            state.keydown = false;

            state.players[state.currentPlayerID].drawingPathDone = true;

            state.drawingPath.done = true;
            for(const player of state.players){
                if(!player.drawingPathDone){
                    state.drawingPath.done = false;
                }
            }

            // Go to next player
            state.currentPlayerID = (state.currentPlayerID+1) % state.players.length

            // if players have not finished drawing paths for their characters,
            if(!state.drawingPath.done){

                // Step 8 will show instructions for next player to draw his paths
                state.currentStep = 8;

            // else switch player and go to next step
            } else {
    
                // Step 10 will animate
                state.currentStep = 10;
    
            }
        }


        var hoverPixelX = Math.floor(state.mousePosition.x);
        var hoverPixelY = Math.floor(state.mousePosition.y);
        var hoverTileX = ~~(hoverPixelX/this.settings.tile.width);
        var hoverTileY = ~~(hoverPixelY/this.settings.tile.height);

        // Hover effect on mouesover
        var characterHovered = false;
        var charactersPlaced = state.currentPlayer.characters.filter(character => {
            return character.placed == true;
        })
        for(const characterPlaced of charactersPlaced){
            characterPlaced.hovered = false;
            if(characterPlaced.x == hoverTileX && characterPlaced.y == hoverTileY){
                characterHovered = characterPlaced;
                break;
            }
        }

        // If character is hovered, make him possible to be selected, and draw selected/hover effect
        if(characterHovered){
            // draw rectangle around
            characterHovered.hovered = true;
            // if clicked
            if(state.mouseClicked){
                for(const characterPlaced of charactersPlaced){
                    characterPlaced.selected = false;
                }
                characterHovered.selected = !characterHovered.selected;
                state.mouseClicked = false;
            }
            //characterHovered.draw();
        }

        // Draw possible paths around selected character
        var characterSelected = false;
        for(const characterPlaced of charactersPlaced){
            if(characterPlaced.selected){
                characterSelected = characterPlaced;
                state.players[state.currentPlayerID].tiles[characterSelected.x][characterSelected.y].selected = true;
                break;
            }
        }

        if(characterSelected && characterSelected.energy > 0){
            var tilesAround = characterSelected.getTilesAround()
            for (var tileKey of Object.keys(tilesAround)) {
                var tile = tilesAround[tileKey];
                if(tile && (tile.type == 'zone' || tile.type == 'door' || tile.type == 'floor')){
                    tile.drawAsPossibleMove();

                    // if clicked
                    if(tile.isClicked() && characterSelected.energy > 0){
                        characterSelected.energy--;
                        characterSelected.path.push(tile);
                        state.mouseClicked = false;
                        tile.walkable = false;
                        tile.selected = true;
                    }

                }
            }
        }

        state.currentPlayer.characterSelected = characterSelected;


    }

    drawCharacters()
    {   
        var hoverPixelX = Math.floor(state.mousePosition.x);
        var hoverPixelY = Math.floor(state.mousePosition.y);
        var hoverTileX = ~~(hoverPixelX/this.settings.tile.width);
        var hoverTileY = ~~(hoverPixelY/this.settings.tile.height);


        var charactersNotPlaced = state.currentPlayer.characters.filter(character => {
            return character.placed == false;
        })
        var charactersPlaced = state.currentPlayer.characters.filter(character => {
            return character.placed == true;
        })

        for(const characterPlaced of charactersPlaced){
            characterPlaced.draw()
        }

        // Test if all players have placed their characters
        if(!state.charactersPlacing.done && state.currentStep < 6){

            state.charactersPlacing.done = true;
            for(var i = 0; i <= state.players.length - 1; i++){
                var playerCharactersPlaced = state.players[i].characters.filter(character => {
                    return character.placed == true;
                });
                if(playerCharactersPlaced.length !== state.players[i].characters.length){
                    state.charactersPlacing.done = false;
                }
            }        

            // If hover zone, draw character
            if(state.currentPlayer.tiles[hoverTileX] !== undefined 
                && state.currentPlayer.tiles[hoverTileX][hoverTileY] !== undefined
                && state.currentPlayer.tiles[hoverTileX][hoverTileY].type == 'zone'
            ){
                if(charactersNotPlaced.length){

                    // Draw char as hover
                    var characterToPlace = charactersNotPlaced[0];
                    characterToPlace.x = hoverTileX;
                    characterToPlace.y = hoverTileY;
                    characterToPlace.draw()

                    // Can place it on ly if not characters present already
                    if(state.mouseClicked){
                        var canBePlacedHere = true;
                        for(const characterPlaced of charactersPlaced){
                            if(characterPlaced.x == characterToPlace.x && characterPlaced.y == characterToPlace.y){
                                canBePlacedHere = false;
                                break;
                            }
                        }
                        if(canBePlacedHere){
                            characterToPlace.placed = true;
                            characterToPlace.owner = state.currentPlayerID;
                            state.mouseClicked = false;
                        }
                    }
                }
            }

            // If current player hasnt got any character to place, go to next player
            if(charactersNotPlaced.length == 0){

                // Go to next player
                state.currentPlayerID = (state.currentPlayerID+1) % state.players.length

                // if players have not finished placing their characters,
                if(!state.charactersPlacing.done){
                    // Step 4 will show instructions for next player
                    state.currentStep = 4;

                // else switch player and go to next step
                } else {
        
                    // Step 6 will show instructions for next player to place his doors
                    state.currentStep = 6;
        
                }
            }
        }      


    }

    drawDoors()
    {   
        var hoverPixelX = Math.floor(state.mousePosition.x);
        var hoverPixelY = Math.floor(state.mousePosition.y);
        var hoverTileX = ~~(hoverPixelX/this.settings.tile.width);
        var hoverTileY = ~~(hoverPixelY/this.settings.tile.height);

        // Test if all players have placed their doors
        if(!state.doorsPlacing.done){

            // If hover wall top, wall right, wall left, wall bottom, draw door
            var wallsAllowedToDrawDoor = ['wall_top', 'wall_right', 'wall_left', 'wall_bottom'];
            if(state.currentPlayer.tiles[hoverTileX] !== undefined 
                && state.currentPlayer.tiles[hoverTileX][hoverTileY] !== undefined
                && wallsAllowedToDrawDoor.includes(state.currentPlayer.tiles[hoverTileX][hoverTileY].spriteType)
            ){

                var tileHovered = state.currentPlayer.tiles[hoverTileX][hoverTileY];
                if(state.currentPlayer.doorTilesLeft > 0){

                    var sprite = 'door_' + tileHovered.spriteType.split('_')[1];

                    // Draw door as hover
                    tileHovered.drawSprite(sprite)

                    // Changing definitively the sprite type to door
                    if(state.mouseClicked){      
                        tileHovered.spriteType = sprite;
                        tileHovered.type = 'door';
                        tileHovered.health = this.settings.doors.health;
                        tileHovered.owner = state.currentPlayerID;
                        state.currentPlayer.doorTilesLeft--;
                        state.mouseClicked = false;
                    }
                }
            }

            // If current player hasnt got any more door to place, go to next player
            if(state.currentPlayer.doorTilesLeft == 0){

                // Go to next player
                state.currentPlayerID = (state.currentPlayerID+1) % state.players.length

                // Test if all players finished placing their doors
                state.doorsPlacing.done = true;
                for(var i = 0; i <= state.players.length - 1; i++){
                    if(state.players[i].doorTilesLeft > 0){
                        state.doorsPlacing.done = false;
                        break;
                    }
                }        

                // if players have not finished placing their characters,
                if(!state.doorsPlacing.done){

                    // Step 6 will show instructions for next player to place his doors
                    state.currentStep = 6;

                // else switch player and go to next step
                } else {
        
                    // Step 8 will show instructions for next player to start to move his characters
                    state.currentStep = 8;
        
                }
            }
        }      


    }

    resetSelectedTiles(){
        for(var x = 0; x <= this.settings.map.x - 1; x++){
            for(var y = 0; y <= this.settings.map.y - 1; y++){
                if(state.currentPlayer.tiles[x] !== undefined && state.currentPlayer.tiles[x][y] !== undefined){
                    state.currentPlayer.tiles[x][y].selected = false;
                    state.currentPlayer.tiles[x][y].walkable = false;
                }
            }
        }
    }

    resetCharacterState(){
        for(const char of state.currentPlayer.characters){
            char.hovered = false;
            char.selected = false;
            char.animation = 'idle';
            char.direction = 'down';
            char.selected = false;
            char.energy = char.maxEnergy;
        }
    }

    animateCharacters(){

        state.animateCharacters.done = true;
        for(var i = 0; i <= state.players.length - 1; i++){
            for(const char of state.players[i].characters){
                if(char.path.length){
                    state.animateCharacters.done = false;
                    break;
                }
            }
        }      

        var canWalk = false;
        for(const char of state.currentPlayer.characters){
            if(char.path.length){
                canWalk = true;
                char.walkPath()
            }
        }
        if(!canWalk){

            // Go to next player
            state.currentPlayerID = (state.currentPlayerID+1) % state.players.length

            // if animations are not finished,
            if(!state.animateCharacters.done){

                // Step 10 will show instructions for next player that chars are moving
                state.currentStep = 10;

            // else switch player and go to next step
            } else {
    
                // Step 8 will show instructions for next player to draw his path, and move again
                state.currentStep = 8;
    
            }

        }

    }

}