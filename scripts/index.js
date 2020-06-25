'use strict';

const buttons = document.querySelectorAll('.button');
const currentOutput = document.querySelector('.calculator__screen');
const result = [];
let currentOperator = null;
let operator = null;
let equalsPressed = false;
let secondValue = null;

// Return the number currently on screen
const getOutput = () => +currentOutput.value;
// Convert & set the number on screen
const setOutput = value =>
  (currentOutput.value = value.toString().slice(0, 24));


const printNumber = value => {
  // New calculation after pressing 'EQUALS'
  if (equalsPressed) reset();
  // If operator was pressed clear the screen
  if (currentOperator) {
    operator = currentOperator;
    currentOperator = null;
    setOutput('');
  }
  // Print the number if typed
  if (getOutput() === 0) currentOutput.value = value;
  else currentOutput.value += value;
}

const addOperator = operation => {
  // Prevent logging of multiple operation pressing
  if (currentOperator) return;
  // Ability to continue calculation after 'EQUALS' operation
  if (equalsPressed) operator = null;
  // Continue calculation without 'EQUALS' pressed
  if (operator) calculateResult();
  // Clear 'calculation complete' flag
  equalsPressed = false;
  // Add to the log
  result.push(getOutput(), operation);
  // Save the operator for the calculation
  currentOperator = operation;
}

const calculateResult = () => {
  // Memorize result if 'EQUALS' pressed again
  if (equalsPressed) result.push(getOutput(), operator);
  // Setting up values for the calculation
  else secondValue = parseFloat(getOutput());
  const firstValue = parseFloat(result[result.length - 2]);
  let resultValue = null;
  switch (operator) {
    case 'ADD':
      resultValue = firstValue + secondValue;
      break;
    case 'SUBTRACT':
      resultValue = firstValue - secondValue;
      break;
    case 'MULTIPLY':
      resultValue = +math.multiply(math.bignumber(firstValue), math.bignumber(secondValue));
      break;
    case 'DIVIDE':
      resultValue = +math.divide(math.bignumber(firstValue), math.bignumber(secondValue));
      break;
  }
  result.push(secondValue, 'EQUALS');
  // Setting 'calculation complete' flag
  equalsPressed = true;
  console.log(result);
  setOutput(resultValue);
};

const buttonHandler = (type, value) => {
  switch (type) {
    case 'number':
      printNumber(value);
      break;
    case 'operation':
      addOperator(value);
      break;
    case 'equals':
      // If the calculation is in progress
      if (operator) calculateResult();
      break;
    case 'clear':
      reset();
      break
  }
}

const reset = () => {
  currentOperator = null;
  operator = null;
  equalsPressed = false;
  secondValue = null;
  result.length = 0;
  setOutput(0);
};

for (const element of buttons) {
  element.addEventListener('click', function handler() {
    buttonHandler(element.dataset.type, element.value);
  });
}
