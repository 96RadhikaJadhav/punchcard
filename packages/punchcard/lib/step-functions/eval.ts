import { ShapeOrRecord, Value } from '@punchcard/shape';
import { State } from './state';
import { Task } from './task';
import { Thing } from './thing';

// tslint:disable: unified-signatures

export function $<T extends Task.DSL>(task: T): Task.GetDSL<T>;

/**
 * Evaluate a Thing expression and discard its output.
 *
 * @param thing
 */
export function $<T extends Thing>(thing: T): Generator<unknown, void>;

/**
 * Overwrite a value in state with the result of a Thing.
 *
 * @param state state to overwrite
 * @param eq '=' token
 * @param thing result/value to save in state
 */
export function $<S extends State>(state: S, eq: '=', thing: State.GetThing<S>): Generator<unknown, void>;

/**
 * Overwrite a value in state with a literal value.
 *
 * @param state state to overwrite
 * @param assign '=' token (indicating the assign command)
 * @param literal literal value of the state's type.
 */

export function $<S extends State>(state: S, assign: '=', literal: Value.Of<State.GetShape<S>>): Generator<unknown, void>;

/**
 * Declare a new state variable by coping the value of an existing value in state.
 *
 * Type of state is inferred from the copied value.
 *
 * This statement compiles to a Pass state.
 *
 * ```ts
 * const a = $('a', '=', 'string');
 *
 * // type of b is inferred from a
 * const b = $('b', '=', a);
 * ```
 *
 * @param id if of the declared state variable
 * @param assign '=' token
 * @param state reference to state to copy value from
 */
export function $<ID extends string, T extends Thing>(id: ID, assign: '=', state: State<T>): State<T, ID>;

/**
 * Declare a new state variable by copying the value of an existing value in state. Type is
 * explicitly defined, as opposed to the inferred approach `$(id, '=', state);
 *
 * This statement compiles to a Pass state.
 *
 * ```ts
 * const a = $('a', '=', 'string');
 *
 * // type of b is explicitly a string
 * const b = $('b', ':', string, '=', a);
 * ```
 *
 * @param id id of the new state variable
 * @param is ':' token, meaning state is of this type.
 * @param type type of the state
 * @param eq '=' token
 * @param state the state to copy from
 */
export function $<ID extends string, T extends ShapeOrRecord>(id: ID, is: ':', type: T, eq: '=', state: State<Thing.Of<T>>): Generator<unknown, State<Thing.Of<T>, ID>>;

export function $<ID extends string, T extends Thing>(id: ID, eq: '=', thing: T): Generator<unknown, State<T, ID>>;

export function $<ID extends string, V>(id: ID, eq: '=', value: V): Generator<unknown, State<Thing.Of<Value.InferShape<V>>, ID>>;
/**
 * Declare a variable of some type with an undefined value.
 * @param id id of the variable
 * @param is ':' token
 * @param type type of this variable
 */
export function $<ID extends string, T extends ShapeOrRecord>(id: ID, is: ':', type: T): Generator<unknown, State<Thing.Of<T>, ID>>;

/**
 * Declare multiple variables by name and type.
 *
 * ```ts
 * const { a, b } = $({
 *   a: string,
 *   b: array(string)
 * });
 * ```
 * @param vars variables to declare
 */
export function $<V extends Vars>(vars: V): Generator<unknown, {
  [ID in Extract<keyof V, string>]: State<Thing.Of<V[ID]>, ID>;
}>;

/**
 * Declare a variable of some type and assign an initial value to some literal.
 *
 * Depending on the expression, this could either result in:
 * 1) a Pass state to assign the value in the root state object.
 * 2) a series of state transitions, eventually outputting a value to the root state object.
 *
 * ```ts
 * const a = $('a', ':', string, '=', 'a string');
 * // TS equiv.
 * const a: string = 'a string';
 * ```
 *
 * @param id
 * @param is
 * @param type
 * @param eq
 * @param value
 */
export function $<ID extends string, T extends ShapeOrRecord>(id: ID, is: ':', type: T, eq: '=', value: Value.Of<T>): Generator<unknown, State<Thing.Of<T>, ID>>;

export function $<V extends State>(state: V): State.GetThing<V>;

/**
 * Evaluate a sequence of tokens and produce a statement in the current scope.
 *
 * @param tokens sequence of tokens representing the statement.
 */
export function $(...tokens: any[]): any {
  return null as any;
}

export interface Vars {
  [id: string]: ShapeOrRecord;
}