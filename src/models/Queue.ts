export default class Queue<T> implements Iterable<T> {
  private elements: T[] = [];

  constructor(initialElements: T[] = []) {
    this.elements = initialElements;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.elements[Symbol.iterator]();
  }

  enqueue(element: T) {
    this.elements.push(element);
  }

  dequeue() {
    return this.elements.shift();
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  get peek() {
    return this.elements[0];
  }

  get length() {
    return this.elements.length;
  }

  clear() {
    this.elements = [];
  }
}
