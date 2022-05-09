class Game {

    constructor(settings) 
    {   
        this.canvas = document.querySelector('canvas');
        this.settings = settings
        this.screen = this.initScreen();    
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
                game.zoneDrawing(); // players will draw their zone
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
            this.players.push(new Player(this, playerSettings))
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
            // Play current step
            game.steps[state.currentStep]()

            
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

    // Players draw their zone
    zoneDrawing()
    {   


        // Draw map
        this.map.draw();

        // Zone drawing is done for each player, go to next step
        if(state.zoneDrawing.done){
            state.currentStep++;
        }
    }



}