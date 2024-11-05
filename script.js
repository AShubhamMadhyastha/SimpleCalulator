document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    let currentInput = '';
    let operator = '';
    let firstNum = '';
    let memory = 0;
    const historyList = document.getElementById('history-list');
    const historyStack = [];
    let currentHistoryIndex = -1;

    // DOM Elements
    const buttons = document.querySelectorAll('.calculator button');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const voiceInputButton = document.getElementById('voiceInput');
    const memoryPlus = document.getElementById('memoryPlus');
    const memoryMinus = document.getElementById('memoryMinus');
    const memoryRecall = document.getElementById('memoryRecall');
    const memoryClear = document.getElementById('memoryClear');

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode'); // Toggle the dark mode
    });

    // Add Event Listeners for Buttons
    buttons.forEach(button => {
        // Only handle click events for calculator buttons (skip special buttons like darkModeToggle)
        button.addEventListener('click', () => {
            const buttonText = button.textContent;

            // Skip dark mode toggle and settings buttons
            if (buttonText === '🌙' || buttonText === '⚙️') return;

            if (buttonText === 'C') {
                clearInput();
            } else if (buttonText === '=') {
                calculateResult();
            } else if (['+', '-', '*', '/', 'sqrt', '^', 'log'].includes(buttonText)) {
                setOperator(buttonText);
            } else {
                appendToInput(buttonText);
            }
        });
    });

    // Memory Functions
    memoryPlus.addEventListener('click', () => {
        memory += parseFloat(display.value) || 0;
        clearInput();
    });

    memoryMinus.addEventListener('click', () => {
        memory -= parseFloat(display.value) || 0;
        clearInput();
    });

    memoryRecall.addEventListener('click', () => {
        display.value = memory;
        currentInput = display.value; // Update current input to match display
    });

    memoryClear.addEventListener('click', () => {
        memory = 0;
        clearInput();
    });

    // History Functions
    function addToHistory(calculation) {
        historyStack.push(calculation);
        currentHistoryIndex = historyStack.length - 1;
        const listItem = document.createElement('li');
        listItem.textContent = calculation;
        historyList.appendChild(listItem);
    }

    // Clear Input Function
    function clearInput() {
        currentInput = '';
        operator = '';
        firstNum = '';
        display.value = '';
    }

    // Calculate Result Function
    function calculateResult() {
        try {
            let result;
            if (operator === 'sqrt') {
                result = Math.sqrt(parseFloat(currentInput));
            } else if (operator === 'log') {
                result = Math.log10(parseFloat(currentInput));
            } else if (operator === '^') {
                result = Math.pow(parseFloat(firstNum), parseFloat(currentInput));
            } else {
                result = eval(`${firstNum} ${operator} ${currentInput}`);
            }
            display.value = result.toString();
            addToHistory(`${firstNum} ${operator} ${currentInput} = ${result}`);
            firstNum = ''; // Reset for next calculation
            operator = '';
            currentInput = ''; // Clear current input after calculation
        } catch (e) {
            display.value = 'Error';
            currentInput = ''; // Reset input on error
        }
    }

    // Set Operator Function
    function setOperator(op) {
        if (currentInput !== '') { // Ensure there's a number to operate on
            if (firstNum === '') { 
                firstNum = currentInput; // Store the first number
            } else if (operator) { 
                calculateResult(); // Calculate previous operation before setting a new operator
            }
            operator = op; // Set the new operator
            currentInput = ''; // Clear input for next number
        }
    }

    // Append to Input Function
    function appendToInput(value) {
        currentInput += value; 
        display.value = currentInput; 
    }

   // Voice Input (Speech Recognition)
   const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
   recognition.onresult = function (event) {
       const speechInput = event.results[0][0].transcript;
       appendToInput(speechInput); // Use appendToInput to update the display
   };

   voiceInputButton.addEventListener('click', () => {
       recognition.start();
   });

   // Keyboard Support
   document.addEventListener('keydown', (event) => {
       const key = event.key;
       if (key >= '0' && key <= '9') {
           appendToInput(key); // Use appendToInput to handle number input
       } else if (key === 'Enter') {
           calculateResult(); // Call calculateResult on Enter key press
       } else if (key === 'Backspace') {
           currentInput = currentInput.slice(0, -1); 
           display.value = currentInput; 
       } else if (['+', '-', '*', '/', '.', '^'].includes(key)) { 
           setOperator(key); 
       }
   });
});
