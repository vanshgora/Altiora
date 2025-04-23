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
        } while(!randomWepon.isCharged);
        
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
        const gameOverEvent = new CustomEvent('gameover', {
            detail: { game: this }
        });

        document.dispatchEvent(gameOverEvent);

        this.hero = {};
        this.enemy = {};
    }
}

export { Game, Hero, Enemy, Wepon}