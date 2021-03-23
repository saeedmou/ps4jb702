//import * as utils from './utils';
// Taken from https://github.com/saelo/jscpwn/blob/master/int64.js
//

import { debug_log, hexlify, Struct, unhexlify } from "./utils";

// Copyright (c) 2016 Samuel Groß
export class Int64 {
  bytes = new Uint8Array(8);
  // Some commonly used numbers.
  static Zero = new Int64(0);
  static One = new Int64(1);
  static NegativeOne = new Int64(0xffffffff, 0xffffffff);

  // Constructs a new Int64 instance with the same bit representation as the provided double.
  static fromDouble(d) {
    return new Int64(Struct.pack(Struct.float64, d));
  }

  constructor(low, high = null) {
    if (high != null) {
      if (low > 0xffffffff || high > 0xffffffff || low < 0 || high < 0) {
        throw RangeError('Both arguments must fit inside a uint32');
      }
      low = low.toString(16);
      for (let i = 0; i < 8 - low.length; i++) {
        low = '0' + low;
      }
      low = '0x' + high.toString(16) + low;
    }

    switch (typeof low) {
      case 'number':
        low = '0x' + Math.floor(low).toString(16);
      case 'string':
        if (low.substr(0, 2) === '0x') low = low.substr(2);
        if (low.length % 2 == 1) low = '0' + low;
        var bigEndian = unhexlify(low, 8);
        var arr = [];
        for (var i = 0; i < bigEndian.length; i++) {
          arr[i] = bigEndian[i];
        }
        this.bytes.set(arr.reverse());
        break;
      case 'object':
        if (low instanceof Int64) {
          this.bytes.set(low.bytesAsArray());
        } else {
          if (low.length != 8)
            throw TypeError('Array must have excactly 8 elements.');
          this.bytes.set(low);
        }
        break;
      case 'undefined':
        break;
    }
  }

  // Return the underlying bytes of this number as array.
  bytesAsArray() {
    var arr = [];
    for (var i = 0; i < this.bytes.length; i++) {
      arr.push(this.bytes[i]);
    }
    return arr;
  }

  // Return a double whith the same underlying bit representation.
  asDouble() {
    // Check for NaN
    if (
      this.bytes[7] == 0xff &&
      (this.bytes[6] == 0xff || this.bytes[6] == 0xfe)
    )
      throw new RangeError('Can not be represented by a double');

    return Struct.unpack(Struct.float64, this.bytes);
  }

  asInteger() {
    if (this.bytes[7] != 0 || this.bytes[6] > 0x20) {
      debug_log('SOMETHING BAD HAS HAPPENED!!!');
      throw new RangeError('Can not be represented as a regular number');
    }
    return Struct.unpack(Struct.int32, this.bytes);
    /** Mine: int64 changed to int32 */
  }

  // Return a javascript value with the same underlying bit representation.
  // This is only possible for integers in the range [0x0001000000000000, 0xffff000000000000)
  // due to double conversion constraints.
  asJSValue() {
    if (
      (this.bytes[7] == 0 && this.bytes[6] == 0) ||
      (this.bytes[7] == 0xff && this.bytes[6] == 0xff)
    )
      throw new RangeError('Can not be represented by a JSValue');

    // For NaN-boxing, JSC adds 2^48 to a double value's bit pattern.
    //return utils.Struct.unpack(utils.Struct.float64, this.sub(0x1000000000000).bytes());
  }

  // Return the byte at the given index.
  byteAt(i): number {
    return this.bytes[i];
  }

  // Return the value of this number as unsigned hex string.
  toString(): string {
    var arr = [];
    for (var i = 0; i < this.bytes.length; i++) {
      arr.push(this.bytes[i]);
    }
    return '0x' + hexlify(arr.reverse());
  }

  low32() {
    return new Uint32Array(this.bytes.buffer)[0] >>> 0;
  }

  hi32 = function () {
    return new Uint32Array(this.bytes.buffer)[1] >>> 0;
  };

  equals(other) {
    if (!(other instanceof Int64)) {
      other = new Int64(other);
    }
    for (var i = 0; i < 8; i++) {
      if (this.bytes[i] != other.byteAt(i)) return false;
    }
    return true;
  }

  greater(other) {
    if (!(other instanceof Int64)) {
      other = new Int64(other);
    }
    if (this.hi32() > other.hi32()) return true;
    else if (this.hi32() === other.hi32()) {
      if (this.low32() > other.low32()) return true;
    }
    return false;
  }
  // Basic arithmetic.
  // These functions assign the result of the computation to their 'this' object.

  neg() {
    var ret = [];
    for (var i = 0; i < 8; i++) ret[i] = ~this.byteAt(i);
    return new Int64(ret).add(Int64.One);
  }

  add(a: Int64 | any) {
    if (!(a instanceof Int64)) {
      a = new Int64(a);
    }
    var ret = [];
    var carry = 0;
    for (var i = 0; i < 8; i++) {
      var cur = this.byteAt(i) + a.byteAt(i) + carry;
      if (cur > 255) {
        carry = cur;
      } else {
        carry = 0;
      }
      ret[i] = cur;
    }
    return new Int64(ret);
  }

  assignAdd(a) {
    if (!(a instanceof Int64)) {
      a = new Int64(a);
    }
    var carry = 0;
    for (var i = 0; i < 8; i++) {
      var cur = this.byteAt(i) + a.byteAt(i) + carry;
      if (cur > 255) {
        carry = cur;
      } else {
        carry = 0;
      }
      this.bytes[i] = cur;
    }
    return this;
  }

  sub(a) {
    if (!(a instanceof Int64)) {
      a = new Int64(a);
    }

    var ret = [];
    var carry = 0;
    for (var i = 0; i < 8; i++) {
      var cur = this.byteAt(i) - a.byteAt(i) - carry;
      // carry = cur < 0 | 0;
      if (cur < 0) {
        carry = cur;
      } else {
        carry = 0;
      }
      ret[i] = cur;
    }
    return new Int64(ret);
  }
}
