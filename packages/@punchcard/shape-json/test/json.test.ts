import 'jest';

import { bool, number, Optional, Shape, string } from '@punchcard/shape';
import { HashSet } from '@punchcard/shape-runtime';
import { Maximum, MaxLength, Minimum, MinLength, MultipleOf, Pattern } from '@punchcard/shape-validation';
import { array, map, set } from '@punchcard/shape/lib/collection';
import { Json } from '../lib/json';

// tslint:disable: member-access

class Nested {
  a = string
    .apply(Optional());
}

class MyType {
  /**
   * Field documentation.
   */
  id = string
    .apply(MaxLength(1))
    .apply(MinLength(0))
    .apply(Pattern('.*'))
    ;

  count = number
    .apply(Maximum(1))
    .apply(Minimum(1, true))
    .apply(MultipleOf(2))
    ;

  boolean = bool;

  nested = Nested;
  array = array(string);
  complexArray = array(Nested);
  set = set(string);
  complexSet = set(Nested);
  map = map(string);
  complexMap = map(Nested);
}

const mapper = Json.mapper(MyType);

const json = {
  id: 'id',
  count: 1,
  boolean: true,
  nested: { a: 'nestaed' },
  array: ['array1', 'arra2'],
  complexArray: [{ a: 'complexArray' }],
  set: ['set1', 'set2'],
  complexSet: [{a: 'complexSet'}],
  map: {
    a: 'map'
  },
  complexMap: {
    key: {
      a: 'complexMap'
    }
  }
};

const runtime = {
  id: 'id',
  count: 1,
  boolean: true,
  nested: { a: 'nestaed' },
  array: ['array1', 'arra2'],
  complexArray: [{ a: 'complexArray' }],
  set: new Set(['set1', 'set2']),
  complexSet: new HashSet(Shape.of(Nested)).add({a: 'complexSet'}),
  map: {
    a: 'map'
  },
  complexMap: {
    key: {
      a: 'complexMap'
    }
  }
};

test('should read shape from json', () => {
  expect(mapper.read(json)).toEqual(runtime);
});

test('should write shape to json', () => {
  expect(mapper.write(runtime)).toEqual(json);
});
