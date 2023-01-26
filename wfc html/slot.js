class Slot {
  constructor(numOfOptions, index) {
    this.collapsed = false;
    this.index = index;
    this.possibleModules = numOfOptions; //array of int (0 to modules.length)
  }
}