// Create floating shapes for background
function createFloatingShapes() {
    const container = document.getElementById('floatingShapes');
    const shapesCount = 15;
    
    for (let i = 0; i < shapesCount; i++) {
        const shape = document.createElement('div');
        shape.classList.add('shape');
        
        // Random size
        const size = Math.random() * 100 + 50;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        
        // Random position
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100 + 100}%`;
        
        // Random animation duration and delay
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 5;
        shape.style.animationDuration = `${duration}s`;
        shape.style.animationDelay = `${delay}s`;
        
        container.appendChild(shape);
    }
}

// Calculator functionality
class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
                this.updateDisplay();
            });
        });

        // Operator buttons
        document.querySelectorAll('.btn.operator').forEach(button => {
            if (button.innerText !== '±' && button.innerText !== '%') {
                button.addEventListener('click', () => {
                    this.chooseOperation(button.innerText);
                    this.updateDisplay();
                });
            }
        });

        // Equals button
        document.querySelector('.btn.equals').addEventListener('click', () => {
            this.compute();
            this.updateDisplay();
        });

        // Clear button
        document.querySelector('.btn.clear').addEventListener('click', () => {
            this.clear();
            this.updateDisplay();
        });

        // Plus/minus button
        document.querySelector('.btn.operator:nth-child(2)').addEventListener('click', () => {
            this.toggleSign();
            this.updateDisplay();
        });

        // Percentage button
        document.querySelector('.btn.operator:nth-child(3)').addEventListener('click', () => {
            this.chooseOperation('%');
            this.updateDisplay();
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (event.key >= '0' && event.key <= '9') {
                this.appendNumber(event.key);
                this.updateDisplay();
            }
            
            if (event.key === '.') {
                this.appendNumber('.');
                this.updateDisplay();
            }
            
            if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                let operation;
                switch (event.key) {
                    case '+': operation = '+'; break;
                    case '-': operation = '-'; break;
                    case '*': operation = '×'; break;
                    case '/': operation = '÷'; break;
                }
                this.chooseOperation(operation);
                this.updateDisplay();
            }
            
            if (event.key === 'Enter' || event.key === '=') {
                this.compute();
                this.updateDisplay();
            }
            
            if (event.key === 'Escape') {
                this.clear();
                this.updateDisplay();
            }
            
            if (event.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            }
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    createFloatingShapes();
    new Calculator();
});
