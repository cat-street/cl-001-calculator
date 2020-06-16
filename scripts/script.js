const currentOutput = document.querySelector('.calculator__screen');
const numberButtons = document.querySelectorAll('.button_type_number');
const operationButtons = document.querySelectorAll('.button_type_operation');
const resetButton = document.querySelector('.button_type_reset');
const defaultResult = 0;

let resultBeforeCalc = defaultResult;
let currentResult = defaultResult;
let operator = null;
let currentOperator = null;

const printNumber = (numb) => {
  let output = currentOutput.value;
  // If operation button was pressed
  if (currentOperator) {
    operator = currentOperator;
    currentOperator = null;
    currentOutput.value = '';
  }
  // Only one decimal point allowed, removing front zero
  if (numb === '.') {
    if (output.indexOf(numb) !== -1) return;
  } else if (output === '0') currentOutput.value = '';

  currentOutput.value += numb;
}

const calculate = (firstNum, sign, secondNum) => {
  switch (sign) {
    case 'ADD':
      return firstNum + secondNum;
    case 'SUBTRACT':
      return firstNum - secondNum;
    case 'MULTIPLY':
      return firstNum * secondNum * 10 / 10;
    case 'DIVIDE':
      return firstNum / secondNum * 10 / 10;
    case 'RESULT':
      console.log('HEY' + firstNum + ' ' + sign + ' ' + secondNum);
      return firstNum;
  }
}

const addOperator = (sign) => {
  // If previous number stored
  if (resultBeforeCalc) {
    currentResult = parseFloat(currentOutput.value);
    currentOutput.value = calculate(resultBeforeCalc, operator, currentResult);
  }
  resultBeforeCalc = parseFloat(currentOutput.value);
  currentOperator = sign;
}

const reset = () => {
  resultBeforeCalc = defaultResult;
  currentResult = defaultResult;
  operator = null;
  currentOperator = null;
  currentOutput.value = defaultResult;
}

for (let el of numberButtons) {
  el.addEventListener('click', printNumber.bind(this, el.textContent));
};
for (let el of operationButtons) {
  el.addEventListener('click', addOperator.bind(this, el.value));
};
resetButton.addEventListener('click', reset);
