import * as data from './data';
var gameState = {
    currentTurn: 0,
    lastTurn: 100,
    heroPower: 0,
    evilPower: 100,
    currentDesign: data.designs.gladius,
    currentMaterial: data.materials.copper
};
var app = new Vue({
    el: '#game',
    data: {
        materials: data.materials,
        designs: data.designs,
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
            gameState.currentMaterial = data.materials[material];
        },
        selectDesign: function (design) {
            gameState.currentDesign = data.designs[design];
        }
    }
});
function unlockMaterials() {
    var unlockedMaterials = [];
    for (var key in data.materialLocks) {
        if (data.materialLocks.hasOwnProperty(key)) {
            if (data.materialLocks[key].isOpen()) {
                unlockedMaterials.push(key);
            }
        }
    }
    unlockedMaterials.forEach(function (id) {
        Vue.set(data.materials, id, data.materialStorage[id]);
        delete data.materialLocks[id];
    }, this);
}
function unlockDesigns() {
    var unlockedDesigns = [];
    for (var key in data.designLocks) {
        if (data.designLocks.hasOwnProperty(key)) {
            if (data.designLocks[key].isOpen()) {
                unlockedDesigns.push(key);
            }
        }
    }
    unlockedDesigns.forEach(function (id) {
        Vue.set(data.designs, id, data.designStorage[id]);
        delete data.designLocks[id];
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
