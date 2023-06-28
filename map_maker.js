import {Wall} from './public/wall.js';
import * as colors from "./public/colors.js";
import * as keys from './public/input.js';

let app = keys.app;
let stage = keys.stage;
let width = keys.width;
let height = keys.height;

// Draw middle wall
let middle = new Wall(width / 2 - width * 0.005, 0, width * 0.01, height, colors.darkGray);

stage.addChild(middle.rect);
middle.draw();

let rects = [];

// clicked on rect
let clickedRect = null;

let selectedColor = colors.darkGray;
let colorRect = new PIXI.Graphics();
stage.addChild(colorRect);
colorRect.beginFill(selectedColor);
colorRect.drawRect(0, 0, 50, 50);
colorRect.endFill();


let rect;
app.ticker.add(() => {
    getSelectedItem();
    // get mouse position
    mousePosition.x = app.renderer.plugins.interaction.mouse.global.x;
    mousePosition.y = app.renderer.plugins.interaction.mouse.global.y;
    if (rect != null) {
        rect.clear();
        rect.beginFill(selectedColor);
        rect.drawRect(clickPosition.x, clickPosition.y, mousePosition.x - clickPosition.x, mousePosition.y - clickPosition.y);
        rect.endFill();
    }

    // draw maps
    for (let rect of rects) {
        rect.draw();
    }

    // if right pressed delete selected rect
    if (keys.deletePressed && clickedRect != null) {
        clickedRect.rect.visible = false;
        rects.splice(rects.indexOf(clickedRect), 1);
        stage.removeChild(clickedRect.rect);
        clickedRect = null;
    }

    // if escape pressed delete all walls
    if (keys.escapePressed) {
        rects = [];
        stage.removeChildren();
        stage.addChild(middle.rect);
        stage.addChild(colorRect);
        middle.draw();
    }

    if (keys.downPressed) {
        saveMap();
    }
});

function getSelectedItem() {
    // if 1 is pressed red is selected
    if (keys.onePressed) {
        selectedColor = colors.darkGray;
        colorRect.clear();
        colorRect.beginFill(selectedColor);
        colorRect.drawRect(0, 0, 50, 50);
        colorRect.endFill();
    }

}


// Detect click position
let clickPosition = {x: 0, y: 0};
let mousePosition = {x: 0, y: 0};
let drawing = false;
app.view.addEventListener('click', function (event) {
    if (clickedRect != null) {
        clickedRect.color = selectedColor;
        clickedRect = null;
        return;
    }

    // check if clicked on a rect
    for (let rect of rects) {
        if (mousePosition.x > rect.position.x && mousePosition.x < rect.position.x + rect.width && mousePosition.y > rect.position.y && mousePosition.y < rect.position.y + rect.height) {
            clickedRect = rect;
            clickedRect.color = colors.white;
            return;
        }
    }

    // draw a rectangle
    if (!drawing) {
        clickPosition.x = mousePosition.x;
        clickPosition.y = mousePosition.y;
        drawing = true;
        rect = new PIXI.Graphics();
        stage.addChild(rect);
    } else {
        // if left of screen add to player1map
        stage.removeChild(rect);
        rects.push(new Wall(clickPosition.x, clickPosition.y, mousePosition.x - clickPosition.x, mousePosition.y - clickPosition.y, selectedColor));
        stage.addChild(rects[rects.length - 1].rect);
        drawing = false;
        rect = null;
    }
});

// load map to json file
function saveMap() {
    // create map object
    let map = {player1map: [], player2map: []};

    // add walls to map
    for (let rect of rects) {
        let wall = {x: Math.floor(rect.position.x), y: Math.floor(rect.position.y), w: Math.floor(rect.width), h: Math.floor(rect.height), color: rect.color};
        if (rect.position.x < width / 2) {
            map.player1map.push(wall);
        }
        else {
            map.player2map.push(wall);
        }
    }

    // save map to json file
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(map));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "map.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    throw new Error("Map saved");
}