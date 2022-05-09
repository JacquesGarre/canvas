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

        if(!this.isHovered()){
            this.drawSprite();
        }

        // Click on tile when zoneDrawing step
        if(this.isClicked() && state.currentStep == 2){
            this.spriteType = 'zone';
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
    drawSprite() {
        this.sprite = this.settings.tileSprites[this.spriteType];
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


}