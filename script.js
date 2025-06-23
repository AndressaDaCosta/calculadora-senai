document.addEventListener('DOMContentLoaded', function () {
	const display = document.getElementById('display');
	const buttons = document.querySelectorAll('.button');

	let currentInput = '0';
	let firstOperand = null;
	let operator = null;
	let waitingForSecondOperand = false;

	function updateDisplay() {
		display.textContent = currentInput;
	}

	function inputDigit(digit) {
		if (waitingForSecondOperand) {
			currentInput = digit;
			waitingForSecondOperand = false;
		} else {
			currentInput = currentInput === '0' ? digit : currentInput + digit;
		}
	}

	function inputDecimal() {
		if (waitingForSecondOperand) {
			currentInput = '0,';
			waitingForSecondOperand = false;
			return;
		}

		if (!currentInput.includes(',')) {
			currentInput += ',';
		}
	}

	function handleOperator(nextOperator) {
		const inputValue = parseFloat(currentInput.replace(',', '.'));

		if (firstOperand === null) {
			firstOperand = inputValue;
		} else if (operator) {
			const result = calculate(firstOperand, inputValue, operator);
			currentInput = String(result).replace('.', ',');
			firstOperand = result;
		}

		waitingForSecondOperand = true;
		operator = nextOperator;
	}

	function calculate(firstOperand, secondOperand, operator) {
		switch (operator) {
			case '+':
				return firstOperand + secondOperand;
			case '-':
				return firstOperand - secondOperand;
			case 'x':
				return firstOperand * secondOperand;
			case '/':
				return firstOperand / secondOperand;
			default:
				return secondOperand;
		}
	}

	function resetCalculator() {
		currentInput = '0';
		firstOperand = null;
		operator = null;
		waitingForSecondOperand = false;
	}

	buttons.forEach((button) => {
		button.addEventListener('click', function () {
			const value = this.textContent.trim();

			// Caso seja um número
			if (/[0-9]/.test(value)) {
				inputDigit(value);
				updateDisplay();
			}

			// Caso seja uma operação
			else if (['+', '-', 'x', '/'].includes(value)) {
				handleOperator(value);
				updateDisplay();
			}

			// Caso seja vírgula decimal
			else if (value === ',') {
				inputDecimal();
				updateDisplay();
			}

			// Caso seja igual
			else if (value === '=') {
				if (!operator || firstOperand === null) return;

				const inputValue = parseFloat(currentInput.replace(',', '.'));
				const result = calculate(firstOperand, inputValue, operator);
				currentInput = String(result).replace('.', ',');
				firstOperand = null;
				operator = null;
				waitingForSecondOperand = false;
				updateDisplay();
			}

			// Caso seja limpar (C)
			else if (value === 'C') {
				resetCalculator();
				updateDisplay();
			}
		});
	});
});
