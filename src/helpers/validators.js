/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  __,
  allPass,
  any,
  compose,
  complement,
  countBy,
  dissoc,
  equals,
  identity,
  gte,
  prop,
  propEq,
  values,
} from "ramda";

import { SHAPES, COLORS } from "../constants";

// Константы
const { TRIANGLE, SQUARE, CIRCLE, STAR } = SHAPES;
const { RED, BLUE, ORANGE, GREEN, WHITE } = COLORS;

// Функции для проверки наличия цвета у фигуры
const isRed = equals(RED);
const isGreen = equals(GREEN);
const isWhite = equals(WHITE);
const isBlue = equals(BLUE);
const isOrange = equals(ORANGE);

// Функция для удаления свойства 'white' из объекта
const dissocWhite = dissoc(WHITE);

// Функции для получения количества фигур определенного цвета
const numOfColors = compose(countBy(identity), values);

// Функции для проверки количества цветов
const gte2 = gte(__, 2);
const gte3 = gte(__, 3);
const anyGte3 = any(gte3);
const anyValueGte3 = compose(anyGte3, values);

// Функции для получения свойства фигуры
const getShapeProp = prop(__);
const getTriangleShape = getShapeProp(TRIANGLE);
const getSquareShape = getShapeProp(SQUARE);
const getCircleShape = getShapeProp(CIRCLE);
const getStarShape = getShapeProp(STAR);

// ---Функции для проверки цвета фигуры---

// Красный
const isRedStar = compose(isRed, getStarShape);

// Оранжевый
const isOrangeSquare = compose(isOrange, getSquareShape);
const isOrangeTriangle = compose(isOrange, getTriangleShape);
const isOrangeCircle = compose(isOrange, getCircleShape);
const isOrangeStar = compose(isOrange, getStarShape);

// Зеленый
const isGreenSquare = compose(isGreen, getSquareShape);
const isGreenTriangle = compose(isGreen, getTriangleShape);
const isGreenCircle = compose(isGreen, getCircleShape);
const isGreenStar = compose(isGreen, getStarShape);

// Синий
const isBlueCircle = compose(isBlue, getCircleShape);

// Белый
const isWhiteCircle = compose(isWhite, getCircleShape);
const isWhiteTriangle = compose(isWhite, getTriangleShape);
const isWhiteStar = compose(isWhite, getStarShape);
const isWhiteSquare = compose(isWhite, getSquareShape);

// Проверки на несовпадение цвета
const isNotWhiteTriangle = complement(isWhiteTriangle);
const isNotRedStar = complement(isRedStar);
const isNotWhiteStar = complement(isWhiteStar);
const isNotWhiteSquare = complement(isWhiteSquare);

// Функции для проверки количества цветов
const greenEq2 = propEq(GREEN, 2);
const greenColorsEq2 = compose(greenEq2, numOfColors);
const redEq1 = propEq(RED, 1);
const redColorsEq1 = compose(redEq1, numOfColors);

// Функции для проверки количества цветов с удалением 'white'
const getGreen = prop(GREEN);
const numOfGreenColors = compose(getGreen, numOfColors);
const numOfColorsWithoutWhite = compose(dissocWhite, numOfColors);

// Функции для проверки условий
const squareColorEqualsTriangleColor = ({ square, triangle }) =>
  square === triangle;
const redAmountEqualsBlueAmount = ({ blue, red }) => blue === red;

// ---Валидации---

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isRedStar,
  isGreenSquare,
  isWhiteTriangle,
  isWhiteCircle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(gte2, numOfGreenColors);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(redAmountEqualsBlueAmount, numOfColors);

// 4. Синий круг, красная звезда, оранжевый квадрат.
export const validateFieldN4 = allPass([
  isBlueCircle,
  isRedStar,
  isOrangeSquare,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(anyValueGte3, numOfColorsWithoutWhite);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная.
export const validateFieldN6 = allPass([
  greenColorsEq2,
  isGreenTriangle,
  redColorsEq1,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([
  isOrangeSquare,
  isOrangeTriangle,
  isOrangeCircle,
  isOrangeStar,
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([
  isGreenSquare,
  isGreenTriangle,
  isGreenCircle,
  isGreenStar,
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета.
export const validateFieldN10 = allPass([
  isNotWhiteSquare,
  isNotWhiteTriangle,
  squareColorEqualsTriangleColor,
]);
