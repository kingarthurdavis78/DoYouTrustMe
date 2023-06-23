export class Player {
    constructor(name, color, id, width, height, speed) {
        this.name = name;
        this.color = color;
        this.id = id;
        this.position = {x: 0, y: 0};
        this.width = width;
        this.height = height;
        this.rect = new PIXI.Graphics();
        this.speed = speed;
        this.velocity = {dx: 0, dy: 0};
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    setVelocity(dx, dy) {
        this.velocity.dx = dx;
        this.velocity.dy = dy;
    }

    move() {
        this.position.x += this.velocity.dx;
        this.position.y += this.velocity.dy;
    }

    draw() {
        this.rect.clear();
        this.rect.beginFill(this.color);
        this.rect.drawRect(this.position.x, this.position.y, this.width, this.height);
        this.rect.endFill();
    }

    get top() {
        return this.position.y;
    }

    get bottom() {
        return this.position.y + this.height;
    }

    get left() {
        return this.position.x;
    }

    get right() {
        return this.position.x + this.width;
    }
}
