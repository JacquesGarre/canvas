class Game {

    constructor(settings) 
    {   
        this.canvas = document.querySelector('canvas');
        this.settings = settings
        this.screen = this.initScreen();   
        this.screen.globalAlpha = 1; 
        this.settings.tileSprites = [];
        this.players = [];
        this.initSteps();
    }

    // Inits steps
    initSteps()
    {   
        var game = this;
        this.steps = {
            0: function(){
                game.intro(); // intro
            },
            1: function(){ 
                game.homeMenu(); // homeMenu
            },
            2: function(){ 
                game.zoneDrawingInstructions(); // Instructions : players will draw their zone
            },
            3: function(){ 
                game.zoneDrawing(); // players will draw their zone
            },
            4: function(){ 
                game.charactersPlacingInstructions(); // Instructions : players will place their characters
            },
            5: function(){ 
                game.charactersPlacing(); // players will place their characters
            },
            6: function(){ 
                game.doorsPlacingInstructions(); // Instructions : players will place their doors
            },
            7: function(){ 
                game.doorsPlacing(); // players will place their doors
            },
            8: function(){ 
                game.drawingPathsForCharactersInstructions(); // Instructions : players will draw moves to their characters
            },
            9: function(){ 
                game.drawingPathsForCharacters(); // players will draw moves to their characters
            },
            10: function(){ 
                game.animateCharactersInstructions(); // Instructions : characters will be animated
            },
            11: function(){ 
                game.animateCharacters(); // characters will be animated
            }
        }
    }

    // Preloads images
    load()
    {
        // load tiles images    
        var loaded = 0;
        for (var position in this.settings.tile.sprites) {
            if (this.settings.tile.sprites.hasOwnProperty(position)) {
                const image = new Image();
                image.src = this.settings.tile.sprites[position];
                image.onload = ()=>{ 
                    loaded += 1;
                    if(loaded === Object.keys(this.settings.tile.sprites).length){ // all loaded ?
                        this.start(); // call function to start rendering
                    }
                }
                this.settings.tileSprites[position] = image;
            }
        }
    }

    // Start the game loop
    start()
    {   
        // init the map    
        this.map = new Map(this.settings, this.screen);

        // init the players
        for (const playerSettings of this.settings.players) {
            var player = new Player(this.settings, playerSettings, this.screen, this.map);
            this.players.push(player)
            state.players.push(player)
        }

        // init the territories of the players
        for (player of state.players) {
            player.setTerritory();
        }

        // Init first player
        state.currentPlayer = this.players[state.currentPlayerID];

        // Binds click on canvas
        var canvas = this.canvas;        
        canvas.onmousedown = function(e){
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            state.mouseClicked = {
                x: x,
                y: y
            }
        }
        canvas.onmouseup = function(e){
            state.mouseClicked = false
        }

        window.addEventListener("keydown", function(){
            state.keydown = true
        }, false);
        window.addEventListener("keyup", function(){
            state.keydown = false
        }, false);


        // Game loop
        var game = this;
        function animate(){
            // Update state
            state.game = game;
            // Animate
            window.requestAnimationFrame(animate)
            // Clear screen
            game.clear()
            // Always update mouse position
            game.updateMousePosition()
            // Update current player
            state.currentPlayer = state.players[state.currentPlayerID];
            // Play current step
            game.steps[state.currentStep]()
            // Reset global alpha
            game.screen.globalAlpha = 1; 
        }
        animate();

    }

    // Update mouse coordinates
    updateMousePosition()
    {   
        var x = 0;
        var y = 0;

        // Get mouse position
        this.canvas.onmousemove = function(e) {

            // Correct mouse position
            var rect = this.getBoundingClientRect();

            x = e.clientX - rect.left;
            y = e.clientY - rect.top;

            // Update state
            state.mousePosition.x = x;
            state.mousePosition.y = y;
        
        };


    }

    clear() {
        this.screen.clearRect(0, 0, this.settings.screen.width, this.settings.screen.height);
    }
   

    // Inits the canvas / screen
    initScreen()
    {
        this.canvas.width = this.settings.screen.width;
        this.canvas.height = this.settings.screen.height;
        return this.canvas.getContext('2d');
    }

    // Game introduction
    intro()
    {       
        if(this.settings.intro.skip == true){
            state.currentStep++;
            return false;
        }

        switch(state.intro.currentStep){
            case 0:
                var transition = new Transition(this, {
                    message: 'Rakwes Studios presents',
                    customSettings: {}
                })
                transition.show();
                setTimeout(function(){
                    state.intro.currentStep = 1;
                }, this.settings.intro.duration/2)
            break;
            case 1:
                var transition = new Transition(this, {
                    message: 'WAR GAME',
                    customSettings: {
                        fontSize: '70px'
                    }
                })
                transition.show();
                setTimeout(function(){
                    state.intro.currentStep = 2;
                }, this.settings.intro.duration/2)
            break;
            case 2:
                state.currentStep++;
            break;
        }
    }

    // Home menu
    homeMenu()
    {
        // TODO

        // Skip home menu
        state.currentStep++;
    }

    zoneDrawingInstructions()
    {
        if(this.settings.instructions.skip){
            state.currentStep = 3;
            return false;
        }

        var transition = new Transition(this, {
            message: state.players[state.currentPlayerID].name + ' : Build your base in your territory!',
            customSettings: {}
        })
        transition.show();
        setTimeout(function(){
            state.currentStep = 3;
        }, this.settings.instructions.duration)
    }

    // Players draw their zone
    zoneDrawing()
    {   

        // Draw map
        this.map.draw();

        // Draw territory
        state.currentPlayer.drawTerritory()

        // // Draw fog
        // this.map.drawTerritory()

    }

    charactersPlacingInstructions()
    {
        if(this.settings.instructions.skip){
            state.currentStep = 5;
            return false;
        }

        var transition = new Transition(this, {
            message: state.players[state.currentPlayerID].name + ' : Place your characters in your base!',
            customSettings: {}
        })
        transition.show();
        setTimeout(function(){
            state.currentStep = 5;
        }, this.settings.instructions.duration)
    }


    // Players place their characters
    charactersPlacing()
    {       
        // Enable fog of war from this step
        state.displayFog = this.settings.map.fogOfWar;

        // Draw map
        this.map.draw();

        // Draw characters
        this.map.drawCharacters();

        // draw Fog Of War
        //this.map.drawFogOfWar();

    }

    // Showing instruction for doors placement
    doorsPlacingInstructions()
    {
        if(this.settings.instructions.skip){
            state.currentStep = 7;
            return false;
        }

        var transition = new Transition(this, {
            message: state.players[state.currentPlayerID].name + ' : Place your doors to go out of your base!',
            customSettings: {}
        })
        transition.show();
        setTimeout(function(){
            state.currentStep = 7;
        }, this.settings.instructions.duration)
    }

    doorsPlacing()
    {
        // Draw map
        this.map.draw();

        // Draw characters
        this.map.drawCharacters();

        // Draw doors
        this.map.drawDoors();


    }

    // Creates a debug save file
    downloadState() {
        var content = JSON.stringify(state);
        var a = document.createElement("a");
        var file = new Blob([content], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'state.debug.js';
        a.click();
    }

    // Showing instruction to move characters
    drawingPathsForCharactersInstructions()
    {      

        if(this.settings.instructions.skip){
            state.currentStep = 9;
            return false;
        }

        var transition = new Transition(this, {
            message: state.players[state.currentPlayerID].name + ' : Select a character then click on tiles!',
            customSettings: {}
        })
        transition.show();
        setTimeout(function(){
            state.currentStep = 9;
        }, this.settings.instructions.duration)
    }

    // Move characters
    drawingPathsForCharacters()
    {   
        
        // Draw map
        this.map.draw();

        // Draw characters
        this.map.drawCharacters();

        // Draw doors
        this.map.drawDoors();

        // Draw characters
        this.map.drawPathsForCharacters();

    }

    animateCharactersInstructions()
    {
        // reset tiles selected tiles
        this.map.resetSelectedTiles();

        // Reset energy
        this.map.resetCharacterState();

        if(this.settings.instructions.skip){
            state.currentStep = 11;
            return false;
        }

        var transition = new Transition(this, {
            message: state.players[state.currentPlayerID].name + ' : Your characters will move!',
            customSettings: {}
        })
        transition.show();
        setTimeout(function(){
            state.currentStep = 11;
        }, this.settings.instructions.duration)
    }

    animateCharacters()
    {

        state.drawTerritory = false;

        // Draw map
        this.map.draw();

        // Draw characters
        this.map.drawCharacters();

        // Draw doors
        this.map.drawDoors();

        // Draw characters
        this.map.animateCharacters();
    }

}