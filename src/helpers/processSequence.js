/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import * as R from "ramda";
import Api from "../tools/api";

// --- Создание экземпляра API ---
const api = new Api();

// --- Математические операции ---
const isValueLessThan10 = R.lt(R.__, 10);
const isValueGreaterThan2 = R.gt(R.__, 2);
const squareValue = (value) => value ** 2;
const squareAndThen = R.andThen(squareValue);

// --- Проверка входных данных ---
const hasLengthGreaterThan2 = R.compose(isValueGreaterThan2, R.length);
const hasLengthLessThan10 = R.compose(isValueLessThan10, R.length);
const isNumericString = R.test(/^[0-9]+\.?[0-9]+$/);

// --- Дополнительные функции ---
const roundNumber = R.compose(Math.round, Number);
const calculateModulo3 = R.compose(String, R.mathMod(R.__, 3));
const applyModulo3 = R.andThen(calculateModulo3);
const getLength = R.andThen(R.length);

const isValidInput = R.allPass([
  hasLengthGreaterThan2,
  hasLengthLessThan10,
  isNumericString,
]);

// --- Работа с API ---
const NUMBERS_API_URL = "https://api.tech/numbers/base";
const ANIMALS_API_URL = "https://animals.tech/";

const fetchResult = R.compose(String, R.prop("result"));
const toBinaryRequest = R.assoc("number", R.__, { from: 10, to: 2 });
const getBinaryNumber = R.compose(api.get(NUMBERS_API_URL), toBinaryRequest);
const fetchResultAndThen = R.andThen(fetchResult);
const buildAnimalUrl = R.andThen(R.concat(ANIMALS_API_URL));
const callApiWithEmptyParams = R.andThen(api.get(R.__, {}));

// --- Логический обработчик последовательности ---
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const handleSuccessAndThen = R.andThen(handleSuccess);
  const handleErrorAndThen = R.otherwise(handleError);
  const handleValidationError = R.partial(handleError, ["ValidationError"]);

  const tapWriteLog = R.tap(writeLog);
  const tapLogAndThen = R.andThen(tapWriteLog);

  const processSequencePipeline = R.compose(
    handleErrorAndThen,
    handleSuccessAndThen,
    fetchResultAndThen,
    callApiWithEmptyParams,
    buildAnimalUrl,
    tapLogAndThen,
    applyModulo3,
    tapLogAndThen,
    squareAndThen,
    tapLogAndThen,
    getLength,
    tapLogAndThen,
    fetchResultAndThen,
    getBinaryNumber,
    tapWriteLog,
    roundNumber
  );

  const run = R.ifElse(
    isValidInput,
    processSequencePipeline,
    handleValidationError
  );

  const logAndRun = R.compose(run, tapWriteLog);

  logAndRun(value);
};

export default processSequence;
