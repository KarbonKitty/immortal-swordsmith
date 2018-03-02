function randomInt(minValue: number, maxValue: number) {
  return Math.floor(Math.random() * (maxValue + 1)) + minValue;
}

export { randomInt }