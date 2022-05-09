

    // State as global
    var state = {
        game: false,
        mouseClicked: false,
        mousePosition: { // Mouse position on the canvas
            x: 0,
            y: 0
        },
        currentPlayerID: 0, // Player who starts
        currentPlayer: false, // Player who starts
        currentStep: 0, // Current step of the game (Cf this.steps)
        intro: {
            currentStep:0, // Current step of the intro
        },
        zoneDrawing: {
            done: false // Is the zone drawing step done?
        }
    }

    // Init game
    const game = new Game(settings);

    // load
    game.load();

    