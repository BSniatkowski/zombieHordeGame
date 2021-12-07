<<<<<<< HEAD
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 800;

var player;

var gameScore = 0;

var canvasPosition = canvas.getBoundingClientRect();

var mouse = {
    x: 0,
    y: 0,
    click: false
}

//swipe effect of weapon

function degBetween(object) {

    let swipeRad = 0.017453;

    let tanX = Math.atan2((mouse.y - object.y), (mouse.x - object.x))

    let lineX = Math.cos(tanX + swipeRad * object.attackAnimation) * 50 + player.x;

    let lineY = Math.sin(tanX + swipeRad * object.attackAnimation) * 50 + player.y;

    ctx.lineTo(lineX, lineY);

    object.attackAnimation += player.attackspeed;

    if(object.attackAnimation == 30) {
        object.attackAnimation = -30;
    }

    checkHit(lineX, lineY);

}

//check player hit enemy with melee weapon

function checkHit(lineToX, lineToY) {

    let distanceOfWeapon;

    let distanceOfPlayer

    for(let i = 0; i < enemiesArray.length; i++) {

        let generalA = (player.y - lineToY) / (player.x - lineToX)

        distanceOfWeapon = Math.abs(generalA * enemiesArray[i].x - enemiesArray[i].y + ( player.y - generalA * player.x )) /  Math.abs(generalA + 1)

        let dx = (lineToX + player.x)/2 - enemiesArray[i].x;

        let dy = (lineToY + player.y)/2 - enemiesArray[i].y;

        distanceOfPlayer = Math.sqrt(dx * dx + dy * dy);

        if(distanceOfWeapon < 20 && distanceOfPlayer < 40) {
            enemiesArray[i].hp -= player.dmg;
        }

    }

}

const keys = [];

//projectile class

class projectile {
    constructor(x, y, projectilespeed, dmg, angle) {
        this.x = x;
        this.y = y;
        this.projectilespeed = projectilespeed;
        this.dmg = dmg;
        this.angle = angle;
    }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = 'lightgrey'
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            this.x += Math.cos(this.angle + Math.PI) * this.projectilespeed;
            this.y += Math.sin(this.angle + Math.PI) * this.projectilespeed;
            if(this.x < 0 || this.x > canvas.width) {
                player.projectilesArray.splice(player.projectilesArray.indexOf(this), 1)
            }
            if(this.y < 0 || this.y > canvas.height) {
                player.projectilesArray.splice(player.projectilesArray.indexOf(this), 1)
            }
        }
        checkShot() {
            for(let i = 0; i < enemiesArray.length; i++) {
                let dx = this.x - enemiesArray[i].x;

                let dy = this.y - enemiesArray[i].y;

                let distance = Math.sqrt(dx * dx + dy * dy);
                if(distance < 40) {
                    enemiesArray[i].hp -= this.dmg;
                    player.projectilesArray.splice(player.projectilesArray.indexOf(this), 1)
                    return true;
                }
            }
        }
}

//player object

const playerSprite = new Image();
playerSprite.src = './images/playersprite.png';

class Player {
    constructor(x,y,movementspeed,hp,dmg,rangeDmg,attackspeed,shootingspeed) {
        this.x = x;
        this.y = y;
        this.movementspeed = movementspeed;
        this.hp = hp;
        //melee
        this.dmg = dmg;
        this.attackspeed = attackspeed;
        this.rangeDmg = rangeDmg;
        this.attackAnimation = -30;
        //shooting
        this.shootingspeed = shootingspeed;
        this.projectilesArray = [];
        this.shootingCooldown = 60/shootingspeed;
        this.actualCooldown = 0;
        this.projectilespeed = 10;
        //sprite animation
        this.angle = 0;
        this.animationFrame = 0;
        this.ticks = 0;
    }
    draw() {
        /*ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2)
        ctx.stroke();*/

        if(this.animationFrame == 19) {
            this.animationFrame = 0;
        }

        this.ticks+=this.movementspeed;

        if(this.ticks > 2 && (keys[68] || keys[65] || keys[83] || keys[87])) {
            this.ticks = 0;
            this.animationFrame++;
        }

        this.angle = Math.atan2((this.y - mouse.y), (this.x - mouse.x));
        
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle + Math.PI)
        ctx.drawImage(playerSprite, this.animationFrame * 279, 0, 279, 219, -35, -35, 70, 70);
        ctx.restore();

    }
    attack() {

        if((mouse.click || this.attackAnimation != -30) && !keys[69]) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            degBetween(this);
            ctx.stroke();
        }

    }
    shootProjectile() {
        if(this.actualCooldown == 0 && keys[69]) {
            this.projectilesArray.push(new projectile(this.x, this.y, this.projectilespeed, this.rangeDmg, this.angle))
            this.actualCooldown = this.shootingCooldown;
        } else if(this.actualCooldown > 0) {
            this.actualCooldown--;
        }
        
    }
}

player = new Player(canvas.width/2, canvas.height/2, 3, 200, 4, 20, 3, 3);

//player movement

window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;
})

window.addEventListener('keyup', function(e) {
    delete keys[e.keyCode];
})

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
})

canvas.addEventListener('mousedown', () => {
    mouse.click = true;
})

canvas.addEventListener('mouseup', () => {
    mouse.click = false;
})

function movePlayer() {
    if(keys[68] && player.x + player.movementspeed < canvas.width) {
        player.x += player.movementspeed;
    }
    if(keys[65] && player.x - player.movementspeed > 0) {
        player.x -= player.movementspeed;
    }
    if(keys[83] && player.y + player.movementspeed < canvas.height) {
        player.y += player.movementspeed;
    }
    if(keys[87] && player.y - player.movementspeed > 0) {
        player.y -= player.movementspeed;
    }
}

//enemy AI and statistics

const enemySprite = new Image();
enemySprite.src = './images/zombiesprite.png'

class Enemy {
    constructor(x, y, movementspeed, hp, dmg, attackrange) {
        this.x = x;
        this.y = y;
        this.movementspeed = movementspeed;
        this.hp = hp;
        this.maxHp = this.hp;
        this.dmg = dmg;
        this.attackrange = attackrange;
        this.attackTime = 0;
        this.scoreValue = Math.ceil(hp*movementspeed*dmg/10);
        //sprite animation variables
        this.angle = 0;
        this.animationFrame = 0;
        this.ticks = 0;
    }
    draw() {
        /*ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2)
        ctx.fill();
        ctx.stroke();*/

        this.angle = Math.atan2((this.y - player.y), (this.x - player.x))

        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle + Math.PI)
        ctx.drawImage(enemySprite, this.animationFrame * 288, 516, 288, 311, -40, -40, 80, 80 );
        ctx.restore();
    }
    moveToPlayer() {

        for(let i = 0; i < enemiesArray.length; i++) {

            if(enemiesArray[i] != this) {

                let dx = this.x - enemiesArray[i].x;

                let dy = this.y - enemiesArray[i].y;

                let distance = Math.sqrt(dx * dx + dy * dy);

                if(distance < 40) {

                    if(this.x < enemiesArray[i].x) {
                        this.x -= this.movementspeed;
                    }
                    if(this.x > enemiesArray[i].x) {
                        this.x += this.movementspeed;
                    }
                    if(this.y < enemiesArray[i].y) {
                        this.y -= this.movementspeed;
                    }
                    if(this.y > enemiesArray[i].y) {
                        this.y += this.movementspeed;
                    }
                    
                }
            }
        }

        if(this.x < player.x) {
            this.x += this.movementspeed;
        }
        if(this.x > player.x) {
            this.x -= this.movementspeed;
        }
        if(this.y < player.y) {
            this.y += this.movementspeed;
        }
        if(this.y > player.y) {
            this.y -= this.movementspeed;
        }

        //sprite animation frames

        if(this.animationFrame == 16) {
            this.animationFrame = 0;
        }

        this.ticks+=this.movementspeed;

        if(this.ticks > 2) {
            this.ticks = 0;
            this.animationFrame++;
        }

    }
    attack() {
        
        let dx = this.x - player.x;

        let dy = this.y - player.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < this.attackrange) {
            this.attackTime++;
            if(this.attackTime > 60) {
                player.hp -= this.dmg;
                this.attackTime = 0;
            }
        } else {
            this.attackTime = 0;
        }
    }
    showHP() {
        if(this.hp < this.maxHp) {
            let hpLevel = this.hp/this.maxHp;

            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.strokeStyle = 'black';
            ctx.rect(this.x - 30,this.y + 20, 60, 10);
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - 30,this.y + 20, 60, 10);
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - 30,this.y + 20,hpLevel * 60, 10);
            ctx.stroke();
        }
    }
    isDead() {
        if(this.hp <= 0) {
            enemiesArray.splice(enemiesArray.indexOf(this), 1);
            gameScore+=this.scoreValue;
            return true;
        }
    }
}

//game board setter

const gameBoard = new Image();
gameBoard.src = './images/grass.png'

function generateBoard() {
    ctx.drawImage(gameBoard, 0, 0, canvas.width, canvas.height)
}

// test enemies diffuculty settings

var enemiesArray = [];

function createEnemies(numberOfenemies) {

    for(let i = 0; i < numberOfenemies; i++) {

        let x = Math.ceil(Math.random() * canvas.width);
        let y = -30;
        let hp = Math.ceil( Math.random() * 10 ) * 10;
        let movementspeed = Math.ceil( Math.random() * 20 )/hp + 3/2;
        let dmg = Math.ceil( hp/movementspeed/5 ) + 10;

        enemiesArray.push(new Enemy(x,y,movementspeed,hp,dmg,50))
    }

}

function animateEnemies() {

    for(let i = 0; i < enemiesArray.length; i++) {
        enemiesArray[i].moveToPlayer();
        enemiesArray[i].draw();
        if(enemiesArray[i].isDead()) {
            i--;
        } else {
            enemiesArray[i].attack()
            enemiesArray[i].showHP();
        }
    }

}

function animatePlayer() {
    player.attack();

    player.shootProjectile();

    for(let i = 0; i < player.projectilesArray.length; i++) {
        player.projectilesArray[i].update();
        if(player.projectilesArray[i] != undefined) {
            if(!player.projectilesArray[i].checkShot()) {
            player.projectilesArray[i].draw();
        }
        }
        
    }

    player.draw();
}

const HP = document.querySelector('.HP');

const SCORE = document.querySelector('.SCORE');

var difficulty = 0;

function updateInfo() {
    HP.innerText = "HP: " + player.hp;
    SCORE.innerText = "SCORE: " + gameScore;
    difficulty = SCORE%1000;

}

let fps, fpsInterval, startTime, now, then, elapsed;


function startAnimating(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

//set difficulty

function setDifficulty() {
    
    if(enemiesArray.length < 1)
    createEnemies(Math.floor(gameScore/300) + 1)
}

//fps setter/game speed

function animate() {

    if(player.hp > 0) {
        requestAnimationFrame(animate);
    } else {
        
    }
    
    now = Date.now();

    elapsed = now - then;

    if(elapsed > fpsInterval) {

        then = now - (elapsed % fpsInterval);

        ctx.clearRect(0,0,innerWidth,innerHeight)

        generateBoard()

        movePlayer();

        animatePlayer()

        animateEnemies();
        
        updateInfo();

        setDifficulty();
    }
}

=======
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 800;

var player;

var gameScore = 0;

var canvasPosition = canvas.getBoundingClientRect();

var mouse = {
    x: 0,
    y: 0,
    click: false
}

//swipe effect of weapon

function degBetween(object) {

    let swipeRad = 0.017453;

    let tanX = Math.atan2((mouse.y - object.y), (mouse.x - object.x))

    let lineX = Math.cos(tanX + swipeRad * object.attackAnimation) * 50 + player.x;

    let lineY = Math.sin(tanX + swipeRad * object.attackAnimation) * 50 + player.y;

    ctx.lineTo(lineX, lineY);

    object.attackAnimation += player.attackspeed;

    if(object.attackAnimation == 30) {
        object.attackAnimation = -30;
    }

    checkHit(lineX, lineY);

}

//check player hit enemy with melee weapon

function checkHit(lineToX, lineToY) {

    let distanceOfWeapon;

    let distanceOfPlayer

    for(let i = 0; i < enemiesArray.length; i++) {

        let generalA = (player.y - lineToY) / (player.x - lineToX)

        distanceOfWeapon = Math.abs(generalA * enemiesArray[i].x - enemiesArray[i].y + ( player.y - generalA * player.x )) /  Math.abs(generalA + 1)

        let dx = (lineToX + player.x)/2 - enemiesArray[i].x;

        let dy = (lineToY + player.y)/2 - enemiesArray[i].y;

        distanceOfPlayer = Math.sqrt(dx * dx + dy * dy);

        if(distanceOfWeapon < 20 && distanceOfPlayer < 40) {
            enemiesArray[i].hp -= player.dmg;
        }

    }

}

const keys = [];

//projectile class

class projectile {
    constructor(x, y, projectilespeed, dmg, angle) {
        this.x = x;
        this.y = y;
        this.projectilespeed = projectilespeed;
        this.dmg = dmg;
        this.angle = angle;
    }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = 'lightgrey'
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            this.x += Math.cos(this.angle + Math.PI) * this.projectilespeed;
            this.y += Math.sin(this.angle + Math.PI) * this.projectilespeed;
            if(this.x < 0 || this.x > canvas.width) {
                player.projectilesArray.splice(player.projectilesArray.indexOf(this), 1)
            }
            if(this.y < 0 || this.y > canvas.height) {
                player.projectilesArray.splice(player.projectilesArray.indexOf(this), 1)
            }
        }
        checkShot() {
            for(let i = 0; i < enemiesArray.length; i++) {
                let dx = this.x - enemiesArray[i].x;

                let dy = this.y - enemiesArray[i].y;

                let distance = Math.sqrt(dx * dx + dy * dy);
                if(distance < 40) {
                    enemiesArray[i].hp -= this.dmg;
                    player.projectilesArray.splice(player.projectilesArray.indexOf(this), 1)
                    return true;
                }
            }
        }
}

//player object

const playerSprite = new Image();
playerSprite.src = './images/playersprite.png';

class Player {
    constructor(x,y,movementspeed,hp,dmg,rangeDmg,attackspeed,shootingspeed) {
        this.x = x;
        this.y = y;
        this.movementspeed = movementspeed;
        this.hp = hp;
        //melee
        this.dmg = dmg;
        this.attackspeed = attackspeed;
        this.rangeDmg = rangeDmg;
        this.attackAnimation = -30;
        //shooting
        this.shootingspeed = shootingspeed;
        this.projectilesArray = [];
        this.shootingCooldown = 60/shootingspeed;
        this.actualCooldown = 0;
        this.projectilespeed = 10;
        //sprite animation
        this.angle = 0;
        this.animationFrame = 0;
        this.ticks = 0;
    }
    draw() {
        /*ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2)
        ctx.stroke();*/

        if(this.animationFrame == 19) {
            this.animationFrame = 0;
        }

        this.ticks+=this.movementspeed;

        if(this.ticks > 2 && (keys[68] || keys[65] || keys[83] || keys[87])) {
            this.ticks = 0;
            this.animationFrame++;
        }

        this.angle = Math.atan2((this.y - mouse.y), (this.x - mouse.x));
        
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle + Math.PI)
        ctx.drawImage(playerSprite, this.animationFrame * 279, 0, 279, 219, -35, -35, 70, 70);
        ctx.restore();

    }
    attack() {

        if((mouse.click || this.attackAnimation != -30) && !keys[69]) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            degBetween(this);
            ctx.stroke();
        }

    }
    shootProjectile() {
        if(this.actualCooldown == 0 && keys[69]) {
            this.projectilesArray.push(new projectile(this.x, this.y, this.projectilespeed, this.rangeDmg, this.angle))
            this.actualCooldown = this.shootingCooldown;
        } else if(this.actualCooldown > 0) {
            this.actualCooldown--;
        }
        
    }
}

player = new Player(canvas.width/2, canvas.height/2, 3, 200, 4, 20, 3, 3);

//player movement

window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;
})

window.addEventListener('keyup', function(e) {
    delete keys[e.keyCode];
})

window.addEventListener('mousemove', function(e) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
})

window.addEventListener('mousedown', () => {
    mouse.click = true;
})

window.addEventListener('mouseup', () => {
    mouse.click = false;
})

function movePlayer() {
    if(keys[68] && player.x + player.movementspeed < canvas.width) {
        player.x += player.movementspeed;
    }
    if(keys[65] && player.x - player.movementspeed > 0) {
        player.x -= player.movementspeed;
    }
    if(keys[83] && player.y + player.movementspeed < canvas.height) {
        player.y += player.movementspeed;
    }
    if(keys[87] && player.y - player.movementspeed > 0) {
        player.y -= player.movementspeed;
    }
}

//enemy AI and statistics

const enemySprite = new Image();
enemySprite.src = './images/zombiesprite.png'

class Enemy {
    constructor(x, y, movementspeed, hp, dmg, attackrange) {
        this.x = x;
        this.y = y;
        this.movementspeed = movementspeed;
        this.hp = hp;
        this.maxHp = this.hp;
        this.dmg = dmg;
        this.attackrange = attackrange;
        this.attackTime = 0;
        this.scoreValue = Math.ceil(hp*movementspeed*dmg/10);
        //sprite animation variables
        this.angle = 0;
        this.animationFrame = 0;
        this.ticks = 0;
    }
    draw() {
        /*ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2)
        ctx.fill();
        ctx.stroke();*/

        this.angle = Math.atan2((this.y - player.y), (this.x - player.x))

        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle + Math.PI)
        ctx.drawImage(enemySprite, this.animationFrame * 288, 516, 288, 311, -40, -40, 80, 80 );
        ctx.restore();
    }
    moveToPlayer() {

        for(let i = 0; i < enemiesArray.length; i++) {

            if(enemiesArray[i] != this) {

                let dx = this.x - enemiesArray[i].x;

                let dy = this.y - enemiesArray[i].y;

                let distance = Math.sqrt(dx * dx + dy * dy);

                if(distance < 40) {

                    if(this.x < enemiesArray[i].x) {
                        this.x -= this.movementspeed;
                    }
                    if(this.x > enemiesArray[i].x) {
                        this.x += this.movementspeed;
                    }
                    if(this.y < enemiesArray[i].y) {
                        this.y -= this.movementspeed;
                    }
                    if(this.y > enemiesArray[i].y) {
                        this.y += this.movementspeed;
                    }
                    
                }
            }
        }

        if(this.x < player.x) {
            this.x += this.movementspeed;
        }
        if(this.x > player.x) {
            this.x -= this.movementspeed;
        }
        if(this.y < player.y) {
            this.y += this.movementspeed;
        }
        if(this.y > player.y) {
            this.y -= this.movementspeed;
        }

        //sprite animation frames

        if(this.animationFrame == 16) {
            this.animationFrame = 0;
        }

        this.ticks+=this.movementspeed;

        if(this.ticks > 2) {
            this.ticks = 0;
            this.animationFrame++;
        }

    }
    attack() {
        
        let dx = this.x - player.x;

        let dy = this.y - player.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < this.attackrange) {
            this.attackTime++;
            if(this.attackTime > 60) {
                player.hp -= this.dmg;
                this.attackTime = 0;
            }
        } else {
            this.attackTime = 0;
        }
    }
    showHP() {
        if(this.hp < this.maxHp) {
            let hpLevel = this.hp/this.maxHp;

            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.strokeStyle = 'black';
            ctx.rect(this.x - 30,this.y + 20, 60, 10);
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - 30,this.y + 20, 60, 10);
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - 30,this.y + 20,hpLevel * 60, 10);
            ctx.stroke();
        }
    }
    isDead() {
        if(this.hp <= 0) {
            enemiesArray.splice(enemiesArray.indexOf(this), 1);
            gameScore+=this.scoreValue;
            return true;
        }
    }
}

//game board setter

const gameBoard = new Image();
gameBoard.src = './images/grass.png'

function generateBoard() {
    ctx.drawImage(gameBoard, 0, 0, canvas.width, canvas.height)
}

// test enemies diffuculty settings

var enemiesArray = [];

function createEnemies(numberOfenemies) {

    for(let i = 0; i < numberOfenemies; i++) {

        let x = Math.ceil(Math.random() * canvas.width);
        let y = -30;
        let hp = Math.ceil( Math.random() * 10 ) * 10;
        let movementspeed = Math.ceil( Math.random() * 20 )/hp + 3/2;
        let dmg = Math.ceil( hp/movementspeed/5 ) + 10;

        enemiesArray.push(new Enemy(x,y,movementspeed,hp,dmg,50))
    }

}

function animateEnemies() {

    for(let i = 0; i < enemiesArray.length; i++) {
        enemiesArray[i].moveToPlayer();
        enemiesArray[i].draw();
        if(enemiesArray[i].isDead()) {
            i--;
        } else {
            enemiesArray[i].attack()
            enemiesArray[i].showHP();
        }
    }

}

function animatePlayer() {
    player.attack();

    player.shootProjectile();

    for(let i = 0; i < player.projectilesArray.length; i++) {
        player.projectilesArray[i].update();
        if(player.projectilesArray[i] != undefined) {
            if(!player.projectilesArray[i].checkShot()) {
            player.projectilesArray[i].draw();
        }
        }
        
    }

    player.draw();
}

const HP = document.querySelector('.HP');

const SCORE = document.querySelector('.SCORE');

const WAVE = document.querySelector('.WAVE')

var difficulty = 0;

var waveNumb = 0;

//show stats

function updateInfo() {
    if(player.hp > 0) {
        HP.innerText = player.hp + "/200";
        HP.style.width = (400 * player.hp/200) + "px";

    } else {
        HP.innerText = "0/200"
        HP.style.width = "0px"
    }

    WAVE.innerText = "Wave: " + waveNumb;
    SCORE.innerText = "Score: " + gameScore;
    difficulty = SCORE%1000;

}

let fps, fpsInterval, startTime, now, then, elapsed;


function startAnimating(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

//set difficulty

function setDifficulty() {
    
    if(enemiesArray.length < 1) {
        createEnemies(Math.floor(gameScore/500) + 1)
        waveNumb++;
    }
}

//fps setter/game speed

function animate() {

    if(player.hp > 0) {
        requestAnimationFrame(animate);
    } else {
        
    }
    
    now = Date.now();

    elapsed = now - then;

    if(elapsed > fpsInterval) {

        then = now - (elapsed % fpsInterval);

        ctx.clearRect(0,0,innerWidth,innerHeight)

        generateBoard()

        movePlayer();

        animatePlayer()

        animateEnemies();

        setDifficulty();

        updateInfo();
    }
}
setTimeout(() => {
document.querySelector('.tutorial-screen').style.opacity = 0;
}, 5000)
>>>>>>> 08cc0c1 (tutorial added)
startAnimating(60);