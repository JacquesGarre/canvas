    
    // State as global
    var state = {
        game: false,
        keydown: false,
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
        drawTerritory: true,
        zoneDrawing: {
            done: false // Is the zone drawing done?
        },
        charactersPlacing: {
            done: false // Are the characters placed ?
        },
        doorsPlacing: {
            done: false // Are the doors placed ?
        },
        drawingPath: {
            done: false // Are the characters paths drawn ?
        },
        animateCharacters: {
            done: false // Animation finished ?
        },
        players: []
    }