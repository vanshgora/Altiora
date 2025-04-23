class Entity {
    constructor(name, XP = 100, wepon = []) {
        this.name = name;
        this.XP = XP;
        this.wepon = wepon;
    }

    attack(weponName, target) {
        const choosenWepon = this.wepon.find((wep) => wep.name === weponName);

        if (choosenWepon.isCharged) {
            const impact = choosenWepon.use();
            target.getImpact(impact);
        }
    }

    addWepon(newWepon) {
        this.wepon.push(newWepon);
    }

    getImpact(impact) {
        this.XP -= impact;
    }
}

class Hero extends Entity {

    attack(weponName, target, game) {
        super.attack(weponName, target);
        if (target.XP <= 0) {
            game.levelUp();
        }
    }
}

class Enemy extends Entity {
    constructor(name, XP, wepon, isBot) {
        super(name, XP, wepon);
        this.isBot = isBot;
    }

    attack(target, game) {
        let randomWepon;

        do {
            randomWepon = this.wepon[Math.floor(Math.random() * this.wepon.length)];
        } while (!randomWepon.isCharged);

        super.attack(randomWepon.name, target);
        if (target.XP <= 0) {
            game.gameOver();
        }
        return randomWepon.name;
    }
}

class Wepon {
    constructor(name, impact, rechargeTime) {
        this.name = name;
        this.impact = impact;
        this.rechargeTime = rechargeTime;
        this.isCharged = true;
    }

    use() {
        this.isCharged = false;
        this.recharge();
        return this.impact;
    }

    recharge() {
        setTimeout(() => {
            this.isCharged = true;
        }, this.rechargeTime);
    }
}

class Game {
    constructor() {
        this.level = 1;
        this.hero = {};
        this.enemy = {};
    }

    start(hero, enemy) {
        this.hero = hero;
        this.enemy = enemy;
    }

    levelUp() {
        this.level++;
        this.hero.XP = 100 + this.level * 50;
        this.enemy.XP = 100 + this.level * 50;
        switch (this.level) {
            case 3:
                const slash = new Wepon("Slash", 25, 3000);
                this.hero.addWepon(slash);

                const fireBall = new Wepon("Fire Ball", 25, 3000);
                this.enemy.addWepon(fireBall);
                break;

            case 5:
                const fire = new Wepon("Fire", 40, 4000);
                this.hero.addWepon(fire);

                const snowBall = new Wepon("Snow Ball", 40, 4000);
                this.enemy.addWepon(snowBall);
                break;
            case 7:
                const fireCanon = new Wepon("Fire Canon", 60, 5000);
                this.hero.addWepon(fire);

                const spellBall = new Wepon("Spell Ball", 60, 5000);
                this.enemy.addWepon(fireBall);
                break;
            case 9:
                const blast = new Wepon("Blast", 60, 5000);
                this.hero.addWepon(fire);

                const deepFrost = new Wepon("Deep Frost", 60, 5000);
                this.enemy.addWepon(fireBall);
                break;
            case 11:
                console.log("You win");
                break;
        }

        const levelUpEvent = new CustomEvent('levelup', {
            detail: { game: this }
        });

        document.dispatchEvent(levelUpEvent);
    }

    gameOver() {
        const gameOverEvent = new CustomEvent('gameover', {
            detail: { game: this }
        });

        document.dispatchEvent(gameOverEvent);

        this.hero = {};
        this.enemy = {};
    }
}

const heroAttackList = document.getElementById('hero-attack-list');
const heroXP = document.getElementById('hero-xp');
const enemyXP = document.getElementById('enemy-xp');
const eventScreen = document.getElementById('event-screen');
const levelDisplay = document.getElementById('level-display');
const startScreen = document.getElementById('start-mode');
const playScreen = document.getElementById('play-mode');
const restartScreen = document.getElementById('restart-mode');
const instructionList = document.getElementById('instruction-list');
const initialTimer = document.getElementById('initial-timer');

let botAttackInterval;
let screenMode = 'start';
const prepTime = 10;

document.addEventListener('levelup', async (e) => {
    const game = e.detail.game;
    createWeponsList(game);
    updateEventScreen('Level Up to ' + game.level);
    clearInterval(botAttackInterval);
    await perpTimer(5);
    setTimeout(() => initiateEnemyAttack(game), 1400);
});

document.addEventListener('gameover', (e) => {
    clearInterval(botAttackInterval);
    setScreenMode('restart');
});

function setScreenMode(mode) {
    if (mode === 'start') {
        startScreen.style.display = 'block';
        playScreen.style.display = 'none';
        restartScreen.style.display = 'none';
    } else if (mode === 'play') {
        startScreen.style.display = 'none';
        playScreen.style.display = 'block';
        restartScreen.style.display = 'none';
    } else if (mode === 'restart') {
        startScreen.style.display = 'none';
        playScreen.style.display = 'none';
        restartScreen.style.display = 'block';
    }
}

function updateXPBar(game) {
    heroXP.textContent = game.hero.name + ' XP:- ' + game.hero.XP;
    enemyXP.textContent = game.enemy.name + ' XP:- ' + game.enemy.XP;
}

function updateEventScreen(text) {
    eventScreen.textContent = text;
}

function perpTimer(prepTime) {
  initialTimer.style.display = 'flex';
    for(let li of heroAttackList.children) {
       li.firstChild.disabled = true;
    }
   
    const startPlay = new Promise((resolve) => {
        let initialTime = prepTime;
        initialTimer.textContent = initialTime;
        const startTimerInterval = setInterval(() => {
            initialTime--;
            initialTimer.textContent = initialTime;
            if (initialTime <= 0) {
                initialTimer.textContent = '';
                clearInterval(startTimerInterval);
                for(let li of heroAttackList.children) {
                    li.firstChild.disabled = false;
                }
                initialTimer.style.display = 'none';
                resolve();
            }
        }, 1000);
    });

    return startPlay;
}

function initiateEnemyAttack(game) {
    botAttackInterval = setInterval(() => {
        const weponName = game.enemy.attack(game.hero, game);
        updateXPBar(game);
        if(game.enemy.wepon) {
            updateEventScreen("Enemy used " + weponName + ' with impact of ' + game.enemy.wepon.find(w => w.name === weponName).impact);
        }
    }, 1500);
}

function createInitialEntity() {
    const punch = new Wepon("punch", 5, 1000);
    const kick = new Wepon('Kick', 15, 2000);
    let heroName = '';
    while (heroName.length <= 4) {
        heroName = prompt('Enter your name');
        if (heroName.length <= 4) {
            alert('Name must be atleast 5 charator long');
        }
    }
    const hero = new Hero(heroName, 100, [punch, kick]);
    const spell = new Wepon("Spell", 5, 1000);
    const Jinx = new Wepon("Jinx", 15, 2000);
    const isBot = true;
    const enemy = new Enemy("Enemy", 100, [spell, Jinx], isBot);

    return [hero, enemy];
}

function createWeponsList(game) {
    heroAttackList.innerHTML = '';
    game.hero.wepon.forEach(wepon => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        const rechargeTimerSpan = document.createElement('span');
        btn.setAttribute('name', wepon.name);
        btn.textContent = wepon.name;
        rechargeTimerSpan.textContent = wepon.rechargeTime / 1000;

        btn.addEventListener('click', (e) => {
            const weponName = e.target.getAttribute('name');
            const wepon = game.hero.wepon.find(w => w.name === weponName);
            updateEventScreen('Hero used ' + weponName + 'with impact of ' + wepon.impact);
            game.hero.attack(weponName, game.enemy, game);
            updateXPBar(game);
            levelDisplay.textContent = 'Level:- ' + game.level;
            e.target.disabled = true;
            setInterval(() => { e.target.disabled = false }, game.hero.wepon.find(w => w.name === weponName).rechargeTime);
            let timeLeft = wepon.rechargeTime;
            let rechargeClockId = setInterval(() => {
                timeLeft -= 1000;
                rechargeTimerSpan.textContent = timeLeft / 1000;
                if (timeLeft < 0) {
                    clearInterval(rechargeClockId);
                    rechargeTimerSpan.textContent = wepon.rechargeTime / 1000;
                }
            }, 1000);
        });

        li.append(btn);
        li.append(rechargeTimerSpan);
        heroAttackList.append(li);
    });
}

async function play() {
    const game = new Game();
    const [hero, enemy] = createInitialEntity();
    game.start(hero, enemy);

    setScreenMode('play');
    createWeponsList(game);
    updateXPBar(game);

    await perpTimer(5);

    setTimeout(() => initiateEnemyAttack(game), 1500);
}

function restart() {
    setScreenMode('start');
};