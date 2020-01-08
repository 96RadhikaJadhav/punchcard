import { Shape } from '@punchcard/shape';
import { Equals } from './equals';
import { HashCode } from './hash-code';
import { Runtime } from './runtime';

export class HashSet<T extends Shape> {
  public readonly [Symbol.toStringTag]: 'HashSet' = 'HashSet';

  public size: number = 0;

  private readonly map = new Map<number, Array<Runtime.Of<T>>>();

  private readonly itemEquals: Equals<T>;
  private readonly itemHashCode: HashCode<T>;

  constructor(public readonly itemType: T) {
    this.itemEquals = Equals.of(itemType) as Equals<T>;
    this.itemHashCode = HashCode.of(itemType) as HashCode<T>;
  }

  public add(value: Runtime.Of<T>): this {
    const hashCode = this.itemHashCode(value);
    if (this.map.has(hashCode)) {
      const values = this.map.get(hashCode)!;
      if (values.find(v => this.itemEquals(value, v) === undefined)) {
        values.push(value);
        this.size += 1;
      }
    } else {
      this.map.set(hashCode, [value]);
      this.size += 1;
    }
    return this;
  }

  public has(value: Runtime.Of<T>): boolean {
    const hashCode = this.itemHashCode(value);
    return this.map.has(hashCode) && this.map.get(hashCode)!.find(v => this.itemEquals(value, v)) !== undefined;
  }

  public delete(value: Runtime.Of<T>): boolean {
    const hashCode = this.itemHashCode(value);
    if (this.map.has(hashCode)) {
      const arr = this.map.get(hashCode)!;
      for (let i = 0; i < arr.length; i++) {
        if (this.itemEquals(value, arr[i])) {
          arr.splice(i, 1);
          this.size -= 1;
          return true;
        }
      }
    }
    return false;
  }

  public clear(): void {
    this.map.clear();
    this.size = 0;
  }

  public *[Symbol.iterator](): IterableIterator<Runtime.Of<T>> {
    for (const arr of this.map.values()) {
      for (const v of arr) {
        yield v;
      }
    }
  }

  public *entries(): IterableIterator<[Runtime.Of<T>, Runtime.Of<T>]> {
    for (const arr of this.map.values()) {
      for (const v of arr) {
        yield [v, v];
      }
    }
  }

  public keys(): IterableIterator<Runtime.Of<T>> {
    return this[Symbol.iterator]();
  }

  public values(): IterableIterator<Runtime.Of<T>> {
    return this[Symbol.iterator]();
  }

  public forEach(callbackfn: (value: Runtime.Of<T>, value2: Runtime.Of<T>, set: Set<Runtime.Of<T>>) => void, thisArg?: any): void {
    for (const v of this.values()) {
      if (thisArg) {
        callbackfn.call(thisArg, v, v, this);
      } else {
        callbackfn(v, v, this);
      }
    }
  }
}