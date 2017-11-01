function randomInt(minValue: number, maxValue: number) {
  return Math.floor(Math.random() * (maxValue + 1)) + minValue;
}

class Material {
  readonly name: string;
  private _power: number;
  amount: number;
  private _XP: number;
  private _level: number;
  desc: string;
  isVisible: boolean;

  constructor(name: string, desc: string, power: number, visible?: boolean) {
    this.name = name;
    this.desc = desc;
    this._power = power;
    this.amount = 0;
    this._XP = 0;
    this._level = 0;
    this.isVisible = visible || false;
  }

  set XP(XP) {
    this._XP = XP;
    while (this._XP >= 100) {
      this._XP -= 100;
      this._level += 1;
    }
  }

  get XP() {
    return this._XP;
  }

  get level() {
    return this._level;
  }

  get power() {
    return this._power * (Math.pow(1.1, this._level));
  }
}

class DesignPower {
  constructor(public name: string,
    public cost: number,
    public visibilityCost: number,
    public constPower: number,
    public randomPower: number,
    public isBought: boolean,
    public isVisible: boolean = false,
    public isBase: boolean = false) { }
}

class Design {
  name: string;
  desc: string;
  materialUsed: number;
  powers: DesignPower[];
  _XP: number;

  constructor(name, desc, materialUsed, powers) {
    this.name = name;
    this.desc = desc;
    this.materialUsed = materialUsed;
    this.powers = powers;
    this.XP = 0;
  }

  get power() {
    let totalPower = 0;
    this.powers.forEach(p => {
      if (p.isBought) {
        totalPower += p.constPower;
        totalPower += randomInt(0, p.randomPower);
      }
    });
    return totalPower;
  }

  get minPower() {
    return this.powers.reduce((b, c) => { b += c.isBought ? c.constPower : 0; return b; }, 0);
  }

  get maxPower() {
    let minPower = this.minPower;
    return minPower + this.powers.reduce((b, c) => { b += c.isBought ? c.randomPower : 0; return b;}, 0);
  }

  get XP() {
    return this._XP;
  }

  set XP(value: number) {
    this.powers.forEach(p => {
      if (!p.isVisible) {
        if (p.visibilityCost <= value) {
          p.isVisible = true;
        }
      }
    });

    this._XP = value;
  }

  buyPower(p: DesignPower) {
    if (this.XP >= p.cost && !p.isBought && this.powers.indexOf(p) !== -1) {
      this.XP -= p.cost;
      p.isBought = true;
    }
  }
}

interface ILock {
  isOpen: () => boolean;
}

class MaterialLock implements ILock {
  private material: Material;
  private level: number;
  isOpen: () => boolean;

  constructor(material: Material, level: number) {
    this.isOpen = () => material.level >= level;
  }
}

class DesignLock implements ILock {
  private power: DesignPower;
  isOpen: () => boolean;
  
  constructor(power: DesignPower) {
    this.isOpen = () => power.isBought;
  }
}

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

export { designs, materials, designLocks, materialLocks, designStorage, powerStorage, materialStorage, ILock, MaterialLock, DesignLock, DesignPower, Design, Material, randomInt };