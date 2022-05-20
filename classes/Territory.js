class Territory {

    constructor(playerID, settings, screen, map)
    {   
        var coeffX = playerID % 2; 
        var coeffY = playerID**2 > 1 ? 1 : 0;

        this.map = map;
        this.playerID = playerID;
        this.screen = screen;
        this.settings = settings
        this.xMin = coeffX * (settings.map.x / 2);  
        this.xMax = (settings.map.x / 2) + coeffX * (settings.map.x / 2);
        this.yMin = state.players.length == 2 ? 0 : coeffY * (settings.map.y / 2);
        this.yMax = state.players.length == 2 ? settings.map.y : (settings.map.y / 2) + coeffY * (settings.map.y / 2);

        this.position = {
            x: this.xMin * settings.tile.width,
            y: this.yMin * settings.tile.height,
            w: this.xMax * settings.tile.width,
            h: this.yMax * settings.tile.height
        }

    }

    draw()
    {
        if(this.settings.map.territory.showBorders){
            this.drawBorders()
        }
    }

    drawBorders()
    {   
        this.screen.globalAlpha = 1;
        this.screen.beginPath();
        this.screen.lineWidth = "4";
        this.screen.strokeStyle = state.players[this.playerID].color;
        this.screen.rect(
            this.xMin * this.settings.tile.width + 1, // x
            this.yMin * this.settings.tile.height + 1, // y
            this.xMax * this.settings.tile.width - 2, // width
            this.yMax * this.settings.tile.height - 2 // height
        ); 
        this.screen.stroke();
    }



}