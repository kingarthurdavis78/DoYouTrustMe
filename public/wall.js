export class Wall {
    constructor(x, y, w, h, color) {
        this.position = {x: x, y: y};
        this.width = w;
        this.height = h;
        this.color = color;
        this.rect = new PIXI.Graphics();
    }
    draw() {
        this.rect.clear();
        this.rect.beginFill(this.color);
        this.rect.drawRect(this.position.x, this.position.y, this.width, this.height);
        this.rect.endFill();
    }


}