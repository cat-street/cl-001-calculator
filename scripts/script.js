'use strict';

const currentOutput = document.querySelector('.calculator__screen');
const numberButtons = document.querySelectorAll('.button_type_number');
const operationButtons = document.querySelectorAll('.button_type_operation');
const resetButton = document.querySelector('.button_type_reset');
const resultButton = document.querySelector('.button_type_result');
const advancedButtons = document.querySelectorAll('.button_type_advanced');
const memoryButtons = document.querySelectorAll('.button_type_memory');

const buttons = { operationButtons, advancedButtons, memoryButtons };

let firstValue = null;
let secondValue = null;
let finalResult = null;
let operator = null;
let currentOperator = null;
let memory = 0;
let memoryAdded = false;

const getNumber = () => currentOutput.value;
const setNumber = value =>
  (currentOutput.value = value.toString().slice(0, 24));

const printNumber = numb => {
  let output = getNumber();
  // Reset on error or new calculation
  if (output === 'Error' || (finalResult && !currentOperator)) {
    reset();
    output = '';
  }
  // Disable adding to input if operation button was pressed
  if (currentOperator) {
    operator = currentOperator;
    currentOperator = null;
    output = '';
  }
  // Disable adding to input after memory operation
  if (memoryAdded) {
    memoryAdded = false;
    output = '';
  }
  // Only one decimal point allowed, removing leading zero
  if (numb === '.') {
    if (output.indexOf(numb) !== -1) return;
  } else if (output === '0') output = '';

  setNumber((output += numb));
};

//TODO Disable buttons on error
//TODO Disable multiple operations
const addOperator = sign => {
  if (getNumber() === 'Error') return;
  // Setting up first number
  if (!firstValue) firstValue = parseFloat(getNumber());
  // Operation pressed more than once
  else if (!finalResult) {
    secondValue = parseFloat(getNumber());
    showResult();
  }
  // Setting up signal for continuing equation
  currentOperator = sign;
  // Resetting equals button behaviour
  finalResult = null;
};

const calculate = (firstNum, secondNum, sign) => {
  switch (sign) {
    case 'ADD':
      return firstNum + secondNum;
    case 'SUBTRACT':
      return firstNum - secondNum;
    case 'MULTIPLY':
      // Floating point precision fix
      return +math.multiply(
        math.bignumber(firstNum),
        math.bignumber(secondNum)
      );
    case 'DIVIDE':
      return +math.divide(math.bignumber(firstNum), math.bignumber(secondNum));
  }
};

const showResult = () => {
  // Setting up second number if operation pressed more than once
  if (!finalResult) secondValue = parseFloat(getNumber());
  // Forbid dividing by 0
  if (operator === 'DIVIDE' && secondValue === 0) {
    setNumber('Error');
    return;
  }
  if (
    (firstValue || firstValue === 0) &&
    (secondValue || secondValue === 0) &&
    operator
  ) {
    finalResult = calculate(firstValue, secondValue, operator);
    setNumber(finalResult);
    // Changing the result for following calculations
    firstValue = parseFloat(getNumber());
  }
};

const modifyValue = action => {
  const currentValue = getNumber();
  let newValue;
  if (currentValue) {
    switch (action) {
      case 'NEGATE':
        newValue = -currentValue;
        // Adding to memory
        if (firstValue) firstValue = newValue;
        break;
      case 'SQUARE':
        // Prevent for negative numbers
        if (currentValue >= 0) {
          newValue = +math.sqrt(math.bignumber(currentValue));
          //TODO Prevent adding to the current value
          // finalResult = newValue;
        } else {
          setNumber('Error');
          return;
        }
        break;
      case 'PERCENT':
        newValue = +math.multiply(math.bignumber(currentValue), 0.01);
        //TODO Prevent adding to the current value
        // finalResult = newValue;
        break;
      case 'BACKSPACE':
        if (currentValue.length > 1) {
          newValue = currentValue.slice(0, -1);
          // Adding to memory
        } else newValue = 0;
        if (firstValue) firstValue = newValue;
    }
  }
  setNumber(newValue);
};

//TODO Fix double memory recall
//TODO Clearing memory
const accessMemory = value => {
  switch (value) {
    case 'MPLUS':
      memory += parseFloat(getNumber());
      // Prevent adding to input
      memoryAdded = true;
      break;
      case 'MMINUS':
        memory -= parseFloat(getNumber());
        // Prevent adding to input
        memoryAdded = true;
      break;
    case 'MRC':
      setNumber(memory);
      // On double recall without new input
      if (currentOperator) operator = currentOperator;
      if (!secondValue) {
        secondValue = memory;
        operator = currentOperator;
        currentOperator = null;
        finalResult = memory;
      }
  }
};

const reset = () => {
  firstValue = null;
  secondValue = null;
  finalResult = null;
  operator = null;
  currentOperator = null;
  currentOutput.value = 0;
  memory = 0;
  memoryAdded = false;
};

const switchButtons = () => {
  for (const arr in buttons) {
    let func;
    for (const el of buttons[arr]) {
      switch (arr) {
        case 'operationButtons':
          func = addOperator;
          break;
        case 'advancedButtons':
          func = modifyValue;
          break;
        case 'memoryButtons':
          func = accessMemory;
      }
      const binder = func.bind(this, el.value);
      el.addEventListener('click', binder);
    }
  }
};

for (const el of numberButtons) {
  el.addEventListener('click', printNumber.bind(this, el.value));
}
resetButton.addEventListener('click', reset);
resultButton.addEventListener('click', showResult);
switchButtons();
