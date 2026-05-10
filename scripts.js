class Calculator{

    constructor(){
this.Memory = [];
this.currentValue = "";
this.selectedOP = "";
this.secondVlaue = "";
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
]
this.currentState = "fresh"
}
setButtons(callback){
    this.ButtonStates = callback;
}
setDisplay(callback){
    this.sendDisplay = callback;
}
getButtons(type,value){
if(this.state == "fresh" || this.state == "first-operand"){this.currentValue += value;
    this.state = "first-operand";
    this.ButtonStates(this.state);
                     this.sendDisplay(this.currentValue , this.state );

}
if(type == "op" && (this.state == "fresh" || this.state == "first-operand") && this.currentValue == ""){
    this.currentValue +="value";
     this.ButtonStates(this.state);
                 this.sendDisplay(this.currentValue , this.state );

}
if(type == "op" && this.state == "first-oprand" && this.currentValue != ""){
    this.selectedOP = value;
    this.state = "op";
            this.sendDisplay(this.selectedOP , this.state );

         this.ButtonStates(this.state);}
}
if((this.state == "second-operand" || this.state =="op") && type != "equal"){

    this.secondVlaue += value;
    this.state = "second-operand";
    this.ButtonStates(this.state);
        this.sendDisplay(this.secondVlaue , this.state );

}
if(this.state == "second-operand" && type == "euqal"){

    this.state = "equal"
    this.ButtonStates(this.state);
    this.result = evalValue(this.currentState,this.selectedOP,this.secondVlaue)
    this.sendDisplay(this.result , this.state );
}

}

class Buttons{
    constructor(buttons){
        this.buttonsIds = buttons;
        this.state = "fresh";
        this.currentMemory = {};
        this.prevMemory = {} ;
        this.calculatorCallback = null;
        this.handlers= {
"number":this.handleNumber.bind(this),
 "op":this.handleOp.bind(this),
"control":this.handleControl.bind(this),
"equal":this.handleEqual.bind(this)
        }
this.buttonsIds.forEach(button => {
    button.addEventListener('click',()=>{
        const type = button.dataset.type;
        const value = button.textContent;
        this.handlers[type](value);
    })
});
    }

    isAllowed(type,value){
        switch (type){
            case "equal":
                if(this.state == "second-operand"){return true;}
                if(this.state == "first-operand"){return false;}
                if(this.state == "op"){return false;}
                if(this.state == "fresh"){return false;}
                if(this.state == "view-memory"){return false;}
                return false;

            break;
            case "op":
                if(this.state == "second-operand"){return true;}
                if(this.state == "first-operand" && value == "-"){return true;}
                if(this.state == "op" && value == "-"){return true;}
                if(this.state == "fresh" && value == "-"){return true;}
                if(this.state == "view-memory" && this.currentMemory.error == false){return true;}
                return false;
            break;

            case "number":
                if(this.state == "second-operand"){return true;}
                if(this.state == "first-operand" ){return true;}
                if(this.state == "op" ){return true;}
                if(this.state == "fresh" ){return true;}
                if(this.state == "view-memory" ){return true;}
                return false;
            break;
            case "control":
                return true;
            break;

        }
    }
    onAction(callback){
        this.calculatorCallback = callback;
    }
    setState(state){
        this.state = state ;
    }
    setMemory(memory){
        this.prevMemory = this.currentMemory;
        this.currentMemory = memory;
    }

    handleNumber(number){
        if(this.isAllowed("number",number)){
            this.calculatorCallback("number",number);
        }
    }
    handleOp(op){
         if(this.isAllowed("op",op)){
            this.calculatorCallback("number",number);
        }
    }
    handleControl(control){
 if(this.isAllowed("control",control)){
            this.calculatorCallback("number",number);
        }
    }
    handleEqual(equal){
 if(this.isAllowed("equal",equal)){
            // 
        }
    }
}

class Display{
    constructor(){
    }
}