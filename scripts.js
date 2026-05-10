class Calculator {
    constructor() {
        this.Memory = [];
        this.currentValue = "";
        this.selectedOP = "";
        this.secondValue = "";
        this.result = "";
        this.ButtonStates = null;
        this.sendDisplay = null;
        this.states = [
            "op",
            "equal",
            "first-operand",
            "second-operand",
            "memory-view",
            "fresh"
        ];
        this.currentState = "fresh";
    }

    evalValue(first, op, second) {
        const operations = {
            "+": (f, s) => parseFloat(f) + parseFloat(s),
            "-": (f, s) => parseFloat(f) - parseFloat(s),
            "×": (f, s) => parseFloat(f) * parseFloat(s),
            "÷": (f, s) => s == "0" ? "Error" : parseFloat(f) / parseFloat(s)
        };
        return operations[op](first, second);
    }

    setButtons(callback) {
        this.ButtonStates = callback;
    }

    setDisplay(callback) {
        this.sendDisplay = callback;
    }

    getButtons(type, value) {
        if (type === "number" && (this.currentState === "fresh" || this.currentState === "first-operand")) {
            this.currentValue += value;
            this.currentState = "first-operand";
            this.ButtonStates(this.currentState);
            this.sendDisplay(this.currentValue, this.currentState);
        }
        else if (type === "op" && this.currentState === "first-operand" && this.currentValue !== "") {
            this.selectedOP = value;
            this.currentState = "op";
            this.ButtonStates(this.currentState);
            this.sendDisplay(this.selectedOP, this.currentState);
        }
        else if (type === "number" && (this.currentState === "second-operand" || this.currentState === "op")) {
            this.secondValue += value;
            this.currentState = "second-operand";
            this.ButtonStates(this.currentState);
            this.sendDisplay(this.secondValue, this.currentState);
        }
        else if (this.currentState === "second-operand" && type === "equal") {
            this.currentState = "equal";
            this.ButtonStates(this.currentState);
            this.result = this.evalValue(this.currentValue, this.selectedOP, this.secondValue);
            this.sendDisplay(this.result, this.currentState);
        }
    }
}

class Buttons {
    constructor(buttons) {
        this.buttonsIds = buttons;
        this.state = "fresh";
        this.currentMemory = {};
        this.prevMemory = {};
        this.calculatorCallback = null;
        this.handlers = {
            "number": this.handleNumber.bind(this),
            "op": this.handleOp.bind(this),
            "control": this.handleControl.bind(this),
            "equal": this.handleEqual.bind(this)
        };
        this.buttonsIds.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                const value = button.textContent;
                this.handlers[type](value);
            });
        });
    }

    isAllowed(type, value) {
        switch (type) {
            case "equal":
                if (this.state === "second-operand") return true;
                if (this.state === "first-operand") return false;
                if (this.state === "op") return false;
                if (this.state === "fresh") return false;
                if (this.state === "view-memory") return false;
                return false;

            case "op":
                if (this.state === "second-operand") return true;
                if (this.state === "first-operand" ) return true;
                if (this.state === "op" && value === "-") return true;
                if (this.state === "fresh" && value === "-") return true;
                if (this.state === "view-memory" && this.currentMemory.error === false) return true;
                return false;

            case "number":
                if (this.state === "second-operand") return true;
                if (this.state === "first-operand") return true;
                if (this.state === "op") return true;
                if (this.state === "fresh") return true;
                if (this.state === "view-memory") return true;
                return false;

            case "control":
                return true;
        }
    }

    onAction(callback) {
        this.calculatorCallback = callback;
    }

    setState(state) {
        this.state = state;
    }

    setMemory(memory) {
        this.prevMemory = this.currentMemory;
        this.currentMemory = memory;
    }

    handleNumber(number) {
        if (this.isAllowed("number", number)) {
            this.calculatorCallback("number", number);
        }
    }

    handleOp(op) {
        if (this.isAllowed("op", op)) {
            this.calculatorCallback("op", op);
        }
    }

    handleControl(control) {
        if (this.isAllowed("control", control)) {
            this.calculatorCallback("control", control);
        }
    }

    handleEqual(equal) {
        if (this.isAllowed("equal", equal)) {
            this.calculatorCallback("equal", equal);
        }
    }
}

class Display {
    constructor(firstSpace, secondSpace) {
        this.firstLine = "";
        this.secondLine = "";
        this.state = "";
        this.firstSpace = firstSpace;
        this.secondSpace = secondSpace;
    }

    Interact(value, state) {
        if (state === "fresh" || state === "first-operand") {
            this.firstLine = value;
            this.firstSpace.innerHTML = `<h1>${this.firstLine}</h1>`;
        }
        else if (state === "op") {
            this.secondLine = this.firstLine + " " + value;
            this.secondSpace.innerHTML = `<h3>${this.secondLine}</h3>`;
            this.firstLine = "";
            this.firstSpace.innerHTML = this.firstLine;
        }
        else if (state === "second-operand") {
            this.firstLine = value;
            this.firstSpace.innerHTML = `<h1>${this.firstLine}</h1>`;
        }
        else if (state === "equal") {
            this.secondLine = this.secondLine + " " + this.firstLine + " =";
            this.secondSpace.innerHTML = `<h3>${this.secondLine}</h3>`;
            this.firstLine = value;
            this.firstSpace.innerHTML = `<h1>${this.firstLine}</h1>`;
        }
    }
}

const allButtons = Array.from(document.querySelectorAll('Button'));
const displayContainer = document.querySelector(".display");
const secondLineDiv = document.createElement('div');
const firstLineDiv = document.createElement('div');
secondLineDiv.className = 'second-line';
firstLineDiv.className = 'first-line';
displayContainer.appendChild(secondLineDiv); 
displayContainer.appendChild(firstLineDiv); 
const display = new Display(firstLineDiv, secondLineDiv);
const buttonManager = new Buttons(allButtons);
const calculator = new Calculator();
calculator.setButtons((state) => {
    buttonManager.setState(state);
});
calculator.setDisplay((value, state) => {
    display.Interact(value, state);
});
buttonManager.onAction((type, value) => {
    calculator.getButtons(type, value);
});