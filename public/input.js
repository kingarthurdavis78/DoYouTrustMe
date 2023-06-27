


export let width = 1200;
export let height = 675;

export const app = new PIXI.Application({
    width: width,         // Width of the canvas
    height: height,        // Height of the canvas
    antialias: false,    // Anti-aliasing
});

// Alias for the stage
export const stage = app.stage;




// Add the Pixi.js canvas to the HTML document
document.body.appendChild(app.view);

// Listen for keyboard events
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

// Variables
export let rightPressed = false;
export let leftPressed = false;
export let upPressed = false;
export let downPressed = false;
export let spacePressed = false;

export let escapePressed = false;

// numbers
export let onePressed = false;
export let twoPressed = false;
export let threePressed = false;
export let fourPressed = false;
export let fivePressed = false;
export let sixPressed = false;
export let sevenPressed = false;
export let eightPressed = false;
export let ninePressed = false;
export let zeroPressed = false;
// delete
export let deletePressed = false;

// Functions
export function keyDownHandler(event) {
    // A pressed
    if (event.keyCode === 68) {
        rightPressed = true;
    }
    if (event.keyCode === 65) {
        leftPressed = true;
    }
    if (event.keyCode === 83) {
        downPressed = true;
    }
    if (event.keyCode === 87) {
        upPressed = true;
    }
    // Spacebar
    if (event.keyCode === 32) {
        spacePressed = true;
        toggleFullScreen();
    }
    // Escape
    if (event.keyCode === 27) {
        escapePressed = true;
    }

    // 1 through 9
    if (event.keyCode === 49) {
        onePressed = true;
    }
    if (event.keyCode === 50) {
        twoPressed = true;
    }
    if (event.keyCode === 51) {
        threePressed = true;
    }
    if (event.keyCode === 52) {
        fourPressed = true;
    }
    if (event.keyCode === 53) {
        fivePressed = true;
    }
    if (event.keyCode === 54) {
        sixPressed = true;
    }
    if (event.keyCode === 55) {
        sevenPressed = true;
    }
    if (event.keyCode === 56) {
        eightPressed = true;
    }
    if (event.keyCode === 57) {
        ninePressed = true;
    }
    if (event.keyCode === 48) {
        zeroPressed = true;
    }

    //delete
    if (event.keyCode === 8) {
        deletePressed = true;
    }
}

export function keyUpHandler(event) {
    // AWSD
    if (event.keyCode === 68) {
        rightPressed = false;
    }
    if (event.keyCode === 65) {
        leftPressed = false;
    }
    if (event.keyCode === 83) {
        downPressed = false;
    }
    if (event.keyCode === 87) {
        upPressed = false;
    }
    // Spacebar
    if (event.keyCode === 32) {
        spacePressed = false;
    }

    // Escape
    if (event.keyCode === 27) {
        escapePressed = false;
    }

    // 1 through 9
    if (event.keyCode === 49) {
        onePressed = false;
    }
    if (event.keyCode === 50) {
        twoPressed = false;
    }
    if (event.keyCode === 51) {
        threePressed = false;
    }
    if (event.keyCode === 52) {
        fourPressed = false;
    }
    if (event.keyCode === 53) {
        fivePressed = false;
    }
    if (event.keyCode === 54) {
        sixPressed = false;
    }
    if (event.keyCode === 55) {
        sevenPressed = false;
    }
    if (event.keyCode === 56) {
        eightPressed = false;
    }
    if (event.keyCode === 57) {
        ninePressed = false;
    }
    if (event.keyCode === 48) {
        zeroPressed = false;
    }

    // delete
    if (event.keyCode === 8) {
        deletePressed = false;
    }
}

let fullscreen = false;
function goFullScreen() {
    fullscreen = true;

    if (app.view.webkitRequestFullScreen) {
        app.view.webkitRequestFullScreen();
    }
    else if (app.view.mozRequestFullScreen) {
        app.view.mozRequestFullScreen();
    }
    else if (app.view.requestFullScreen) {
        app.view.requestFullscreen();
    }
    // resize the canvas to fill browser window dynamically
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // the following code is to maintain the aspect ratio of the game
    let ratio = Math.min(window.innerWidth / width, window.innerHeight / height);
    stage.scale.x = ratio;
    stage.scale.y = ratio;
    width = window.innerWidth;
    height = window.innerHeight;

}

function exitHandler() {
    // resize the canvas to fill browser window dynamically
    app.renderer.resize(1200, 675);
    // Scale down to original size
    stage.scale.x = 1;
    stage.scale.y = 1;
    width = 1200;
    height = 675;
}

function exitFullScreen() {
    fullscreen = false;

    if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    // resize the canvas to fill browser window dynamically
    app.renderer.resize(1600, 900);
    // Scale down to original size
    stage.scale.x = 1;
    stage.scale.y = 1;
    width = 1600;
    height = 900;
}

function toggleFullScreen() {
    if (fullscreen === false) {
        goFullScreen();
    }
    else {
        exitFullScreen();
    }
}