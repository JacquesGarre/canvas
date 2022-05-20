
// Setttings
const settings = {

    // General settings
    debug: false,

    // Game settings that should be available in a menu
    playerStartWith: {
        floorTilesCount: 8, // Number of floor tiles a player will have to draw his zone
        doorTilesCount: 2, // Number of door tiles a player will have to draw
    },
    walls: {
        health: 3,
    },
    doors: {
        health: 2,
    }, 
    characters: {
        soldier: {
            health: 100,
            energy: 7,
            sprite: 'soldier',
            direction: 'down', 
            animation: 'idle'
        },
    },
    // Intro
    intro: {
        skip: false, //true, // false
        duration: 3000,
    },
    // Show instructions
    instructions: {
        skip: false, // true, //false, //true, //false, //true, //false,
        duration: 1500
    },
    // animations
    animation: {
        character: {
            speed: 0.02,
            frame: 0.05
        }
    },


    // Players info
    players: [
        {
            id:0,
            name: 'Michel',
            color: 'red',
            characters: [
                {   
                    id: 0,
                    name: 'Hubert',
                    type: 'soldier'
                },
                {
                    id: 1,
                    name: 'Roger',
                    type: 'soldier'
                },
                // {
                //     name: 'Paul',
                //     type: 'soldier'
                // },
            ]
        },
        {
            id:1,
            name: 'Albert',
            color: 'purple',
            characters: [
                {
                    id: 0,
                    name: 'Benji',
                    type: 'soldier'
                },
                {
                    id: 1,
                    name: 'Alfonso',
                    type: 'soldier'
                },
                // {
                //     name: 'Axel',
                //     type: 'soldier'
                // },
            ]
        },
        // {
        //     id:2,
        //     name: 'Player 3',
        //     characters: [
        //     ]
        // },
        // {
        //     id:3,
        //     name: 'Player 4',
        //     characters: [
        //     ]
        // }
    ],


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

            floor_topLeft: 'assets/map/floor/top-left.png',
            floor_topOdd: 'assets/map/floor/top-odd.png',
            floor_topEven: 'assets/map/floor/top-even.png',
            floor_topRight: 'assets/map/floor/top-right.png',
            floor_rightOdd: 'assets/map/floor/right-odd.png',
            floor_rightEven: 'assets/map/floor/right-even.png',
            floor_bottomRight: 'assets/map/floor/bottom-right.png',
            floor_leftOdd: 'assets/map/floor/left-odd.png',
            floor_leftEven: 'assets/map/floor/left-even.png',
            floor_bottomLeft: 'assets/map/floor/bottom-left.png',
            floor_bottomOdd: 'assets/map/floor/bottom-odd.png',
            floor_bottomEven: 'assets/map/floor/bottom-even.png',
            floor_middleOdd: 'assets/map/floor/middle-odd.png',
            floor_middleEven: 'assets/map/floor/middle-even.png',

            zone: 'assets/map/zone/zone.png',

            wall_topLeft: 'assets/map/walls/top-left.png',
            wall_top: 'assets/map/walls/top.png',
            wall_topRight: 'assets/map/walls/top-right.png',
            wall_right: 'assets/map/walls/right.png', 
            wall_bottomRight: 'assets/map/walls/bottom-right.png',
            wall_bottom: 'assets/map/walls/bottom.png', 
            wall_bottomLeft: 'assets/map/walls/bottom-left.png', 
            wall_left: 'assets/map/walls/left.png', 
            wall_topLeftInner: 'assets/map/walls/top-left-inner.png',
            wall_topRightInner: 'assets/map/walls/top-right-inner.png',
            wall_bottomRightInner: 'assets/map/walls/bottom-right-inner.png',
            wall_bottomLeftInner: 'assets/map/walls/bottom-left-inner.png',

            door_top: 'assets/map/doors/bottom.png',
            door_bottom: 'assets/map/doors/top.png',
            door_right: 'assets/map/doors/right.png',
            door_left: 'assets/map/doors/left.png',

            soldier_walk_down_0: 'assets/map/characters/soldier/walk_down_0.png',
            soldier_walk_down_1:'assets/map/characters/soldier/walk_down_1.png',
            soldier_walk_down_2:'assets/map/characters/soldier/walk_down_2.png',
            soldier_walk_down_3:'assets/map/characters/soldier/walk_down_3.png',

            soldier_walk_up_0: 'assets/map/characters/soldier/walk_up_0.png',
            soldier_walk_up_1:'assets/map/characters/soldier/walk_up_1.png',
            soldier_walk_up_2:'assets/map/characters/soldier/walk_up_2.png',
            soldier_walk_up_3:'assets/map/characters/soldier/walk_up_3.png',

            soldier_walk_right_0: 'assets/map/characters/soldier/walk_right_0.png',
            soldier_walk_right_1:'assets/map/characters/soldier/walk_right_1.png',
            soldier_walk_right_2:'assets/map/characters/soldier/walk_right_2.png',
            soldier_walk_right_3:'assets/map/characters/soldier/walk_right_3.png',

            soldier_walk_left_0: 'assets/map/characters/soldier/walk_left_0.png',
            soldier_walk_left_1:'assets/map/characters/soldier/walk_left_1.png',
            soldier_walk_left_2:'assets/map/characters/soldier/walk_left_2.png',
            soldier_walk_left_3:'assets/map/characters/soldier/walk_left_3.png',

            soldier_idle_down_0: 'assets/map/characters/soldier/idle_down_0.png',
            soldier_idle_down_1:'assets/map/characters/soldier/idle_down_1.png',
            soldier_idle_down_2:'assets/map/characters/soldier/idle_down_2.png',
            soldier_idle_down_3:'assets/map/characters/soldier/idle_down_3.png',

        }
    },

    // Map settings
    map: {
        territory: {
            showBorders: true,
            showOpacity: true
        },
        fogOfWar: true,
        fogOpacity: 0.2,
        offset: {
            x: 0, // pixels
            y: 0 // pixels
        },
        x: 32 ,//16, // 32, // 32,// 8, // tiles 32
        y: 24, // 16, //24, // tiles 24
        debug: {
            backgroundColor: 'white',
            borderColor: 'pink'
        }
    },

    // Hud settings
    hud: {},
};