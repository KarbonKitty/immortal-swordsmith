(function () {
'use strict';

function randomInt(minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue + 1)) + minValue;
}

var Material = /** @class */ (function () {
    function Material(name, desc, power, visible) {
        this.name = name;
        this.desc = desc;
        this._power = power;
        this.amount = 0;
        this._XP = 0;
        this._level = 0;
        this.isVisible = visible || false;
    }
    Object.defineProperty(Material.prototype, "XP", {
        get: function () {
            return this._XP;
        },
        set: function (XP) {
            this._XP = XP;
            while (this._XP >= 100) {
                this._XP -= 100;
                this._level += 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "power", {
        get: function () {
            return this._power * (Math.pow(1.1, this._level));
        },
        enumerable: true,
        configurable: true
    });
    return Material;
}());
var DesignPower = /** @class */ (function () {
    function DesignPower(name, cost, visibilityCost, constPower, randomPower, isBought, isVisible, isBase) {
        if (isVisible === void 0) { isVisible = false; }
        if (isBase === void 0) { isBase = false; }
        this.name = name;
        this.cost = cost;
        this.visibilityCost = visibilityCost;
        this.constPower = constPower;
        this.randomPower = randomPower;
        this.isBought = isBought;
        this.isVisible = isVisible;
        this.isBase = isBase;
    }
    return DesignPower;
}());
var Design = /** @class */ (function () {
    function Design(name, desc, materialUsed, powers) {
        this.name = name;
        this.desc = desc;
        this.materialUsed = materialUsed;
        this.powers = powers;
        this.XP = 0;
    }
    Object.defineProperty(Design.prototype, "power", {
        get: function () {
            var totalPower = 0;
            this.powers.forEach(function (p) {
                if (p.isBought) {
                    totalPower += p.constPower;
                    totalPower += randomInt(0, p.randomPower);
                }
            });
            return totalPower;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Design.prototype, "minPower", {
        get: function () {
            return this.powers.reduce(function (b, c) { b += c.isBought ? c.constPower : 0; return b; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Design.prototype, "maxPower", {
        get: function () {
            var minPower = this.minPower;
            return minPower + this.powers.reduce(function (b, c) { b += c.isBought ? c.randomPower : 0; return b; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Design.prototype, "XP", {
        get: function () {
            return this._XP;
        },
        set: function (value) {
            this.powers.forEach(function (p) {
                if (!p.isVisible) {
                    if (p.visibilityCost <= value) {
                        p.isVisible = true;
                    }
                }
            });
            this._XP = value;
        },
        enumerable: true,
        configurable: true
    });
    Design.prototype.buyPower = function (p) {
        if (this.XP >= p.cost && !p.isBought && this.powers.indexOf(p) !== -1) {
            this.XP -= p.cost;
            p.isBought = true;
        }
    };
    return Design;
}());
var MaterialLock = /** @class */ (function () {
    function MaterialLock(material, level) {
        this.isOpen = function () { return material.level >= level; };
    }
    return MaterialLock;
}());
var DesignLock = /** @class */ (function () {
    function DesignLock(power) {
        this.isOpen = function () { return power.isBought; };
    }
    return DesignLock;
}());

var materialStorage = {
    copper: new Material("Copper", "Soft, malleable metal. Not a perfect material for a sword, but easy enough to find - and to work with.", 0.3),
    bronze: new Material("Bronze", "Much harder than copper, and still easy to work with - first metal that makes swords really viable.", 0.5),
    brass: new Material("Brass", "Alloy of copper much better suited for use in melee weapons.", 0.66),
    pigIron: new Material("Pig iron", "Primitive form of cast iron, full of impurities. Still better than copper alloys.", 0.8),
    iron: new Material("Iron", "Hard metal that can be sharpened well. Staple of sword-makers everywhere.", 1),
    primitiveSteel: new Material("Primitive steel", "Better than even very good iron, but rather hard to produce.", 1.2),
    steel: new Material("Steel", "Even harder than iron, and with wider range of properties that can be aquired through alloy additives.", 1.5),
    goodSteel: new Material("Good steel", "Great material for every sword - hard, sharp, and durable.", 1.75),
    mithril: new Material("Mithril", "Light and hard, but not brittle. Almost perfect material for a sword.", 2),
    adamantium: new Material("Adamantium", "Heavy, but extremaly hard and durable, and can be sharpened like no other metal. The best sword material known.", 2.5)
};
var powerStorage = {
    gladius: {
        base: new DesignPower("Base", 0, 0, 5, 10, true, false, true),
        sharp: new DesignPower("Sharp", 10, 0, 3, 3, false),
        newSword: new DesignPower("Unlock Zweihänder", 30, 50, 0, 0, false)
    },
    zweihander: {
        base: new DesignPower("Base", 0, 0, 10, 20, true, false, true),
        sharp: new DesignPower("Sharpen", 20, 10, 5, 5, false)
    }
};
var designStorage = {
    gladius: new Design("Gladius", "Short, wide sword", 12, [powerStorage.gladius.base, powerStorage.gladius.sharp, powerStorage.gladius.newSword]),
    zweihander: new Design("Zweihänder", "Long, heavy sword", 24, [powerStorage.zweihander.base, powerStorage.zweihander.sharp])
};
var materialLocks = {
    bronze: new MaterialLock(materialStorage.copper, 2),
    brass: new MaterialLock(materialStorage.copper, 4),
    pigIron: new MaterialLock(materialStorage.bronze, 3),
    iron: new MaterialLock(materialStorage.pigIron, 3),
    primitiveSteel: new MaterialLock(materialStorage.iron, 5),
    steel: new MaterialLock(materialStorage.primitiveSteel, 4),
    goodSteel: new MaterialLock(materialStorage.steel, 4),
    mithril: new MaterialLock(materialStorage.steel, 7),
    adamantium: new MaterialLock(materialStorage.steel, 10)
};
var designLocks = {
    zweihander: new DesignLock(powerStorage.gladius.newSword)
};
var materials = {
    copper: materialStorage.copper
};
var designs = {
    gladius: designStorage.gladius
};

var gameState = {
    currentTurn: 0,
    lastTurn: 100,
    heroPower: 0,
    evilPower: 100,
    currentDesign: designs.gladius,
    currentMaterial: materials.copper
};
var app = new Vue({
    el: '#game',
    data: {
        materials: materials,
        designs: designs,
        state: gameState
    },
    filters: {
        round: function (v) {
            return v.toPrecision(3) / 1;
        }
    },
    methods: {
        gatherMaterial: function () {
            gameState.currentMaterial.amount += 10;
            passTurn();
        },
        trainWithMaterial: function () {
            gameState.currentMaterial.XP += 10;
            passTurn();
        },
        trainWithDesign: function () {
            gameState.currentDesign.XP += 10;
            passTurn();
        },
        forgeSword: function () {
            gameState.currentMaterial.amount -= gameState.currentDesign.materialUsed;
            gameState.currentMaterial.XP += 10;
            gameState.currentDesign.XP += 10;
            gameState.heroPower += gameState.currentDesign.power * gameState.currentMaterial.power;
            passTurn();
        },
        selectMaterial: function (material) {
            gameState.currentMaterial = materials[material];
        },
        selectDesign: function (design) {
            gameState.currentDesign = designs[design];
        }
    }
});
function unlockMaterials() {
    var unlockedMaterials = [];
    for (var key in materialLocks) {
        if (materialLocks.hasOwnProperty(key)) {
            if (materialLocks[key].isOpen()) {
                unlockedMaterials.push(key);
            }
        }
    }
    unlockedMaterials.forEach(function (id) {
        Vue.set(materials, id, materialStorage[id]);
        delete materialLocks[id];
    }, this);
}
function unlockDesigns() {
    var unlockedDesigns = [];
    for (var key in designLocks) {
        if (designLocks.hasOwnProperty(key)) {
            if (designLocks[key].isOpen()) {
                unlockedDesigns.push(key);
            }
        }
    }
    unlockedDesigns.forEach(function (id) {
        Vue.set(designs, id, designStorage[id]);
        delete designLocks[id];
    }, this);
}
function passTurn() {
    unlockMaterials();
    unlockDesigns();
    gameState.currentTurn++;
    if (gameState.currentTurn >= gameState.lastTurn) {
        alert("You lost!");
    }
}

}());
