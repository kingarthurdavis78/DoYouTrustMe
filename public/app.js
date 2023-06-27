// import player class
import {Player} from './player.js';
import {Wall} from './wall.js';
import {rightPressed, leftPressed, upPressed, downPressed, spacePressed, app, stage, width, height} from './input.js';
import {darkGray} from "./colors.js";

// Initialize the players
let player = new Player("Adam", 0x66CCFF, 1, height * 0.05, height * 0.05, height * 0.01);
player.setPosition(width * 0.25, height * 0.9);
let otherPlayer = new Player("Eve", 0xFF0000, 2, height * 0.05, height * 0.05, height * 0.01);
otherPlayer.setPosition(width * 0.75, height * 0.9);

// Load gif and add it to the stage
const adam_walking_images = [
    "assets/adam/adam-walking-1.png",
    "assets/adam/adam-walking-2.png",
    "assets/adam/adam-walking-3.png",
    "assets/adam/adam-walking-4.png",
    "assets/adam/adam-walking-5.png",
    "assets/adam/adam-walking-6.png",
    "assets/adam/adam-walking-7.png",
    "assets/adam/adam-walking-8.png",
];

const eve_walking_images = [
    "assets/eve/eve-walking-1.png",
    "assets/eve/eve-walking-2.png",
    "assets/eve/eve-walking-3.png",
    "assets/eve/eve-walking-4.png",
    "assets/eve/eve-walking-5.png",
    "assets/eve/eve-walking-6.png",
    "assets/eve/eve-walking-7.png",
    "assets/eve/eve-walking-8.png",
];

// Load Adam's walking animation
for (let i = 0; i < adam_walking_images.length; i++) {
    app.loader.add(adam_walking_images[i]);
}

// Load Eve's walking animation
for (let i = 0; i < eve_walking_images.length; i++) {
    app.loader.add(eve_walking_images[i]);
}

app.loader.load((loader, resources) => {
    let textureArray = [];
    for (let i = 0; i < adam_walking_images.length; i++) {
        let texture = resources[adam_walking_images[i]].texture;
        textureArray.push(texture);
    }
    player.sprite = new PIXI.AnimatedSprite(textureArray);
    player.sprite.anchor.set(0.5);
    player.sprite.scale.set(0.5);
    player.sprite.animationSpeed = 0.15;
    player.sprite.play();
    player.sprite.x = player.position.x;
    player.sprite.y = player.position.y;
    stage.addChild(player.sprite);

    textureArray = [];
    for (let i = 0; i < eve_walking_images.length; i++) {
        let texture = resources[eve_walking_images[i]].texture;
        textureArray.push(texture);
    }
    otherPlayer.sprite = new PIXI.AnimatedSprite(textureArray);
    otherPlayer.sprite.anchor.set(0.5);
    otherPlayer.sprite.scale.set(0.5);
    otherPlayer.sprite.animationSpeed = 0.15;
    otherPlayer.sprite.play();
    otherPlayer.sprite.x = otherPlayer.position.x;
    otherPlayer.sprite.y = otherPlayer.position.y;
    stage.addChild(otherPlayer.sprite);
});


// Add the rectangles to the stage
stage.addChild(player.rect);
stage.addChild(otherPlayer.rect);

// walls
let walls = [];
walls.push(new Wall(width / 2 - width * 0.005, 0, width * 0.01, height, darkGray));
// draw walls
for (let i = 0; i < walls.length; i++) {
    stage.addChild(walls[i].rect);
    walls[i].draw();
}

// ws is the webSocket connection
const ws = new WebSocket('ws://192.168.86.22:3000');
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
    let message = JSON.parse(await event.data.text());
    otherPlayer.setPosition(message.x + width * 0.5, message.y);
    otherPlayer.setVelocity(message.dx, message.dy);
};

// Main game loop
app.ticker.maxFPS = 30;
app.ticker.add(() => {
    updatePlayer();
    updateOtherPlayer();
});

function updateOtherPlayer() {
    // flip sprite if necessary
    if (otherPlayer.sprite !== null) {
        if (otherPlayer.velocity.dx > 0) {
            otherPlayer.sprite.scale.x = 0.5;
        } else if (otherPlayer.velocity.dx < 0) {
            otherPlayer.sprite.scale.x = -0.5;
        }
        // stop sprite if necessary
        if (otherPlayer.velocity.dx === 0 && otherPlayer.velocity.dy === 0) {
            otherPlayer.sprite.stop();
        }
        else {
            otherPlayer.sprite.play();
        }
    }

    otherPlayer.move();
    otherPlayer.draw();
}


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

    // flip the sprite if needed
    if (player.velocity.dx > 0) {
        player.sprite.scale.x = 0.5;
    }
    else if (player.velocity.dx < 0) {
        player.sprite.scale.x = -0.5;
    }
    // pause is no movement
    if (player.sprite !== null) {
        if (player.velocity.dx === 0 && player.velocity.dy === 0) {
            player.sprite.stop();
        } else {
            player.sprite.play();
        }
    }

    player.move();
    player.draw();


    // send the player data to the server
    if (player.velocity.dx !== prevVelocity.dx || player.velocity.dy !== prevVelocity.dy && ws.readyState === 1) {
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

// function checkWalls() {
//     for (let wall of walls) {
//
//     }
// }