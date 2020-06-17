const currentOutput = document.querySelector('.calculator__screen');
const numberButtons = document.querySelectorAll('.button_type_number');
const operationButtons = document.querySelectorAll('.button_type_operation');
const resetButton = document.querySelector('.button_type_reset');
const defaultResult = 0;

let resultBeforeCalc = defaultResult;
let currentResult = defaultResult;
let operator = null;
let currentOperator = null;

const getNumber = () => currentOutput.value;
const setNumber = value => currentOutput.value = value.toString().slice(0, 24);

const printNumber = (numb) => {
  let output = getNumber();
  // Disabling adding to input is the result is shown or Error
  if (currentResult || output === 'Error') {
    reset();
    output = '';
  }
  // Disable adding to input if operation button was pressed
  if (currentOperator) {
    operator = currentOperator;
    currentOperator = null;
    output = '';
  }
  // Only one decimal point allowed, removing front zero
  if (numb === '.') {
    if (output.indexOf(numb) !== -1) return;
  } else if (output === '0') output = '';

  setNumber(output += numb);
}

const addOperator = (sign) => {
  if (getNumber() === 'Error') return;
  if (sign !== 'RESULT') currentOperator = sign;
  // Calculate if two numbers were provided
  if (operator) {
    if (!currentResult) currentResult = parseFloat(getNumber());
    // Error when dividing by 0
    if (operator === 'DIVIDE' && currentResult === 0) {
      setNumber('Error');
      return;
    }
    let finalResult = calculate(resultBeforeCalc, currentResult, operator);
    setNumber(finalResult);
  }
  resultBeforeCalc = parseFloat(getNumber());
}

const calculate = (firstNum, secondNum, sign) => {
  switch (sign) {
    case 'ADD':
      return firstNum + secondNum;
    case 'SUBTRACT':
      return firstNum - secondNum;
    case 'MULTIPLY':
      return math.multiply(math.bignumber(firstNum), math.bignumber(secondNum));
    case 'DIVIDE':
      return math.divide(math.bignumber(firstNum), math.bignumber(secondNum));
  }
}

const reset = () => {
  resultBeforeCalc = defaultResult;
  currentResult = defaultResult;
  operator = null;
  currentOperator = null;
  currentOutput.value = defaultResult;
}

/* const disableOperators = () => {
  for (let el of operationButtons) {
    el.removeEventListener('click', addOperator.bind(this, el.value));
  };
} */

for (let el of numberButtons) {
  el.addEventListener('click', printNumber.bind(this, el.textContent));
};
for (let el of operationButtons) {
  let binder = addOperator.bind(this, el.value);
  el.addEventListener('click', binder);
};
resetButton.addEventListener('click', reset);

