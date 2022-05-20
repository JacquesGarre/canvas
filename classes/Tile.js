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
        this.spriteType = this.getFloorSpriteType();
        this.floorSpriteType = this.spriteType;
        this.position = {
            x: this.x * this.width,
            y: this.y * this.height,
            w: this.width,
            h: this.height
        }
        this.fog = true;
        this.owner = false;
        this.walkable = false;
        this.selected = false

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



        if((state.displayFog && this.fog == true) || (this.isOutOfTerritory() && this.settings.map.territory.showOpacity)){
            this.screen.globalAlpha = this.settings.map.fogOpacity;
            this.sprite = this.settings.tileSprites[this.floorSpriteType];
        } else {
            this.screen.globalAlpha = 1;
            this.sprite = !spriteType ? this.settings.tileSprites[this.spriteType] : this.settings.tileSprites[spriteType];
        }

        this.screen.drawImage(
            this.sprite, 
            this.x * this.width, 
            this.y * this.height
        )

        if(this.selected){
            this.drawAsSelected();
        }

    }

    // Return sprite type (top, left, right, bottom, top-left, etc...)
    getFloorSpriteType() {
        if (this.isTopTile() && this.isLeftTile()) {
            return 'floor_topLeft';
        } 
        if (this.isTopTile() && this.isRightTile()) {
            return 'floor_topRight';
        } 
        if (this.isBottomTile() && this.isRightTile()) {
            return 'floor_bottomRight';
        } 
        if (this.isBottomTile() && this.isLeftTile()) {
            return 'floor_bottomLeft';
        } 
        if (this.isLeftTile()) {
            return this.y % 2 == 0 ? 'floor_leftEven' : 'floor_leftOdd';
        } 
        if (this.isTopTile()) {
            return this.x % 2 == 0 ? 'floor_topEven' : 'floor_topOdd';
        } 
        if (this.isRightTile()) {
            return this.y % 2 == 0 ? 'floor_rightEven' : 'floor_rightOdd';
        } 
        if (this.isBottomTile()) {
            return this.x % 2 == 0 ? 'floor_bottomEven' : 'floor_bottomOdd';
        } 
        return this.y % 2 == 0 ? 'floor_middleEven' : 'floor_middleOdd';
        
    }

    // Get tiles around current tile
    getTilesAround(){
        return {
            topLeft: state.players[state.currentPlayerID].tiles[this.x-1] !== undefined && state.players[state.currentPlayerID].tiles[this.x-1][this.y-1] !== undefined ? state.players[state.currentPlayerID].tiles[this.x-1][this.y-1] : false,     // top-left
            top: state.players[state.currentPlayerID].tiles[this.x] !== undefined && state.players[state.currentPlayerID].tiles[this.x][this.y-1] !== undefined ? state.players[state.currentPlayerID].tiles[this.x][this.y-1] : false,             // top
            topRight: state.players[state.currentPlayerID].tiles[this.x+1] !== undefined && state.players[state.currentPlayerID].tiles[this.x+1][this.y-1] !== undefined ? state.players[state.currentPlayerID].tiles[this.x+1][this.y-1] : false,    // top-right
            right: state.players[state.currentPlayerID].tiles[this.x+1] !== undefined && state.players[state.currentPlayerID].tiles[this.x+1][this.y] !== undefined ? state.players[state.currentPlayerID].tiles[this.x+1][this.y] : false,           // right
            bottomRight: state.players[state.currentPlayerID].tiles[this.x+1] !== undefined && state.players[state.currentPlayerID].tiles[this.x+1][this.y+1] !== undefined ? state.players[state.currentPlayerID].tiles[this.x+1][this.y+1] : false, // bottom-right
            bottom: state.players[state.currentPlayerID].tiles[this.x] !== undefined && state.players[state.currentPlayerID].tiles[this.x] [this.y+1] !== undefined ? state.players[state.currentPlayerID].tiles[this.x][this.y+1] : false,          // bottom
            bottomLeft: state.players[state.currentPlayerID].tiles[this.x-1] !== undefined && state.players[state.currentPlayerID].tiles[this.x-1][this.y+1] !== undefined ? state.players[state.currentPlayerID].tiles[this.x-1][this.y+1] : false,  // bottom-left
            left: state.players[state.currentPlayerID].tiles[this.x-1] !== undefined && state.players[state.currentPlayerID].tiles[this.x-1][this.y] !== undefined ? state.players[state.currentPlayerID].tiles[this.x-1][this.y] : false,            // left
        }
    }

    drawFogAround(tilesAround)
    {
        for (var tileKey of Object.keys(tilesAround)) {
            if(tilesAround[tileKey]){
                tilesAround[tileKey].fog = false;
            }
        }
    }

    // Returns proper wall sprite depending on position
    setWallSprite(){

        var tilesAround = this.getTilesAround()

        // top-right-inner corner (has a zone to the left, has a zone to the bottomleft, has a zone to the bottom)
        if(
            tilesAround.left && tilesAround.left.type == 'zone' && 
            tilesAround.bottomLeft && tilesAround.bottomLeft.type == 'zone' &&
            tilesAround.bottom && tilesAround.bottom.type == 'zone'
        ){
            this.type = 'wall';
            this.spriteType = 'wall_topRightInner';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
            this.drawFogAround(tilesAround);
            return;
        }

        // top-left-inner corner (has a zone to the right, has a zone to the bottomright, has a zone to the bottom)
        if(
            tilesAround.right && tilesAround.right.type == 'zone' && 
            tilesAround.bottomRight && tilesAround.bottomRight.type == 'zone' &&
            tilesAround.bottom && tilesAround.bottom.type == 'zone'
        ){
            this.type = 'wall';
            this.spriteType = 'wall_topLeftInner';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
            this.drawFogAround(tilesAround);
            return;
        }

        // bottom-left-inner corner (has a zone to the top, has a zone to the topright, has a zone to the right)
        if(
            tilesAround.top && tilesAround.top.type == 'zone' && 
            tilesAround.topRight && tilesAround.topRight.type == 'zone' &&
            tilesAround.right && tilesAround.right.type == 'zone'
        ){
            this.type = 'wall';
            this.spriteType = 'wall_bottomLeftInner';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
            this.drawFogAround(tilesAround);
            return;
        }

        // bottom-right-inner corner (has a zone to the top, has a zone to the topleft, has a zone to the left)
        if(
            tilesAround.top && tilesAround.top.type == 'zone' && 
            tilesAround.topLeft && tilesAround.topLeft.type == 'zone' &&
            tilesAround.left && tilesAround.left.type == 'zone'
        ){
            this.type = 'wall';
            this.spriteType = 'wall_bottomRightInner';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
            this.drawFogAround(tilesAround);
            return;
        }

        // wall-top-left : tile to the right is floor or wall, tile to the bottom is floor or wall, 
        // tile to the bottomright must be zone
        if(
            tilesAround.right && (tilesAround.right.type == 'floor' || tilesAround.right.type == 'wall') && 
            tilesAround.bottom && (tilesAround.bottom.type == 'floor' || tilesAround.bottom.type == 'wall') && 
            tilesAround.bottomRight && tilesAround.bottomRight.type == 'zone'){
            this.type = 'wall';
            this.spriteType = 'wall_topLeft';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
                this.drawFogAround(tilesAround);
            return;
        }

        // wall-top-right : tile to the left is floor or wall, tile to the bottom is floor or wall, 
        // tile to the bottomleft must be zone
        if(
            tilesAround.left && (tilesAround.left.type == 'floor' || tilesAround.left.type == 'wall') && 
            tilesAround.bottom && (tilesAround.bottom.type == 'floor' || tilesAround.bottom.type == 'wall') && 
            tilesAround.bottomLeft && tilesAround.bottomLeft.type == 'zone'){
            this.type = 'wall';
            this.spriteType = 'wall_topRight';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
                this.drawFogAround(tilesAround);
            return;
        }

        // wall-bottom-right : tile to the top is floor or wall, tile to the left is floor or wall, 
        // tile to the topleft must be zone
        if(
            tilesAround.top && (tilesAround.top.type == 'floor' || tilesAround.top.type == 'wall') && 
            tilesAround.left && (tilesAround.left.type == 'floor' || tilesAround.left.type == 'wall') && 
            tilesAround.topLeft && tilesAround.topLeft.type == 'zone'){
            this.type = 'wall';
            this.spriteType = 'wall_bottomRight';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
                this.drawFogAround(tilesAround);
            return;
        }

        // wall-bottom-left : tile to the top is floor or wall, tile to the right is floor or wall, 
        // tile to the topright  must be zone
        if(
            tilesAround.top && (tilesAround.top.type == 'floor' || tilesAround.top.type == 'wall') && 
            tilesAround.right && (tilesAround.right.type == 'floor' || tilesAround.right.type == 'wall') && 
            tilesAround.topRight && tilesAround.topRight.type == 'zone'){
            this.type = 'wall';
            this.spriteType = 'wall_bottomLeft';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
                this.drawFogAround(tilesAround);
            return;
        }

        // wall-right : tile to the left must be zone.
        if(tilesAround.left && tilesAround.left.type == 'zone'){
            this.type = 'wall';
            this.spriteType = 'wall_right';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
            this.drawFogAround(tilesAround);
            return;
        }

        // wall-left : tile to the right must be zone.
        if(tilesAround.right && tilesAround.right.type == 'zone'){
            this.type = 'wall';
            this.spriteType = 'wall_left';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
            this.drawFogAround(tilesAround);
            return;
        }

        // wall-top : tile to the bottom must be zone.
        if(tilesAround.top && tilesAround.top.type == 'zone'){
            this.type = 'wall';
            this.spriteType = 'wall_top';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
            this.drawFogAround(tilesAround);
            return;
        }

        // wall-bottom : tile to the right must be zone.
        if(tilesAround.bottom && tilesAround.bottom.type == 'zone'){
            this.type = 'wall';
            this.spriteType = 'wall_bottom';
            this.health = this.settings.walls.health;
            this.owner = state.currentPlayerID;
            this.drawFogAround(tilesAround);
            return;
        }

        // Default
        this.type = 'floor';
        this.spriteType = 'floor_middleOdd';
       
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

        

        if(this.isWall() && this.type == 'floor'){

            // Since this tile is owned by current player, no fog
            this.fog = false;

            // set walls around
            this.setWallSprite();

        }

        // draw sprite 
        this.drawSprite();
        

    }

    // Is the current tile touching a "zone" tile?
    isWall() {
        
        // top-left
        if( state.currentPlayer.tiles[this.x-1] !== undefined &&
            state.currentPlayer.tiles[this.x-1][this.y-1] !== undefined &&
            this.x-1 >= 0 && this.y-1 >= 0 
            && state.currentPlayer.tiles[this.x-1][this.y-1].type == 'zone'
        ){
            return true;
        }
        // top
        if( state.currentPlayer.tiles[this.x] !== undefined &&
            state.currentPlayer.tiles[this.x][this.y-1] !== undefined &&
            this.y-1 >= 0 
            && state.currentPlayer.tiles[this.x][this.y-1].type == 'zone'
        ){
            return true;
        }
        // top-right
        if( state.currentPlayer.tiles[this.x+1] !== undefined &&
            state.currentPlayer.tiles[this.x+1][this.y-1] !== undefined &&
            this.x+1 < state.currentPlayer.tiles.length && this.y-1 >= 0 
            && state.currentPlayer.tiles[this.x+1][this.y-1].type == 'zone'
        ){
            return true;
        }
        // right
        if( state.currentPlayer.tiles[this.x+1] !== undefined &&
            state.currentPlayer.tiles[this.x+1][this.y] !== undefined &&
            this.x+1 < state.currentPlayer.tiles.length
            && state.currentPlayer.tiles[this.x+1][this.y].type == 'zone'
            ){
            return true;
        }
        // bottom-right
        if( state.currentPlayer.tiles[this.x+1] !== undefined &&
            state.currentPlayer.tiles[this.x+1][this.y+1] !== undefined &&
            this.x+1 < state.currentPlayer.tiles.length && this.y+1 < state.currentPlayer.tiles[this.x+1].length
            && state.currentPlayer.tiles[this.x+1][this.y+1].type == 'zone'
        ){
            return true;
        }
        // bottom
        if( state.currentPlayer.tiles[this.x] !== undefined &&
            state.currentPlayer.tiles[this.x][this.y+1] !== undefined &&
            this.y+1 < state.currentPlayer.tiles[this.x].length
            && state.currentPlayer.tiles[this.x][this.y+1].type == 'zone'
        ){
            return true;
        }
        // bottom-left
        if( state.currentPlayer.tiles[this.x-1] !== undefined &&
            state.currentPlayer.tiles[this.x-1][this.y+1] !== undefined &&
            this.x-1 >= 0 && this.y+1 < state.currentPlayer.tiles[this.x-1].length
            && state.currentPlayer.tiles[this.x-1][this.y+1].type == 'zone'
        ){
            return true;
        }
        // left
        if( state.currentPlayer.tiles[this.x-1] !== undefined &&
            state.currentPlayer.tiles[this.x-1][this.y] !== undefined &&
            this.x-1 >= 0
            && state.currentPlayer.tiles[this.x-1][this.y].type == 'zone'
        ){
            return true;
        }

        return false;

    }

    isOutOfTerritory()
    {
        var isOut = this.position.x < state.currentPlayer.territory.position.x ||
            (this.position.x + this.position.w) > state.currentPlayer.territory.position.w ||
            this.position.y < state.currentPlayer.territory.position.y ||
            (this.position.y + this.position.h) > state.currentPlayer.territory.position.h;

        if(state.drawTerritory){
            return isOut;
        } else {
            return false;
        }
    }

    drawingZone() {
        if(!state.zoneDrawing.done){

            if(!this.isHovered()){
                this.drawSprite();
            } else {
                // Hover effect of zone placing
                if(!this.isOutOfTerritory()){
                    this.drawSprite('zone');
                } else {
                    this.drawSprite();
                }
            }

            // If current player still has tiles to draw and is clicking on a floor tile
            if(!this.isOutOfTerritory() && this.spriteType != 'zone' && this.isClicked() && state.players[state.currentPlayerID].zoneTilesLeft > 0){
                this.floorType = 'zone';
                this.spriteType = 'zone';
                this.type = 'zone';
                this.owner = state.currentPlayerID;
                this.fog = false;
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

                // if players have not finished drawing their zones,
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

    drawAsPossibleMove(){

        if(!this.selected){
            this.walkable = true;
            this.screen.globalAlpha = 0.2;
            this.screen.beginPath();
            this.screen.lineWidth = "1";
            this.screen.strokeStyle = state.players[state.currentPlayerID].color
            this.screen.rect(
                this.x * this.width, // x
                this.y * this.height, // y
                this.width, // width
                this.height // height
            ); 
            this.screen.stroke();
    
            this.screen.fillStyle = state.players[state.currentPlayerID].color;
            this.screen.fillRect(
                this.x * this.width, // x
                this.y * this.height, // y
                this.width, // width
                this.height // height
            )
        }


    }

    drawAsSelected(){
        var characterSelected = state.players[state.currentPlayerID].characters[state.currentPlayer.characterSelected.id];

        var inPlayerSelectedPath = false;
        if(characterSelected && characterSelected.path && characterSelected.path.length){
            for(var tile of characterSelected.path){
                if(tile.x == this.x && tile.y == this.y){
                    inPlayerSelectedPath = true;
                    break;
                }
            }
        }

        if(inPlayerSelectedPath){
            this.screen.globalAlpha = 0.4;
            this.screen.beginPath();
            this.screen.lineWidth = "1";
            this.screen.strokeStyle = state.players[state.currentPlayerID].color
            this.screen.rect(
                this.x * this.width, // x
                this.y * this.height, // y
                this.width, // width
                this.height // height
            ); 
            this.screen.stroke();
    
            this.screen.fillStyle = state.players[state.currentPlayerID].color;
            this.screen.fillRect(
                this.x * this.width, // x
                this.y * this.height, // y
                this.width, // width
                this.height // height
            )
    
            if(this.isClicked() && state.currentPlayer.characterSelected && state.currentPlayer.characterSelected.path.length){
                var lastPathTile = state.currentPlayer.characterSelected.path[state.currentPlayer.characterSelected.path.length-1];
                if(lastPathTile.x == this.x && lastPathTile.y == this.y){
                    characterSelected.energy++;
                    state.currentPlayer.characterSelected.path.pop()
                    state.mouseClicked = false;
                    this.walkable = true;
                    this.selected = false;
                }
            }
        }

    }

}