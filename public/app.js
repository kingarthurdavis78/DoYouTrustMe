// import player class
import {Player} from './player.js';
import {Wall} from './wall.js';
import {rightPressed, leftPressed, upPressed, downPressed, spacePressed, app, stage, width, height} from './input.js';
import {darkGray} from "./colors.js";
import {Map} from './map.js';

// Initialize the players
let player = new Player(0x66CCFF, 1, height * 0.05, height * 0.05, height * 0.01);
player.setPosition(width * 0.25, height * 0.9);
let otherPlayer = new Player(0xFF0000, 2, height * 0.05, height * 0.05, height * 0.01);
otherPlayer.setPosition(width * 0.75, height * 0.9);

// Create map
let map = new Map(width, height);


// ws is the webSocket connection
const ws = new WebSocket('ws://192.168.86.22:3000');
ws.onmessage = async (event) => {
    if (event.data === 'You are player 1') {
        player.name = 'Adam';
        otherPlayer.name = 'Eve';
        loadPlayers(player, otherPlayer);
        map.loadMap("maps/map.json", player.speed, 1).then(r => map.drawMap(stage));
        return;
    }
    if (event.data === 'You are player 2') {
        player.name = 'Eve';
        otherPlayer.name = 'Adam';
        loadPlayers(otherPlayer, player);
        map.loadMap("maps/map.json", player.speed, 2).then(r => map.drawMap(stage));
        return;
    }
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

function loadPlayers(adam, eve) {
    // Load Adam's walking animation
    for (let i = 0; i < adam_walking_images.length; i++) {
        app.loader.add(adam_walking_images[i]);
    }
    // Load Eve's walking animation
    for (let i = 0; i < eve_walking_images.length; i++) {
        app.loader.add(eve_walking_images[i]);
    }
    app.loader.load((loader, resources) => {
        // Load Adam's walking animation
        let textureArray = [];
        for (let i = 0; i < adam_walking_images.length; i++) {
            let texture = resources[adam_walking_images[i]].texture;
            textureArray.push(texture);
        }
        adam.sprite = new PIXI.AnimatedSprite(textureArray);
        adam.sprite.anchor.set(0.5);
        adam.sprite.scale.set(0.5);
        adam.sprite.animationSpeed = 0.15;
        adam.sprite.play();
        adam.sprite.x = adam.position.x;
        adam.sprite.y = adam.position.y;
        stage.addChild(adam.sprite);

        // Load Eve's walking animation
        textureArray = [];
        for (let i = 0; i < eve_walking_images.length; i++) {
            let texture = resources[eve_walking_images[i]].texture;
            textureArray.push(texture);
        }
        eve.sprite = new PIXI.AnimatedSprite(textureArray);
        eve.sprite.anchor.set(0.5);
        eve.sprite.scale.set(0.5);
        eve.sprite.animationSpeed = 0.15;
        eve.sprite.play();
        eve.sprite.x = eve.position.x;
        eve.sprite.y = eve.position.y;
        stage.addChild(eve.sprite);
    });
}


// Add the rectangles to the stage
stage.addChild(player.rect);
stage.addChild(otherPlayer.rect);

// Add the middle wall
let middle = new Wall(width / 2 - width * 0.005, 0, width * 0.01, height, darkGray);
stage.addChild(middle.rect);
middle.draw();






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
    player.checkBounds(width, height);
    player.checkWalls(map.player1map);

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
    if ((player.velocity.dx !== prevVelocity.dx || player.velocity.dy !== prevVelocity.dy) && ws.readyState === 1) {
        ws.send(JSON.stringify({x: player.position.x, y: player.position.y, dx: player.velocity.dx, dy: player.velocity.dy}));
    }
}