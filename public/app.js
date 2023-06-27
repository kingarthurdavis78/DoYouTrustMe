// import player class
import {Player} from './player.js';
import {Wall} from './wall.js';
import {rightPressed, leftPressed, upPressed, downPressed, spacePressed, app, stage, width, height} from './input.js';
import {darkGray} from "./colors.js";

// Initialize the players
let player = new Player("Player 1", 0x66CCFF, 1, height * 0.1, height * 0.1, height * 0.01);
player.setPosition(width * 0.25, height * 0.9);
let otherPlayer = new Player("Player 2", 0xFF0000, 2, height * 0.1, height * 0.1, height * 0.01);
otherPlayer.setPosition(width * 0.75, height * 0.9);

// Add the rectangles to the stage
stage.addChild(player.rect);
stage.addChild(otherPlayer.rect);

// Add the middle wall
let middle = new Wall(width / 2 - width * 0.005, 0, width * 0.01, height, darkGray);
stage.addChild(middle.rect);
middle.draw();

// load json map
let map = loadMap("maps/map.json");

async function loadMap(filename) {
    // load text from file
    let text = await fetch(filename);
    // parse text to json
    let map = await JSON.parse(await text.text());

    console.log(map);
    return map;
}


// ws is the webSocket connection
const ws = new WebSocket('ws://192.168.253.163:3000');
ws.onmessage = async (event) => {
    if (event.data === 'Sorry, the server is full') {
        alert('Sorry, the server is full');
        ws.close();
        return;
        }
    if (event.data === 'Sorry, the other player disconnected') {
        alert('Sorry, the other player disconnected');
        otherPlayer.rect.visible = false;
        return;
    }
    if (otherPlayer.rect.visible === false) {
        otherPlayer.rect.visible = true;
    }
    let message = JSON.parse(await event.data.text());
    otherPlayer.setPosition(message.x + width * 0.5, message.y);
    otherPlayer.setVelocity(message.dx, message.dy);
};

// Main game loop
app.ticker.maxFPS = 30;
app.ticker.add(() => {
    updatePlayer();
    otherPlayer.move();
    otherPlayer.draw();
});


function updatePlayer() {
    let prevVelocity = player.velocity;
    // check in any key is pressed
    if (!rightPressed && !leftPressed && !upPressed && !downPressed) {
        player.velocity = {dx: 0, dy: 0};
    }
    else if (rightPressed && upPressed) {
        player.velocity = {dx: player.speed * Math.sqrt(2) / 2, dy: -player.speed * Math.sqrt(2) / 2}
    }
    else if (rightPressed && downPressed) {
        player.velocity = {dx: player.speed * Math.sqrt(2) / 2, dy: player.speed * Math.sqrt(2) / 2}
    }
    else if (leftPressed && upPressed) {
        player.velocity = {dx: -player.speed * Math.sqrt(2) / 2, dy: -player.speed * Math.sqrt(2) / 2}
    }
    else if (leftPressed && downPressed) {
        player.velocity = {dx: -player.speed * Math.sqrt(2) / 2, dy: player.speed * Math.sqrt(2) / 2}
    }
    else if (rightPressed) {
        player.velocity = {dx: player.speed, dy: 0}
    }
    else if (leftPressed) {
        player.velocity = {dx: -player.speed, dy: 0}
    }
    else if (upPressed) {
        player.velocity = {dx: 0, dy: -player.speed}
    }
    else if (downPressed) {
        player.velocity = {dx: 0, dy: player.speed}
    }

    // check if touching the edge of the screen
    checkEdges();
    // checkWalls();

    player.move();
    player.draw();


    // send the player data to the server
    if ((player.velocity.dx !== prevVelocity.dx || player.velocity.dy !== prevVelocity.dy) && ws.readyState === 1) {
        ws.send(JSON.stringify({x: player.position.x, y: player.position.y, dx: player.velocity.dx, dy: player.velocity.dy}));
    }
}

function checkEdges() {
    if (player.position.x + player.velocity.dx < 0) {
        player.position.x = 0;
        player.velocity.dx = 0;
    }
    if (player.position.x + player.velocity.dx + player.width > width * 0.5) {
        player.position.x = width * 0.5 - player.width;
        player.velocity.dx = 0;
    }
    if (player.position.y + player.velocity.dy < 0) {
        player.position.y = 0;
        player.velocity.dy = 0;
    }
    if (player.position.y + player.velocity.dy + player.height > height) {
        player.position.y = height - player.height;
        player.velocity.dy = 0;
    }
}
