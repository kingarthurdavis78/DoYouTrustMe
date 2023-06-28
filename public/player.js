export class Player {
    constructor(color, id, width, height, speed) {
        this.color = color;
        this.id = id;
        this.position = {x: 0, y: 0};
        this.width = width;
        this.height = height;
        this.rect = new PIXI.Graphics();
        this.speed = speed;
        this.velocity = {dx: 0, dy: 0};
        this.sprite = null;
        this.rect.visible = false;
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
        //update the rectangle
        this.rect.clear();
        this.rect.beginFill(this.color);
        this.rect.drawRect(this.position.x, this.position.y, this.width, this.height);
        this.rect.endFill();

        // update the sprite
        if (this.sprite != null) {
            this.sprite.x = this.position.x + this.width / 2;
            this.sprite.y = this.position.y;
        }
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

    checkBounds(screenWidth, screenHeight) {
        // check if player is going out of bounds
        if (this.position.x + this.velocity.dx < 0) {
            this.position.x = 0;
            this.velocity.dx = 0;
        }
        if (this.position.x + this.velocity.dx + this.width > screenWidth * 0.5) {
            this.position.x = screenWidth * 0.5 - this.width;
            this.velocity.dx = 0;
        }
        if (this.position.y + this.velocity.dy < 0) {
            this.position.y = 0;
            this.velocity.dy = 0;
        }
        if (this.position.y + this.velocity.dy + this.height > screenHeight) {
            this.position.y = screenHeight - this.height;
            this.velocity.dy = 0;
        }
    }

    checkWalls(walls) {
        // if the player is within speed of a wall, stop them
        for (let i = 0; i < walls.length; i++) {
            if (this.right + this.velocity.dx > walls[i].left && this.left < walls[i].left && this.top < walls[i].bottom && this.bottom > walls[i].top) {
                if (Math.abs(this.right - walls[i].left) < this.speed) {
                    this.velocity.dx = 0;
                    this.position.x = walls[i].left - this.width;
                }
            }

            if (this.left + this.velocity.dx < walls[i].right && this.right > walls[i].right && this.top < walls[i].bottom && this.bottom > walls[i].top) {
                if (Math.abs(this.left - walls[i].right) < this.speed) {
                    this.velocity.dx = 0;
                    this.position.x = walls[i].right;
                }
            }

            if (this.bottom + this.velocity.dy > walls[i].top && this.top < walls[i].top && this.left < walls[i].right && this.right > walls[i].left) {
                if (Math.abs(this.bottom - walls[i].top) < this.speed) {
                    this.velocity.dy = 0;
                    this.position.y = walls[i].top - this.height;
                }
            }

            if (this.top + this.velocity.dy < walls[i].bottom && this.bottom > walls[i].bottom && this.left < walls[i].right && this.right > walls[i].left) {
                if (Math.abs(this.top - walls[i].bottom) < this.speed) {
                    this.velocity.dy = 0;
                    this.position.y = walls[i].bottom;
                }
            }
        }
    }
}
