class Character {

    constructor(gameSettings, characterProperties, screen)
    {   
        this.gameSettings = gameSettings;

        var settings = this.gameSettings.characters[characterProperties.type]
        this.id = characterProperties.id;
        this.name = characterProperties.name;
        this.energy = settings.energy;
        this.maxEnergy = settings.energy;
        this.health = settings.health;
        this.maxHealth = settings.health;
        this.direction = settings.direction;
        this.animation = settings.animation;
        this.animationStep = 0;
        this.spriteFolder = settings.sprite;
        this.type = characterProperties.type;
        this.x = false;
        this.y = false;
        this.screen = screen;
        this.position = {
            x: false, // this.x * this.this.gameSettings.tile.width,
            y: false, // this.y * this.this.gameSettings.tile.height,
            w: false, // this.this.gameSettings.tile.width,
            h: false, // this.this.gameSettings.tile.height
        }
        this.placed = false,
        this.width = this.gameSettings.tile.width;
        this.height = this.gameSettings.tile.height;
        this.owner = false;
        this.selected = false;
        this.hovered = false;
        this.path = [];
    }

    draw(spriteName = false)
    {
        this.screen.globalAlpha = 1;
        this.spriteName = spriteName ? spriteName : this.spriteFolder + '_' + this.animation + '_' + this.direction + '_' + Math.floor(this.animationStep);
        this.sprite = this.gameSettings.tileSprites[this.spriteName];
        this.screen.drawImage(
            this.sprite, 
            this.x * this.width, 
            this.y * this.height
        )

        if(this.selected || this.hovered){
            // Draw hud
            this.drawPlayerHud()
        }


    }

    updateFogAround()
    {
        var tilesAround = {
            topLeft: state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1] !== undefined && state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1][parseInt(Math.round(this.y))-1] !== undefined ? state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1][parseInt(Math.round(this.y))-1] : false,     // top-left
            top: state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))] !== undefined && state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))][parseInt(Math.round(this.y))-1] !== undefined ? state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))][parseInt(Math.round(this.y))-1] : false,             // top
            topRight: state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1] !== undefined && state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1][parseInt(Math.round(this.y))-1] !== undefined ? state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1][parseInt(Math.round(this.y))-1] : false,    // top-right
            right: state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1] !== undefined && state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1][parseInt(Math.round(this.y))] !== undefined ? state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1][parseInt(Math.round(this.y))] : false,           // right
            bottomRight: state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1] !== undefined && state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1][parseInt(Math.round(this.y))+1] !== undefined ? state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))+1][parseInt(Math.round(this.y))+1] : false, // bottom-right
            bottom: state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))] !== undefined && state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))] [parseInt(Math.round(this.y))+1] !== undefined ? state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))][parseInt(Math.round(this.y))+1] : false,          // bottom
            bottomLeft: state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1] !== undefined && state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1][parseInt(Math.round(this.y))+1] !== undefined ? state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1][parseInt(Math.round(this.y))+1] : false,  // bottom-left
            left: state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1] !== undefined && state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1][parseInt(Math.round(this.y))] !== undefined ? state.players[state.currentPlayerID].tiles[parseInt(Math.round(this.x))-1][parseInt(Math.round(this.y))] : false,            // left
        }
        for(const tilePos of Object.keys(tilesAround)){
            if(tilesAround[tilePos]){
                state.players[state.currentPlayerID].tiles[tilesAround[tilePos].x][tilesAround[tilePos].y].fog = false;
                //state.players[state.currentPlayerID].tiles[tilesAround[tilePos].x][tilesAround[tilePos].y].draw()
                console.log(state.players[state.currentPlayerID].tiles[tilesAround[tilePos].x][tilesAround[tilePos].y])
            }
        }

        


    }
   

    drawBorders()
    {
        this.screen.globalAlpha = 1;
        this.screen.beginPath();
        this.screen.lineWidth = "2";
        this.screen.strokeStyle = state.players[this.owner].color
        this.screen.rect(
            this.x * this.width, // x
            this.y * this.height, // y
            this.width, // width
            this.height // height
        ); 
        this.screen.stroke();
    }

    drawPlayerHud()
    {   

        this.drawHealthBar();
        this.drawEnergyBar();

    }

    drawHealthBar()
    {

        // Health bar
        this.screen.globalAlpha = 1;
        this.screen.beginPath();
        this.screen.lineWidth = '1';
        this.screen.strokeStyle = 'black'
        this.screen.rect(
            this.x * this.width, // x
            this.y * this.height - 10, // y
            this.width, // width
            5 // height
        ); 
        this.screen.stroke();

        // FILL HEALTH BAR
        var healthBar = this.health/this.maxHealth*this.width;
        this.screen.fillStyle = 'green';
        this.screen.fillRect(
            this.x * this.width, // x
            this.y * this.height - 10, // y
            healthBar, // width
            5 // height
        )


    }

    drawEnergyBar()
    {
        // Energy bar
        this.screen.globalAlpha = 1;
        this.screen.beginPath();
        this.screen.lineWidth = '1';
        this.screen.strokeStyle = 'black'
        this.screen.rect(
            this.x * this.width, // x
            this.y * this.height - 18, // y
            this.width, // width
            5 // height
        ); 
        this.screen.stroke();

        // FILL Energy bar 
        var energyBar = this.energy/this.maxEnergy*this.width;
        this.screen.fillStyle = state.players[this.owner].color;
        this.screen.fillRect(
            this.x * this.width, // x
            this.y * this.height - 18, // y
            energyBar, // width
            5 // height
        )
    }

    // Get tiles around current character
    getTilesAround(){
        var currentTileX = this.x;
        var currentTileY = this.y;
        if(this.path.length){
            var lastTile = this.path[this.path.length - 1]
            currentTileX = lastTile.x;
            currentTileY = lastTile.y;
        }
        return {
            top: state.players[state.currentPlayerID].tiles[currentTileX] !== undefined && state.players[state.currentPlayerID].tiles[currentTileX][currentTileY-1] !== undefined ? state.players[state.currentPlayerID].tiles[currentTileX][currentTileY-1] : false,             // top
            right: state.players[state.currentPlayerID].tiles[currentTileX+1] !== undefined && state.players[state.currentPlayerID].tiles[currentTileX+1][currentTileY] !== undefined ? state.players[state.currentPlayerID].tiles[currentTileX+1][currentTileY] : false,           // right
            bottom: state.players[state.currentPlayerID].tiles[currentTileX] !== undefined && state.players[state.currentPlayerID].tiles[currentTileX] [currentTileY+1] !== undefined ? state.players[state.currentPlayerID].tiles[currentTileX][currentTileY+1] : false,          // bottom
            left: state.players[state.currentPlayerID].tiles[currentTileX-1] !== undefined && state.players[state.currentPlayerID].tiles[currentTileX-1][currentTileY] !== undefined ? state.players[state.currentPlayerID].tiles[currentTileX-1][currentTileY] : false,            // left
        }
    }

    walkPath(){

        [this.animation, this.direction] = this.getNextPathDirection();


        if(this.animation == 'walk'){
            switch(this.direction){
                case 'right':
                    this.x += this.gameSettings.animation.character.speed;
                break;
                case 'left':
                    this.x -= this.gameSettings.animation.character.speed;
                break;
                case 'up':
                    this.y -= this.gameSettings.animation.character.speed;
                break;
                case 'down':
                    this.y += this.gameSettings.animation.character.speed;
                break;
            }
            if(this.animationStep < (4 - this.gameSettings.animation.character.frame)){
                this.animationStep += this.gameSettings.animation.character.frame
            } else {
                this.animationStep = 0;
            }
            
            this.energy -= this.gameSettings.animation.character.speed;
            this.energy = this.energy.toFixed(2)

        } else if (this.animation == 'idle') {
            this.animationStep = 0;
        }


        this.updateFogAround();
        console.log()
        this.draw();
        this.drawPlayerHud()


    }

    getNextPathDirection()
    {

        if(this.path[0] !== undefined){
            var nextPath = this.path[0];         

            // right
            if(this.x.toFixed(2) < (nextPath.x - this.gameSettings.animation.character.speed) && this.y.toFixed(2) == nextPath.y){
                return [
                    'walk',
                    'right'
                ]
            }
            // left
            if(this.x.toFixed(2) > (nextPath.x + this.gameSettings.animation.character.speed) &&  this.y.toFixed(2) == nextPath.y){
                return [
                    'walk',
                    'left'
                ]
            }
            // up
            if(this.x.toFixed(2) == nextPath.x && this.y.toFixed(2) > (nextPath.y + this.gameSettings.animation.character.speed)){
                return [
                    'walk',
                    'up'
                ]
            }
            // down
            if(this.x.toFixed(2) == nextPath.x && this.y.toFixed(2) < (nextPath.y - this.gameSettings.animation.character.speed)){
                return [
                    'walk',
                    'down'
                ];
            }

            this.path.shift();
            return [
                this.animation, 
                this.direction
            ] 

        } 

        return [
            'idle',
            'down'
        ];
        
    }



}