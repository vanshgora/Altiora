class Entity {
    constructor(name, XP = 100, wepon = []) { //wepon: charming cheractorstics
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
        const randomWepon = this.wepon[Math.floor(Math.random() * this.wepon.length)].name;
        super.attack(randomWepon, target);
        if (target.XP <= 0) {
            game.gameOver();
        }
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
                this.enemy.addWepon(fireBall);
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
        console.log('Game Over');
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

let screenMode = 'start';

function setScreenMode(mode) {
    if (mode === 'start') {
        startScreen.style.display = 'block';
        playScreen.style.display = 'none';
        restartScreen.style.display = 'none';
    } else if (mode === 'play') {
        startScreen.style.display = 'none';
        playScreen.style.display = 'block';
        restartScreen.style.display = 'none';
    } else if (mode === 'start') {
        startScreen.style.display = 'none';
        playScreen.style.display = 'none';
        restartScreen.style.display = 'block';
    }
}

function updateXPBar(game) {
    heroXP.textContent = 'Hero XP:-' + game.hero.XP;
    enemyXP.textContent = 'Enemy XP:-' + game.enemy.XP;
}

document.addEventListener('levelup', (e) => {
    const game = e.detail.game;
    createWeponsList(game);
    updateEventScreen('Level Up to ' + game.level);
})

function updateEventScreen(text){
    console.log(text)
    eventScreen.textContent = text;
}

const createaInitialEntity = function () {
    const punch = new Wepon("punch", 5, 1000);
    const kick = new Wepon('Kick', 15, 2000);
    const heroName = prompt('Enter your name');
    const hero = new Hero(heroName, 100, [punch, kick]);

    const spell = new Wepon("Spell", 5, 1000);
    const Jinx = new Wepon("Jinx", 15, 2000);
    const isBot = true;
    const enemy = new Enemy("Enemy", 100, [spell, Jinx], isBot);

    return [hero, enemy];
}

function createWeponsList(game) {
    heroAttackList.innerHTML='';
    game.hero.wepon.forEach(wepon => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.setAttribute('name', wepon.name);
        btn.textContent = wepon.name;
        btn.addEventListener('click', (e) => {
            const weponName = e.target.getAttribute('name');
            updateEventScreen('Hero used ' + weponName);
            game.hero.attack(weponName, game.enemy, game);
            updateXPBar(game);
            levelDisplay.textContent = 'Level:- ' + game.level;
            e.target.disabled = true;
            setInterval(() => { e.target.disabled = false }, game.hero.wepon.find(wep => wep.name === weponName).rechargeTime);
        });
        li.append(btn);
        heroAttackList.append(li);
    });
}

let newGame = new Game();

const play = function () {
    const game = new Game();
    const [hero, enemy] = createaInitialEntity();
    game.start(hero, enemy);

    setScreenMode('play');
    createWeponsList(game);
    updateXPBar(game);

    newGame = game;
}

const restart = function (game) {
    const [newHero, newEnemy] = createaInitialEntity();
    game.start(newHero, newEnemy);
};