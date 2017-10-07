let gameState = {
  currentTurn: 0,
  lastTurn: 100,
  heroPower: 0,
  evilPower: 100,
  currentDesign: designs.gladius,
  currentMaterial: materials.copper
}

let app = new Vue({
  el: '#game',
  data: {
    materials: materials,
    designs: designs,
    state: gameState
  },
  filters: {
    round: v => {
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
    selectMaterial: material => {
      gameState.currentMaterial = materials[material];
    },
    selectDesign: design => {
      gameState.currentDesign = designs[design];
    }
  }
});

function unlockMaterials() {
  let unlockedMaterials = [];

  for (var key in materialLocks) {
    if (materialLocks.hasOwnProperty(key)) {
      if (materialLocks[key].isOpen()) {
        unlockedMaterials.push(key);
      }
    }
  }

  unlockedMaterials.forEach(id => {
    Vue.set(materials, id, materialStorage[id]);
    delete materialLocks[id];
  }, this);
}

function unlockDesigns() {
  let unlockedDesigns = [];

  for (var key in designLocks) {
    if (designLocks.hasOwnProperty(key)) {
      if (designLocks[key].isOpen()) {
        unlockedDesigns.push(key);
      }
    }
  }

  unlockedDesigns.forEach(id => {
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