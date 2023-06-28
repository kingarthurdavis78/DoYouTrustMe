import {Wall} from "./wall.js";

export class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player1map = [];
        this.player2map = [];
    }

    addWall(x, y, w, h, color) {
        let wall = new Wall(x, y, w, h, color);
        if (x < this.width / 2) {
            this.player1map.push(wall);
        }
        else {
            this.player2map.push(wall);
        }
    }

    async loadMap(filename, speed, playerNumber) {
        let text = await fetch(filename);
        // parse text to json
        let json_map = await JSON.parse(await text.text());

        if (playerNumber === 1) {
            for (let box of json_map.player1map) {
                box.x = Math.floor(box.x / speed) * speed;
                box.y = Math.floor(box.y / speed) * speed;
                box.w = Math.floor(box.w / speed) * speed;
                box.h = Math.floor(box.h / speed) * speed;
                this.addWall(box.x, box.y, box.w, box.h, box.color);
            }
            for (let box of json_map.player2map) {
                box.x = Math.floor(box.x / speed) * speed;
                box.y = Math.floor(box.y / speed) * speed;
                box.w = Math.floor(box.w / speed) * speed;
                box.h = Math.floor(box.h / speed) * speed;
                this.addWall(box.x, box.y, box.w, box.h, box.color);
            }
        } else {
            for (let box of json_map.player1map) {
                box.x = Math.floor(box.x / speed) * speed + this.width / 2;
                box.y = Math.floor(box.y / speed) * speed;
                box.w = Math.floor(box.w / speed) * speed;
                box.h = Math.floor(box.h / speed) * speed;
                this.addWall(box.x, box.y, box.w, box.h, box.color);
            }
            for (let box of json_map.player2map) {
                box.x = Math.floor(box.x / speed) * speed - this.width / 2;
                box.y = Math.floor(box.y / speed) * speed;
                box.w = Math.floor(box.w / speed) * speed;
                box.h = Math.floor(box.h / speed) * speed;
                this.addWall(box.x, box.y, box.w, box.h, box.color);
            }
        }

    }

    drawMap(stage, playerNumber) {
        for (let wall of this.player1map) {
            let rect = new PIXI.Graphics();
            rect.beginFill(wall.color);
            rect.drawRect(wall.position.x, wall.position.y, wall.width, wall.height);
            rect.endFill();
            rect.visible = false;
            stage.addChild(rect);
        }
        for (let wall of this.player2map) {
            let rect = new PIXI.Graphics();
            rect.beginFill(wall.color);
            rect.drawRect(wall.position.x, wall.position.y, wall.width, wall.height);
            rect.endFill();
            stage.addChild(rect);
        }
    }

    clearMap(stage) {
        this.player1map = [];
        this.player2map = [];

        // remove from stage
        for (let child of stage.children) {
            stage.removeChild(child);
        }
    }
}