
var productionRules = {
    "R1": "E -> E + T",
    "R2": "E -> T",
    "R3": "T -> T * F",
    "R4": "T -> F",
    "R5": "F -> ( E )",
    "R6": "F -> id"
};

var parsingTable = {
    0: { "id": "S5", "+": null, "*": null, "(": "S4", ")": null, "$": null, "E": "1", "T": "2", "F": "3" },
    1: { "id": null, "+": "S6", "*": null, "(": null, ")": null, "$": "accept", "E": null, "T": null, "F": null },
    2: { "id": null, "+": "R2", "*": "S7", "(": null, ")": "R2", "$": "R2", "E": null, "T": null, "F": null },
    3: { "id": null, "+": "R4", "*": "R4", "(": null, ")": "R4", "$": "R4", "E": null, "T": null, "F": null },
    4: { "id": "S5", "+": null, "*": null, "(": "S4", ")": null, "$": null, "E": "8", "T": "2", "F": "3" },
    5: { "id": null, "+": "R6", "*": "R6", "(": null, ")": "R6", "$": "R6", "E": null, "T": null, "F": null },
    6: { "id": "S5", "+": null, "*": null, "(": "S4", ")": null, "$": null, "E": null, "T": "9", "F": "3" },
    7: { "id": "S5", "+": null, "*": null, "(": "S4", ")": null, "$": null, "E": null, "T": null, "F": "10" },
    8: { "id": null, "+": "S6", "*": null, "(": null, ")": "S11", "$": null, "E": null, "T": null, "F": null },
    9: { "id": null, "+": "R1", "*": "S7", "(": null, ")": "R1", "$": "R1", "E": null, "T": null, "F": null },
    10: { "id": null, "+": "R3", "*": "R3", "(": null, ")": "R3", "$": "R3", "E": null, "T": null, "F": null },
    11: { "id": null, "+": "R5", "*": "R5", "(": null, ")": "R5", "$": "R5", "E": null, "T": null, "F": null },
};

var input = "id + id * id $".split(" ");

var stack: string[] = ["0"];

var actions = [];

var timeFunction: any;

var curentParseTableCell;

const shiftOperation = (element: string, action: string) => {
    let expressionComponent = document.getElementById("expression");
    stack.push(element, action[1]);
    let currentExpressionComponent = document.createElement("ion-text");
    currentExpressionComponent.textContent = `Shift Input. Go to state ${action[1]}`;
    expressionComponent.appendChild(currentExpressionComponent);
}

const reduceOperation = (action: string) => {
    let productionRulesImplementedComponent = document.getElementById('productionRulesImplemented');
    let expressionComponent = document.getElementById("expression");
    let derivationComponent = document.getElementById("derivation");

    let rule: string = productionRules[action];

    let lhs: string = rule.split("->")[0].trim();
    let rhs: string[] = rule.split("->")[1].split(" ");

    rhs.reverse().forEach((exp: string) => {
        if (stack[stack.length - 2] == exp.trim()) {
            stack.pop();
            stack.pop();
        }
    });
    stack.push(lhs);
    stack.push(parsingTable[stack[stack.length - 2]][stack[stack.length - 1]]);

    let ruleImplementedComponent = document.createElement("ion-text");
    productionRulesImplementedComponent.appendChild(ruleImplementedComponent);
    ruleImplementedComponent.textContent = rule;

    let currentExpressionComponent = document.createElement("ion-text");
    expressionComponent.appendChild(currentExpressionComponent);
    currentExpressionComponent.textContent = `Reduce using production rule ${action[1]}. Go to state ${stack[stack.length - 1]}`;

    let derivationElementComponent = document.createElement("ion-text");
    let derivationString = '';

    for (let i = 0; i < stack.length; i++) {
        if (i % 2 != 0) {
            derivationString += stack[i] + " ";
        }
    }
    derivationString += input.join(" ")
    derivationComponent.appendChild(derivationElementComponent);
    derivationElementComponent.textContent = derivationString;
}

const markAction = (action: string) => {
    if (curentParseTableCell) {
        curentParseTableCell.style.backgroundColor = "#fff";
    }

    curentParseTableCell = document.getElementById(`${action}`);
    // console.log(curentParseTableCell.textContent)
    if (curentParseTableCell.textContent == null || curentParseTableCell.textContent.length == 0 || curentParseTableCell.textContent == "" || curentParseTableCell.textContent == undefined) {
        curentParseTableCell.style.backgroundColor = "#eb445a";
    } else if (curentParseTableCell.textContent == "accept") {
        curentParseTableCell.style.backgroundColor = "#2dd36f";
    } else if (typeof curentParseTableCell.textContent == 'string') {
        curentParseTableCell.style.backgroundColor = "#3880ff";
    }
    // console.log(action);
}

const compute = (element: string) => {
    let action = parsingTable[Number(stack[stack.length - 1])][element];
    markAction(stack[stack.length - 1].concat(element));
    if (action) {
        let actionsComponent = document.getElementById("action");

        if (action == "accept") {
            let expressionResultComponent = document.getElementById("expressionResult");
            expressionResultComponent.replaceChildren();
            let currentResultExpressionComponent = document.createElement("ion-text");
            currentResultExpressionComponent.setAttribute("color", "success");
            expressionResultComponent.appendChild(currentResultExpressionComponent);
            currentResultExpressionComponent.textContent = `Expression has been parsed successfully in ${actions.length} Steps`;
            window.clearInterval(timeFunction);
        } else if (action[0] == 'S') {
            shiftOperation(element, action);
        } else if (action[0] == 'R') {
            reduceOperation(action)
            input = [element, ...input];

        }
        actions.push(action);

        let actionComponent = document.createElement("ion-text");
        actionsComponent.appendChild(actionComponent);
        actionComponent.textContent = action;
    } else {
        let expressionResultComponent = document.getElementById("expressionResult");
        let currentResultExpressionComponent = document.createElement("ion-text");
        currentResultExpressionComponent.setAttribute("color", "danger");
        expressionResultComponent.appendChild(currentResultExpressionComponent);
        currentResultExpressionComponent.textContent = `Error occured while parsing expression at ${stack[stack.length - 1]} , ${element}`;
        window.clearInterval(timeFunction);
    }
}

const checkChildren = () => {
    let stackComponent = document.getElementById("stackRules");
    stackComponent.replaceChildren();

    let actionsComponent = document.getElementById("action");
    actionsComponent.replaceChildren();

    let productionRulesImplementedComponent = document.getElementById("productionRulesImplemented");
    productionRulesImplementedComponent.replaceChildren();

    let expressionComponent = document.getElementById("expression");
    expressionComponent.replaceChildren();

    let derivationComponent = document.getElementById("derivation");
    derivationComponent.replaceChildren();

    let expressionResultComponent = document.getElementById("expressionResult");
    expressionResultComponent.replaceChildren();

}



const ValidateExpression = () => {
    checkChildren();
    stack = ["0"];
    actions = [];

    //@ts-ignore
    input = document.getElementById("inputValueExpression").children[0].value.split(" ");

    let stackComponent = document.getElementById("stackRules");
    timeFunction = setInterval(() => {
        compute(input[0]);
        input.shift();

        stackComponent.replaceChildren();
        stack.forEach((stackElement: string) => {
            let stackElementComponent = document.createElement("ion-text");
            stackComponent.classList.add("cardContent");
            stackElementComponent.classList.add("cardContent");
            stackComponent.appendChild(stackElementComponent);
            stackElementComponent.textContent = stackElement;
        });
    }, 500);
}


window.onload = () => {
    let productionRulesComponent = document.getElementById('productionRules');
    for (let rule in productionRules) {
        let ruleComponent = document.createElement("ion-text");
        productionRulesComponent.appendChild(ruleComponent);
        ruleComponent.textContent = productionRules[rule];
    }

    let parseTableComponent = document.getElementById('parseTable');
    let tableData = [];
    let headers = ["state"];
    for (let headerColumn in parsingTable[0]) {
        headers.push(headerColumn);
    }
    tableData.push(headers);
    for (let row in parsingTable) {
        let data = [row]
        for (let col in parsingTable[row]) {
            data.push(parsingTable[row][col]);
        }
        tableData.push(data);
    }
    tableData.forEach((row: string[]) => {
        let rowComponent = document.createElement("ion-row");
        rowComponent.className = "rowCell";

        row.forEach((column: string, index: number) => {
            let columnComponent = document.createElement("ion-column");
            columnComponent.className = "columnCell";
            columnComponent.id = `${row[0]}${tableData[0][index]}`;
            rowComponent.appendChild(columnComponent);
            columnComponent.textContent = column == null ? '' : column;
        });
        parseTableComponent.appendChild(rowComponent);
    });
}

