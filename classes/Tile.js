class Tile {

    constructor(tileID, gameSettings, tileSettings, screen) {
        this.id = tileID;
        this.settings = gameSettings;
        this.type = tileSettings.type;
        this.screen = screen;
        this.width = this.getWidth();
        this.height = this.getHeight();
        this.x = tileSettings.position.x;
        this.y = tileSettings.position.y;
        this.spriteType = this.getSpriteType();
        this.position = {
            x: this.x * this.width,
            y: this.y * this.height,
            w: this.width,
            h: this.height
        }
        this.assets = [];
    }

    isHovered()
    {
        var isHovered = this.position.x < state.mousePosition.x &&
            (this.position.x + this.position.w) >= state.mousePosition.x &&
            this.position.y < state.mousePosition.y &&
            (this.position.y + this.position.h) >= state.mousePosition.y;
        return isHovered;
    }

    isClicked()
    {
        var isClicked = state.mouseClicked !== false && this.position.x < state.mouseClicked.x &&
            (this.position.x + this.position.w) >= state.mouseClicked.x &&
            this.position.y < state.mouseClicked.y &&
            (this.position.y + this.position.h) >= state.mouseClicked.y;
        return isClicked;
    }

    draw() {

        this.screen.rect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        // Debug mode : draw borders
        if (this.settings.debug) {
            this.screen.strokeStyle = this.settings.tile.debug.borderColor;
            this.screen.stroke()
        }


        // Click acts differently for each step
        switch(state.currentStep){

            // STEP 3 : DRAWING ZONE = A click will draw a tile and lower the zoneTilesLeft property
            case 3:
                this.drawingZone()
            break;
            case 5:
                this.drawWallsAroundZone();
            break;


            default:
                this.drawSprite();


        }
        

    }

    // Returns tile width
    getWidth() {
        return this.settings.tile.width;
    }

    // Returns tile heigth
    getHeight() {
        return this.settings.tile.height;
    }

    // Draws sprite
    drawSprite(spriteType = false) {
        this.sprite = !spriteType ? this.settings.tileSprites[this.spriteType] : this.settings.tileSprites[spriteType];
        this.screen.drawImage(
            this.sprite, 
            this.x * this.width, 
            this.y * this.height
        )
    }

    // Return sprite type (top, left, right, bottom, top-left, etc...)
    getSpriteType() {
        if (this.isTopTile() && this.isLeftTile()) {
            return 'topLeft';
        } else if (this.isTopTile() && this.isRightTile()) {
            return 'topRight';
        } else if (this.isBottomTile() && this.isRightTile()) {
            return 'bottomRight';
        } else if (this.isBottomTile() && this.isLeftTile()) {
            return 'bottomLeft';
        } else if (this.isLeftTile()) {
            return this.y % 2 == 0 ? 'leftEven' : 'leftOdd';
        } else if (this.isTopTile()) {
            return this.x % 2 == 0 ? 'topEven' : 'topOdd';
        } else if (this.isRightTile()) {
            return this.y % 2 == 0 ? 'rightEven' : 'rightOdd';
        } else if (this.isBottomTile()) {
            return this.x % 2 == 0 ? 'bottomEven' : 'bottomOdd';
        } else {
            return this.y % 2 == 0 ? 'middleEven' : 'middleOdd';
        }
    }

    isTopTile() {
        return this.y == 0;
    }

    isBottomTile() {
        return this.y == this.settings.map.y-1;
    }

    isLeftTile() {
        return this.x == 0;
    }

    isRightTile() {
        return this.x == this.settings.map.x-1;
    }

    drawWallsAroundZone() {

        if(this.isWall()){
            // draw basic sprite 
            this.drawSprite('wall');
        } else {
            // draw basic sprite 
            this.drawSprite();
        }

        


    }

    // Is the current tile touching a "zone" tile?
    isWall() {
        
        // top-left
        if(
            this.x-1 >= 0 && this.y-1 >= 0 
            && state.currentPlayer.tiles[this.x-1][this.y-1].spriteType == 'zone' 
            && state.currentPlayer.tiles[this.x-1][this.y-1].type == 'floor'
        ){
            return true;
        }
        // top
        if(
            this.y-1 >= 0 
            && state.currentPlayer.tiles[this.x][this.y-1].spriteType == 'zone' 
            && state.currentPlayer.tiles[this.x][this.y-1].type == 'floor'
        ){
            return true;
        }
        // top-right
        if( 
            this.x+1 < state.currentPlayer.tiles.length && this.y-1 >= 0 
            && state.currentPlayer.tiles[this.x+1][this.y-1].spriteType == 'zone' 
            && state.currentPlayer.tiles[this.x+1][this.y-1].type == 'floor'
        ){
            return true;
        }
        // right
        if( 
            this.x+1 < state.currentPlayer.tiles.length
            && state.currentPlayer.tiles[this.x+1][this.y].spriteType == 'zone' 
            && state.currentPlayer.tiles[this.x+1][this.y].type == 'floor'
            ){
            return true;
        }
        // bottom-right
        if(
            this.x+1 < state.currentPlayer.tiles.length && this.y+1 < state.currentPlayer.tiles[this.x+1].length
            && state.currentPlayer.tiles[this.x+1][this.y+1].spriteType == 'zone' 
            && state.currentPlayer.tiles[this.x+1][this.y+1].type == 'floor'
        ){
            return true;
        }
        // bottom
        if( 
            this.y+1 < state.currentPlayer.tiles[this.x].length
            && state.currentPlayer.tiles[this.x][this.y+1].spriteType == 'zone' 
            && state.currentPlayer.tiles[this.x][this.y+1].type == 'floor'
        ){
            return true;
        }
        // bottom-left
        if(
            this.x-1 >= 0 && this.y+1 < state.currentPlayer.tiles[this.x-1].length
            && state.currentPlayer.tiles[this.x-1][this.y+1].spriteType == 'zone' 
            && state.currentPlayer.tiles[this.x-1][this.y+1].type == 'floor'
        ){
            return true;
        }
        // left
        if( 
            this.x-1 >= 0
            && state.currentPlayer.tiles[this.x-1][this.y].spriteType == 'zone' 
            && state.currentPlayer.tiles[this.x-1][this.y].type == 'floor'
        ){
            return true;
        }

        return false;

    }

    drawingZone() {
        if(!state.zoneDrawing.done){

            if(!this.isHovered()){
                this.drawSprite();
            } else {
                this.drawSprite('zone');
            }

            // If current player still has tiles to draw and is clicking on a floor tile
            if(this.spriteType != 'zone' && this.isClicked() && state.players[state.currentPlayerID].zoneTilesLeft > 0){
                this.spriteType = 'zone';
                state.players[state.currentPlayerID].zoneTilesLeft -= 1;
                state.mouseClicked = false;

            // Else go to next player
            } else if(state.players[state.currentPlayerID].zoneTilesLeft == 0) {
                
                // Test is step is finish, did all the players placed their tiles?
                state.zoneDrawing.done = true;
                for(var i = 0; i <= state.players.length - 1; i++){
                    if(state.players[i].zoneTilesLeft > 0){
                        state.zoneDrawing.done = false;
                    }
                }

                // Go to next player
                state.currentPlayerID = (state.currentPlayerID+1) % state.players.length

                // if players have drawn their zones,
                if(!state.zoneDrawing.done){
                    // Step 2 will show instructions for next player
                    state.currentStep = 2;

                }

            }

        } else {
            // Step 4 will show instructions for next player and next turn
            state.currentStep = 4;
        }
    }

}