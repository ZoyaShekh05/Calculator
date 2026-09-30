// const display = document.querySelector("#display")
// const buttons = document.querySelector("#buttons")
// const  clearButton = document.querySelector(".clear")
// const deleteButton = document.querySelector(".delete")
// const buttonOprators = document.querySelectorAll(".operator")
// const numberButtons = document.querySelectorAll(".number")
// const equalOprator = document.querySelector(".equal")


// // numberButtons.forEach(button => {
// //     button.addEventListener("click" , () =>{
// //         // console.log(button.textContent);
          
// //         if(operator !== ""){
// //             display.textContent = button.textContent ;
// //             secondNumber = display.textContent ;
// //         }else{ if(display.textContent.trim() === "0"){
// //             display.textContent = button.textContent
// //         } else{
// //             display.textContent += button.textContent
// //         }
// //     }
// //     })
// // })

// // let operator = "" ;
// // let firstNumber = "" ;
// // let secondNumber = "" ;

// // buttonOprators.forEach(button =>{
// //     button.addEventListener("click" , () =>{
// //         firstNumber = display.textContent
// //         // console.log(button.textContent);
// //         operator = button.textContent
// //         // display.textContent += button.textContent
// //         console.log(firstNumber);
// //         console.log(operator);
// //     })
// // })


// numberButtons.forEach(button => {
//     button.addEventListener("click" , () =>{
//         display.value += button.textContent
//     })
// })

// equalOprator.addEventListener("click" , () =>{
//               display.value = eval(display.value)
// })


// function appendValue(val){
//     if(val === "%"){val = "/100"

//     }  ;
//     display.value += val
//     display.value = "" ;
// }

// function clearDisplay(){
//     display.value = ""
// }

// function deleteLast(){
//     display.value = display.value.slice(0 , -1) ;
// }

// function calculate(){
//     try{
//         display.value = eval(display.value) ;
//     } catch{
//         display.value = "Error" ;
//         setTimeout(() => display.value = "" , 1000)
//     }
// }


const display = document.getElementById("display");
const previous = document.getElementById("previous");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const clearButton = document.querySelector(".clear");
const deleteButton = document.querySelector(".delete");
const equalButton = document.querySelector(".equal");
const specialButton = document.querySelector(".special");

const historyButton = document.querySelector(".history");
const percentButtons = document.querySelectorAll(".percent");

const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const closeHistory = document.getElementById("closeHistory");
const clearHistory = document.getElementById("clearHistory");


// ======================================
// CALCULATOR STATE
// ======================================

let expression = "";
let justCalculated = false;


// ======================================
// HISTORY
// ======================================

let history = [];


// ======================================
// DISPLAY
// ======================================

function showDisplay(value) {

    display.innerText = value || "0";

    resizeDisplay();

}


// ======================================
// DISPLAY RESIZE
// ======================================

function resizeDisplay() {

    const length = display.innerText.length;

    if (length <= 10) {

        display.style.fontSize = "42px";

    } else if (length <= 13) {

        display.style.fontSize = "36px";

    } else if (length <= 16) {

        display.style.fontSize = "32px";

    } else if (length <= 19) {

        display.style.fontSize = "28px";

    } else if (length <= 22) {

        display.style.fontSize = "24px";

    } else if (length <= 26) {

        display.style.fontSize = "20px";

    } else {

        display.style.fontSize = "17px";

    }

}


// ======================================
// CHECK OPERATOR
// ======================================

function isOperator(char) {

    return (
        char === "+" ||
        char === "−" ||
        char === "×" ||
        char === "÷"
    );

}


// ======================================
// FORMAT NUMBER
// ======================================

function formatNumber(number) {

    if (!Number.isFinite(number)) {

        return "Error";

    }

    return String(
        Number(
            number.toFixed(10)
        )
    );

}


// ======================================
// GET CURRENT NUMBER
// ======================================

function getCurrentNumber() {

    const match =
        expression.match(
            /(-?\d*\.?\d+)$/
        );

    if (match) {

        return match[0];

    }

    return "";

}


// ======================================
// CALCULATE EXPRESSION
// ======================================

function calculateExpression(exp) {

    if (!exp) {

        return null;

    }

    try {

        const jsExpression =
            exp
                .replaceAll("×", "*")
                .replaceAll("÷", "/")
                .replaceAll("−", "-");


        if (
            !/^[0-9+\-*/().\s]+$/.test(
                jsExpression
            )
        ) {

            return null;

        }


        const result =
            Function(
                `"use strict"; return (${jsExpression})`
            )();


        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {

            return "Error";

        }


        return formatNumber(result);

    } catch {

        return null;

    }

}


// ======================================
// LIVE DISPLAY
// ======================================

function updateLiveDisplay() {

    if (!expression) {

        showDisplay("0");

        return;

    }


    const lastChar =
        expression.charAt(
            expression.length - 1
        );


    // Number complete hai

    if (!isOperator(lastChar)) {

        const result =
            calculateExpression(
                expression
            );


        if (result !== null) {

            showDisplay(result);

            return;

        }

    }


    // Operator ke baad

    if (isOperator(lastChar)) {

        const beforeOperator =
            expression.slice(0, -1);


        const result =
            calculateExpression(
                beforeOperator
            );


        if (result !== null) {

            showDisplay(result);

        } else {

            showDisplay("0");

        }

    }

}


// ======================================
// PREVIOUS TEXT
// ======================================

function updatePrevious() {

    previous.innerText =
        expression;

}


// ======================================
// NUMBER BUTTONS
// ======================================

numberButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const value =
                button.innerText;


            // Result ke baad new calculation

            if (justCalculated) {

                expression = "";

                previous.innerText = "";

                justCalculated = false;

            }


            const currentNumber =
                getCurrentNumber();


            // ==================================
            // DECIMAL
            // ==================================

            if (value === ".") {

                if (
                    currentNumber.includes(".")
                ) {

                    return;

                }


                if (
                    !expression ||
                    isOperator(
                        expression.charAt(
                            expression.length - 1
                        )
                    )
                ) {

                    expression += "0.";

                } else {

                    expression += ".";

                }

            }


            // ==================================
            // NUMBER
            // ==================================

            else {

                if (
                    currentNumber === "0"
                ) {

                    expression =
                        expression.slice(0, -1)
                        + value;

                } else {

                    expression += value;

                }

            }


            updatePrevious();

            updateLiveDisplay();

        }
    );

});


// ======================================
// OPERATOR BUTTONS
// ======================================

operatorButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            if (!expression) {

                return;

            }


            const newOperator =
                button.innerText;


            const lastChar =
                expression.charAt(
                    expression.length - 1
                );


            // Operator change

            if (isOperator(lastChar)) {

                expression =
                    expression.slice(0, -1)
                    + newOperator;

            }

            else {

                expression +=
                    newOperator;

            }


            justCalculated = false;

            updatePrevious();

            updateLiveDisplay();

        }
    );

});


// ======================================
// EQUAL BUTTON
// ======================================

equalButton.addEventListener(
    "click",
    function () {

        if (!expression) {

            return;

        }


        const lastChar =
            expression.charAt(
                expression.length - 1
            );


        // Last mein operator hai

        if (isOperator(lastChar)) {

            return;

        }


        const result =
            calculateExpression(
                expression
            );


        if (
            result === null ||
            result === "Error"
        ) {

            showDisplay("Error");

            return;

        }


        // ==================================
        // SAVE TO HISTORY
        // ==================================

        // history.unshift({

        //     calculation: expression,

        //     result: result

        // });


        // Maximum 20 history

        // if (history.length > 20) {

        //     history.pop();

        // }


        // History immediately update

        renderHistory();


        // ==================================
        // SHOW RESULT
        // ==================================

        previous.innerText =
            expression + " =";

        showDisplay(result);


        // Result ko expression bana do

        expression = result;

        justCalculated = true;

    }
);


// ======================================
// AC BUTTON
// ======================================

clearButton.addEventListener(
    "click",
    function () {

        expression = "";

        justCalculated = false;

        previous.innerText = "";

        showDisplay("0");

    }
);


// ======================================
// BACKSPACE
// ======================================

deleteButton.addEventListener(
    "click",
    function () {

        // Result ke baad backspace

        if (justCalculated) {

            expression = "";

            justCalculated = false;

            previous.innerText = "";

            showDisplay("0");

            return;

        }


        if (!expression) {

            showDisplay("0");

            return;

        }


        expression =
            expression.slice(0, -1);


        updatePrevious();


        if (!expression) {

            showDisplay("0");

            return;

        }


        updateLiveDisplay();

    }
);


// ======================================
// PLUS / MINUS
// ======================================

specialButton.addEventListener(
    "click",
    function () {

        if (!expression) {

            return;

        }


        const currentNumber =
            getCurrentNumber();


        if (!currentNumber) {

            return;

        }


        const start =
            expression.length -
            currentNumber.length;


        if (
            currentNumber.charAt(0) !== "-"
        ) {

            expression =
                expression.slice(0, start)
                + "-"
                + currentNumber;

        }

        else {

            expression =
                expression.slice(0, start)
                + currentNumber.slice(1);

        }


        updatePrevious();

        updateLiveDisplay();

    }
);


// ======================================
// PERCENT BUTTON
// ======================================

if (percentButtons.length > 0) {

    percentButtons[0].addEventListener(
        "click",
        function () {

            if (!expression) {

                return;

            }


            const currentNumber =
                getCurrentNumber();


            if (!currentNumber) {

                return;

            }


            const percentage =
                formatNumber(
                    Number(currentNumber) / 100
                );


            expression =
                expression.slice(
                    0,
                    expression.length -
                    currentNumber.length
                )
                + percentage;


            updatePrevious();

            updateLiveDisplay();

        }
    );

}


// ======================================
// RENDER HISTORY
// ======================================

// function renderHistory() {

//     if (!historyList) {

//         return;

//     }


//     historyList.innerHTML = "";


    // No history

    // if (history.length === 0) {

    //     historyList.innerHTML = `
    //         <div
    //             style="
    //                 text-align: center;
    //                 color: rgba(255,255,255,0.35);
    //                 padding: 30px 10px;
    //                 font-size: 14px;
    //             "
    //         >
    //             No calculations yet
    //         </div>
    //     `;

    //     return;

    // }


    // History items

    // history.forEach(function (item) {

    //     const itemDiv =
    //         document.createElement("div");


        // itemDiv.style.cssText = `
        //     width: 100%;
        //     padding: 14px;
        //     margin-bottom: 10px;
        //     border-radius: 14px;
        //     background: #171d2c;
        //     border: 1px solid rgba(255,255,255,0.08);
        //     box-sizing: border-box;
        //     cursor: pointer;
        // `;


        // itemDiv.innerHTML = `
        //     <div
        //         style="
        //             color: rgba(255,255,255,0.45);
        //             font-size: 13px;
        //             margin-bottom: 5px;
        //             word-break: break-all;
        //         "
        //     >
        //         ${item.calculation} =
        //     </div>

        //     <div
        //         style="
        //             color: #67e8f9;
        //             font-size: 22px;
        //             font-weight: bold;
        //             word-break: break-all;
        //         "
        //     >
        //         ${item.result}
        //     </div>
        // `;


        // History item click

        // itemDiv.addEventListener(
        //     "click",
        //     function () {

        //         expression =
        //             item.result;

        //         justCalculated = true;


        //         previous.innerText =
        //             item.calculation + " =";


        //         showDisplay(
        //             item.result
        //         );


        //         historyPanel.style.display =
        //             "none";

        //     }
        // );


        // historyList.appendChild(
        //     itemDiv
        // );

    // });

// }


// ======================================
// OPEN HISTORY
// ======================================

// historyButton.addEventListener(
//     "click",
//     function () {

//         renderHistory();

//         historyPanel.style.display =
//             "flex";

//     }
// );


// ======================================
// CLOSE HISTORY
// ======================================

// closeHistory.addEventListener(
//     "click",
//     function () {

//         historyPanel.style.display =
//             "none";

//     }
// );


// ======================================
// CLEAR HISTORY
// ======================================

// clearHistory.addEventListener(
//     "click",
//     function () {

//         history = [];

//         renderHistory();

//     }
// );


// ======================================
// CLICK OUTSIDE PANEL
// ======================================

historyPanel.addEventListener(
    "click",
    function (event) {

        if (
            event.target === historyPanel
        ) {

            historyPanel.style.display =
                "none";

        }

    }
);


// ======================================
// KEYBOARD SUPPORT
// ======================================

document.addEventListener(
    "keydown",
    function (event) {

        const key =
            event.key;


        // Numbers

        if (
            key >= "0" &&
            key <= "9"
        ) {

            numberButtons.forEach(
                function (button) {

                    if (
                        button.innerText === key
                    ) {

                        button.click();

                    }

                }
            );

        }


        // Decimal

        if (key === ".") {

            numberButtons.forEach(
                function (button) {

                    if (
                        button.innerText === "."
                    ) {

                        button.click();

                    }

                }
            );

        }


        // Operators

        let operator = null;


        if (key === "+") {

            operator = "+";

        }

        else if (key === "-") {

            operator = "−";

        }

        else if (key === "*") {

            operator = "×";

        }

        else if (key === "/") {

            operator = "÷";

        }


        if (operator) {

            operatorButtons.forEach(
                function (button) {

                    if (
                        button.innerText ===
                        operator
                    ) {

                        button.click();

                    }

                }
            );

        }


        // Enter

        if (
            key === "Enter" ||
            key === "="
        ) {

            equalButton.click();

        }


        // Backspace

        if (
            key === "Backspace"
        ) {

            deleteButton.click();

        }


        // Escape

        if (
            key === "Escape"
        ) {

            clearButton.click();

        }

    }
);


// ======================================
// START
// ======================================

renderHistory();

showDisplay("0");
