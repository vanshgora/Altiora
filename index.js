class Entity {
    constructor(name, XP = 100, sway = []) { //sway: charming cheractorstics
        this.name = name;
        this.XP = XP;
        this.sway = sway;
    }

    attack(index, target) {
        const choosenSway = this.sway[index];

        if (choosenSway.isCharged) {
            const impact = choosenSway.use();
            target.getImpact(impact);
        }
    }

    addSway(newSway) {
        this.sway.push(newSway);
    }

    getImpact(impact) {
        this.XP -= impact;
    }
}

class Hero extends Entity {

    attack(index, target, game) {
        super.attack(index, target);
        if (target.XP <= 0) {
            game.levelUp();
        }
    }
}

class Enemy extends Entity {
    constructor(name, XP, sway, isBot) {
        super(name, XP, sway);
        this.isBot = isBot;
    }

    attack(index, target, game) {
        super.attack(index, target);
        if (target.XP <= 0) {
            game.gameOver();
        }
    }
}

class Sway {
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
        this.enymy = {};
    }

    start(hero, enymy) {
        this.hero = hero;
        this.level = enymy;
    }

    levelUp() {
        this.level++;
        console.log('Level Up to :- ', this.level);
        this.hero.XP = 100 + this.level * 50;
        this.enymy.XP = 100 + this.level * 50;
        switch (this.level) {
            case 3:
                const slash = new Sway("Slash", 25, 3000);
                this.hero.addSway(slash);

                const fireBall = new Sway("Fire Ball", 25, 3000);
                this.enymy.addSway(fireBall);
                break;

            case 5:
                const fire = new Sway("Fire", 40, 4000);
                this.hero.addSway(fire);

                const snowBall = new Sway("Snow Ball", 40, 4000);
                this.enymy.addSway(fireBall);
                break;
            case 7:
                const fireCanon = new Sway("Fire Canon", 60, 5000);
                this.hero.addSway(fire);

                const spellBall = new Sway("Spell Ball", 60, 5000);
                this.enymy.addSway(fireBall);
                break;
            case 9:
                const blast = new Sway("Blast", 60, 5000);
                this.hero.addSway(fire);

                const deepFrost = new Sway("Deep Frost", 60, 5000);
                this.enymy.addSway(fireBall);
                break;
            case 11:
                console.log("You win");
                break;
        }
    }

    gameOver() {
        console.log('Game Over');
        this.hero = {};
        this.enymy = {};
    }
}

const createaInitialEntity = function () {
    const punch = new Sway("punch", 5, 1000);
    const kick = new Sway('Kick', 15, 2000);
    const heroName = prompt('Enter your name');
    const hero = new Hero(heroName, 100, [punch, kick]);

    const spell = new Sway("Spell", 5, 1000);
    const Jinx = new Sway("Jinx", 15, 2000);
    const isBot = true;
    const enymy = new Enemy("Enymy", 100, [spell, Jinx], isBot);

    return [hero, enymy];
}

const play = function () {
    const game = new Game();
    const [hero, enymy] = createaInitialEntity();

    game.start(hero, enymy);
}

const restart = function (game) {
    const [newHero, nerEnymy] = createaInitialEntity();
    game.start(newHero, nerEnymy);
};
