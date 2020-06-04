export default class Worm {
  constructor(x = 0, y = 0, length = 1) {
    this.head = this.tail = this.add(x, y);
    this.length = length;
  }

  moveRight() {
    this.add(this.head.x + 1, this.head.y);
  }

  moveLeft() {
    this.add(this.head.x - 1, this.head.y);
  }

  moveUp() {
    this.add(this.head.x, this.head.y + 1);
  }

  moveDown() {
    this.add(this.head.x, this.head.y - 1);
  }

  getLength() {
    return this.length;
  }

  setLength(length = 1) {
    this.length = length;
  }

  add(x = 0, y = 0) {
    let temp = { x, y, next: this.head };
    this.head = temp;
    return temp;
  }

  removeTail() {
    let node = this.head;
    let prev = null;
    for (let x = 0; x < this.length; x++) {
      prev = node;
      node = node.next;
    }
    this.tail = prev;
    this.tail.next = null;
  }
}
