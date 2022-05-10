
// Setttings
const settings = {

    // General settings
    debug: false,

    // Game settings
    playerStartWith: {
        floorTilesCount: 9 // Number of floor tiles a player will have to draw his zone
    },

    // Players info
    players: [
        {
            id:0,
            name: 'Player 1'
        },
        {
            id:1,
            name: 'Player 2'
        },
        // {
        //     id:2,
        //     name: 'Player3'
        // }
        // {
        //     id:3,
        //     name: 'Player4'
        // }
    ],
    
    // Intro
    intro: {
        skip: true, // false
        duration: 5000,
    },

    // Show instructions
    instructions: {
        skip: false,
        duration: 1000
    },

    // Screen settings
    screen: {
        width:1024, // pixels
        height:768, // pixels
    },

    // Transition settings
    transition: {
        fontSize: '30px',
        font: 'Georgia',
        backgroundColor: 'black',
        textColor: 'white'
    },

    // Tile settings
    tile: {
        width:32, // pixels
        height:32, // pixels
        debug: {
            backgroundColor: '',
            borderColor: 'white',
            borderThickness: 1
        },
        sprites: {
            topLeft: 'assets/map/top-left.png',
            topOdd: 'assets/map/top-odd.png',
            topEven: 'assets/map/top-even.png',
            topRight: 'assets/map/top-right.png',
            rightOdd: 'assets/map/right-odd.png',
            rightEven: 'assets/map/right-even.png',
            bottomRight: 'assets/map/bottom-right.png',
            leftOdd: 'assets/map/left-odd.png',
            leftEven: 'assets/map/left-even.png',
            bottomLeft: 'assets/map/bottom-left.png',
            bottomOdd: 'assets/map/bottom-odd.png',
            bottomEven: 'assets/map/bottom-even.png',
            middleOdd: 'assets/map/middle-odd.png',
            middleEven: 'assets/map/middle-even.png',
            zone: 'assets/map/zone.png',
            wall: 'assets/map/top-wall.png'
        }
    },

    // Map settings
    map: {
        offset: {
            x: 0, // pixels
            y: 0 // pixels
        },
        x: 32,// 8, // tiles 32
        y: 24, // tiles 24
        debug: {
            backgroundColor: 'white',
            borderColor: 'pink'
        }
    },

    // Hud settings
    hud: {},
};