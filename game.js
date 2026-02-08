/******************************
 * ELIOS ADVENTURE - GAME.JS
 * Motore di gioco principale
 ******************************/

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Costanti di gioco
const GRAVITY = 0.5;
const FRICTION = 0.8;
const TILE_SIZE = 40;

// Stato di gioco
let currentLevel = 1;
let score = 0;
let lives = 3;

// Input tastiera
const keys = {
    left: false,
    right: false,
    up: false
};

// Listener tastiera
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowUp") keys.up = true;
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowUp") keys.up = false;
});

// Classe giocatore
class Player {
    constructor() {
        this.width = 30;
        this.height = 40;
        this.x = 50;
        this.y = 300;
        this.velX = 0;
        this.velY = 0;
        this.speed = 4;
        this.jumping = false;
    }

    update() {
        // Movimento orizzontale
        if (keys.left) {
            this.velX = -this.speed;
        }
        if (keys.right) {
            this.velX = this.speed;
        }

        // Salto
        if (keys.up && !this.jumping) {
            this.velY = -10;
            this.jumping = true;
        }

        // Gravità
        this.velY += GRAVITY;

        // Applica velocità
        this.x += this.velX;
        this.y += this.velY;

        // Attrito
        this.velX *= FRICTION;

        // Collisione con il suolo
        if (this.y + this.height > canvas.height - TILE_SIZE) {
            this.y = canvas.height - TILE_SIZE - this.height;
            this.velY = 0;
            this.jumping = false;
        }
    }

    draw() {
        // Corpo (pixel-art semplice)
        ctx.fillStyle = "#c68642"; // pelle
        ctx.fillRect(this.x + 8, this.y + 5, 14, 14);

        // Vestito
        ctx.fillStyle = "#e0e0e0";
        ctx.fillRect(this.x + 5, this.y + 20, 20, 20);

        // Turbante
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x + 6, this.y, 18, 6);
    }
}

// Piattaforme
const platforms = [
    { x: 0, y: canvas.height - TILE_SIZE, width: canvas.width, height: TILE_SIZE },
    { x: 200, y: 300, width: 120, height: 20 },
    { x: 400, y: 250, width: 120, height: 20 }
];

// Disegna piattaforme
function drawPlatforms() {
    ctx.fillStyle = "#654321";
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

// Collisioni piattaforme
function platformCollision(player) {
    platforms.forEach(p => {
        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height < p.y + 10 &&
            player.y + player.height + player.velY >= p.y
        ) {
            player.y = p.y - player.height;
            player.velY = 0;
            player.jumping = false;
        }
    });
}

// Aggiorna HUD
function updateHUD() {
    document.getElementById("lives").innerText = `❤️ Vite: ${lives}`;
    document.getElementById("score").innerText = `⭐ Punteggio: ${score}`;
    document.getElementById("level").innerText = `🌍 Livello: ${currentLevel}`;
}

// Giocatore
const player = new Player();

// Loop di gioco
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlatforms();
    player.update();
    platformCollision(player);
    player.draw();
    updateHUD();

    requestAnimationFrame(gameLoop);
}

// Avvio gioco
gameLoop();


