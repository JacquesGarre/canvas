class Transition {

    constructor(game, transitionSettings){
        this.game = game;
        this.transitionSettings = transitionSettings;
        this.customSettings = transitionSettings.customSettings;
    }

    // Show transition
    show(){
        var fontSize = this.customSettings.fontSize !== undefined ? this.customSettings.fontSize : this.game.settings.transition.fontSize;
        var font = this.customSettings.font !== undefined ? this.customSettings.font : this.game.settings.transition.font;

        this.game.screen.fillStyle = this.game.settings.transition.backgroundColor;   
        this.game.screen.font = fontSize + " " + font;
        if(this.customSettings.fontSize)
        this.game.screen.fillRect(
            0, 
            0,
            this.game.settings.screen.width,
            this.game.settings.screen.height
        )
        this.game.screen.fillStyle = this.game.settings.transition.textColor;
        this.game.screen.textAlign = "center";
        this.game.screen.fillText(
            this.transitionSettings.message, 
            this.game.settings.screen.width/2, 
            this.game.settings.screen.height/2
        );        
    }

}