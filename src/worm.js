export default class Worm {
  constructor(x = 0, y = 0, length = 1) {
    // eslint-disable-next-line no-multi-assign
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
    this.add(this.head.x, this.head.y - 1);
  }

  moveDown() {
    this.add(this.head.x, this.head.y + 1);
  }

  getLength() {
    return this.length;
  }

  setLength(length = 1) {
    this.length = length;
  }

  add(x = 0, y = 0) {
    const temp = { x, y, next: this.head };
    this.head = temp;
    return temp;
  }

  grow(segments) {
    for (let x = 0; x < segments; x++) {
      const temp = { x: this.tail.x, y: this.tail.y, next: null };
      this.tail.next = temp;
      this.tail = temp;
    }
    this.length += segments;
  }
}
