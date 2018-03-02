import { randomInt } from './randomExtension'

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

export { ILock, MaterialLock, DesignLock, Material, Design, DesignPower }