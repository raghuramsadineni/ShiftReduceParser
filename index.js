var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    11: { "id": null, "+": "R5", "*": "R5", "(": null, ")": "R5", "$": "R5", "E": null, "T": null, "F": null }
};
var input = "id + id * id $".split(" ");
var stack = ["0"];
var actions = [];
var timeFunction;
var curentParseTableCell;
var shiftOperation = function (element, action) {
    var expressionComponent = document.getElementById("expression");
    stack.push(element, action[1]);
    var currentExpressionComponent = document.createElement("ion-text");
    currentExpressionComponent.textContent = "Shift Input. Go to state ".concat(action[1]);
    expressionComponent.appendChild(currentExpressionComponent);
};
var reduceOperation = function (action) {
    var productionRulesImplementedComponent = document.getElementById('productionRulesImplemented');
    var expressionComponent = document.getElementById("expression");
    var derivationComponent = document.getElementById("derivation");
    var rule = productionRules[action];
    var lhs = rule.split("->")[0].trim();
    var rhs = rule.split("->")[1].split(" ");
    rhs.reverse().forEach(function (exp) {
        if (stack[stack.length - 2] == exp.trim()) {
            stack.pop();
            stack.pop();
        }
    });
    stack.push(lhs);
    stack.push(parsingTable[stack[stack.length - 2]][stack[stack.length - 1]]);
    var ruleImplementedComponent = document.createElement("ion-text");
    productionRulesImplementedComponent.appendChild(ruleImplementedComponent);
    ruleImplementedComponent.textContent = rule;
    var currentExpressionComponent = document.createElement("ion-text");
    expressionComponent.appendChild(currentExpressionComponent);
    currentExpressionComponent.textContent = "Reduce using production rule ".concat(action[1], ". Go to state ").concat(stack[stack.length - 1]);
    var derivationElementComponent = document.createElement("ion-text");
    var derivationString = '';
    for (var i = 0; i < stack.length; i++) {
        if (i % 2 != 0) {
            derivationString += stack[i] + " ";
        }
    }
    derivationString += input.join(" ");
    derivationComponent.appendChild(derivationElementComponent);
    derivationElementComponent.textContent = derivationString;
};
var markAction = function (action) {
    if (curentParseTableCell) {
        curentParseTableCell.style.backgroundColor = "#fff";
    }
    curentParseTableCell = document.getElementById("".concat(action));
    console.log(curentParseTableCell.textContent);
    if (curentParseTableCell.textContent == null || curentParseTableCell.textContent.length == 0 || curentParseTableCell.textContent == "" || curentParseTableCell.textContent == undefined) {
        curentParseTableCell.style.backgroundColor = "#eb445a";
    }
    else if (curentParseTableCell.textContent == "accept") {
        curentParseTableCell.style.backgroundColor = "#2dd36f";
    }
    else if (typeof curentParseTableCell.textContent == 'string') {
        curentParseTableCell.style.backgroundColor = "#3880ff";
    }
    console.log(action);
};
var compute = function (element) {
    var action = parsingTable[Number(stack[stack.length - 1])][element];
    markAction(stack[stack.length - 1].concat(element));
    if (action) {
        var actionsComponent = document.getElementById("action");
        if (action == "accept") {
            var expressionResultComponent = document.getElementById("expressionResult");
            expressionResultComponent.replaceChildren();
            var currentResultExpressionComponent = document.createElement("ion-text");
            currentResultExpressionComponent.setAttribute("color", "success");
            expressionResultComponent.appendChild(currentResultExpressionComponent);
            currentResultExpressionComponent.textContent = "Expression has been parsed successfully in ".concat(actions.length, " Steps");
            window.clearInterval(timeFunction);
        }
        else if (action[0] == 'S') {
            shiftOperation(element, action);
        }
        else if (action[0] == 'R') {
            reduceOperation(action);
            input = __spreadArray([element], input, true);
        }
        actions.push(action);
        var actionComponent = document.createElement("ion-text");
        actionsComponent.appendChild(actionComponent);
        actionComponent.textContent = action;
    }
    else {
        var expressionResultComponent = document.getElementById("expressionResult");
        var currentResultExpressionComponent = document.createElement("ion-text");
        currentResultExpressionComponent.setAttribute("color", "danger");
        expressionResultComponent.appendChild(currentResultExpressionComponent);
        currentResultExpressionComponent.textContent = "Error occured while parsing expression at ".concat(stack[stack.length - 1], " , ").concat(element);
        window.clearInterval(timeFunction);
    }
};
var checkChildren = function () {
    var stackComponent = document.getElementById("stackRules");
    stackComponent.replaceChildren();
    var actionsComponent = document.getElementById("action");
    actionsComponent.replaceChildren();
    var productionRulesImplementedComponent = document.getElementById("productionRulesImplemented");
    productionRulesImplementedComponent.replaceChildren();
    var expressionComponent = document.getElementById("expression");
    expressionComponent.replaceChildren();
    var derivationComponent = document.getElementById("derivation");
    derivationComponent.replaceChildren();
    var expressionResultComponent = document.getElementById("expressionResult");
    expressionResultComponent.replaceChildren();
};
var ValidateExpression = function () {
    checkChildren();
    stack = ["0"];
    actions = [];
    //@ts-ignore
    input = document.getElementById("inputValueExpression").children[0].value.split(" ");
    var stackComponent = document.getElementById("stackRules");
    timeFunction = setInterval(function () {
        compute(input[0]);
        input.shift();
        stackComponent.replaceChildren();
        stack.forEach(function (stackElement) {
            var stackElementComponent = document.createElement("ion-text");
            stackComponent.classList.add("cardContent");
            stackElementComponent.classList.add("cardContent");
            stackComponent.appendChild(stackElementComponent);
            stackElementComponent.textContent = stackElement;
        });
    }, 500);
};
window.onload = function () {
    var productionRulesComponent = document.getElementById('productionRules');
    for (var rule in productionRules) {
        var ruleComponent = document.createElement("ion-text");
        productionRulesComponent.appendChild(ruleComponent);
        ruleComponent.textContent = productionRules[rule];
    }
    var parseTableComponent = document.getElementById('parseTable');
    var tableData = [];
    var headers = ["state"];
    for (var headerColumn in parsingTable[0]) {
        headers.push(headerColumn);
    }
    tableData.push(headers);
    for (var row in parsingTable) {
        var data = [row];
        for (var col in parsingTable[row]) {
            data.push(parsingTable[row][col]);
        }
        tableData.push(data);
    }
    tableData.forEach(function (row) {
        var rowComponent = document.createElement("ion-row");
        rowComponent.className = "rowCell";
        row.forEach(function (column, index) {
            var columnComponent = document.createElement("ion-column");
            columnComponent.className = "columnCell";
            columnComponent.id = "".concat(row[0]).concat(tableData[0][index]);
            rowComponent.appendChild(columnComponent);
            columnComponent.textContent = column == null ? '' : column;
        });
        parseTableComponent.appendChild(rowComponent);
    });
};
