class Entity {
    constructor(name, XP = 100, sway = []) { //sway: charming cheractorstics
        this.name = name;
        this.XP = XP;
        this.sway = sway;
    }

    attack(index, target) {
        if(this.sway[index].isCharged) {
            target.XP -= this.sway[index].impact;
        }
    }
}

class Hero extends Entity {
    constructor() {

    }

    attack(index, target) {
        super.attack(index, target);
        if(target.XP <= 0) {
            console.log("Level Up")
        }
    }
}

class Enemy extends Entity {
    constructor() {

    }

    attack(index, target) {
        super.attack(index, target);
        if(target.XP <= 0) {
            console.log("Game Over")
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
}

let level = 1;

let isGameOver = false;
