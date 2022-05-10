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
            var tileID = 0;
            for(var x = 0; x <= this.settings.map.x - 1; x++){
                state.players[state.currentPlayerID].tiles[x] = [];
                for(var y = 0; y <= this.settings.map.y - 1; y++){
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
                    tileID++;            
                }
            }
        } else {
            for(var x = 0; x <= state.currentPlayer.tiles.length - 1; x++){
                for(var y = 0; y <= state.currentPlayer.tiles[x].length - 1; y++){
                    state.currentPlayer.tiles[x][y].draw()
                }
            }
        }


        
    }

}