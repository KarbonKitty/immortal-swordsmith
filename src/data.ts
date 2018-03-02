import { randomInt } from './randomExtension'

import { ILock, MaterialLock, DesignLock, Material, Design, DesignPower } from './classes'

let materialStorage = {
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
}

let powerStorage = {
  gladius: {
    base: new DesignPower("Base", 0, 0, 5, 10, true, false, true),
    sharp: new DesignPower("Sharp", 10, 0, 3, 3, false),
    newSword: new DesignPower("Unlock Zweihänder", 30, 50, 0, 0, false)
  },
  zweihander: {
    base: new DesignPower("Base", 0, 0, 10, 20, true, false, true),
    sharp: new DesignPower("Sharpen", 20, 10, 5, 5, false)
  }
}

let designStorage = {
  gladius: new Design("Gladius", "Short, wide sword", 12, [powerStorage.gladius.base, powerStorage.gladius.sharp, powerStorage.gladius.newSword]),
  zweihander: new Design("Zweihänder", "Long, heavy sword", 24, [powerStorage.zweihander.base, powerStorage.zweihander.sharp])
}

let materialLocks = {
  bronze: new MaterialLock(materialStorage.copper, 2),
  brass: new MaterialLock(materialStorage.copper, 4),
  pigIron: new MaterialLock(materialStorage.bronze, 3),
  iron: new MaterialLock(materialStorage.pigIron, 3),
  primitiveSteel: new MaterialLock(materialStorage.iron, 5),
  steel: new MaterialLock(materialStorage.primitiveSteel, 4),
  goodSteel: new MaterialLock(materialStorage.steel, 4),
  mithril: new MaterialLock(materialStorage.steel, 7),
  adamantium: new MaterialLock(materialStorage.steel, 10)
}

let designLocks = {
  zweihander: new DesignLock(powerStorage.gladius.newSword)
}

let materials = {
  copper: materialStorage.copper
}

let designs = {
  gladius: designStorage.gladius
}

export { designs, materials, designLocks, materialLocks, designStorage, powerStorage, materialStorage };