//epsilon = 0.000001

function sin(x)
{
	return Math.sin(x);
}
function cos(x)
{
	return Math.cos(x);
}
function tan(x)
{
	return Math.tan(x);
}
function cot(x)
{
	return divide(1, Math.tan(x));
}
function exp(x)
{
	return Math.exp(x);
}
function log(x)
{
	return Math.log(x);
}
function sqrt(x)
{
	return Math.sqrt(x);
}
function max(x, y)
{
	return Math.max(x, y);
}
function min(x, y)
{
	return Math.min(x, y);
}
function abs(x)
{
	return Math.abs(x);
}

function add(a, b)
{
	return a+b;
}
function subtract(a, b)
{
	return a-b;
}
function multiply(a, b)
{
	return a*b;
}
function divide(a, b)
{
	return a/b;
}
function power(a, b)
{
	return Math.pow(a, b);
}
function negation(a)
{
	return -a;
}


let non_positive_power_base_derivarive_error_shown = false;

function sin_derivative(x, dx)
{
	return dx*Math.cos(x);
}
function cos_derivative(x, dx)
{
	return dx*(-Math.sin(x));
}
function tan_derivative(x, dx)
{
	if (Math.cos(x)==0)
	{
		return 0;
	}
	return dx*(1/Math.cos(x))^2;
}
function cot_derivative(x, dx)
{
	if (Math.sin(x)==0)
	{
		return 0;
	}
	return -2*dx*(cot(x))*(1/Math.sin(x))^2
}
function exp_derivative(x, dx)
{
	return Math.exp(x);
}
function log_derivative(x, dx)
{
	if (x==0)
	{
		return 0;
	}
	return dx/x;
}
function sqrt_derivative(x, dx)
{
	return dx/(2*sqrt(x));
}
function max_derivative(x, y, dx, dy)
{
	if (x>=y)
		return dx;
	else
		return dy;
}
function min_derivative(x, y, dx, dy)
{
	if (x<y)
		return dx;
	else
		return dy;
}
function abs_derivative(x, dx)
{
	if (x>0)
		return dx;
	else
		return -dx;
}

function add_derivative(a, b, da, db)
{
	return da+db;
}
function subtract_derivative(a, b, da, db)
{
	return da-db;
}
function multiply_derivative(a, b, da, db)
{
	return a*db+b*da;
}
function divide_derivative(a, b, da, db)
{
	return (a*db-b*da)/(b^2);
}
function power_derivative(a, b, da, db)
{
	if (a<=0)
	{
		if (db!=0)
		{
			if (!non_positive_power_base_derivarive_error_shown)
			{
				alert("derivatives of non-positive values raised to any power are not defined in this program, derivatives of such function will be set to 0. Consider changing the formula");
				non_positive_power_base_derivarive_error_shown = true;
			}
			return 0;
		}
		else
		{
			return Math.pow(a, b-1)*(b*da);
		}
	}
	return Math.pow(a, b-1)*(b*da+a*log(a)*db);
}
function negation_derivative(a, da)
{
	return -da;
}



constants = ["e", "pi"];
//variables = ["x"];
functions = ["sin", "cos", "tan", "cot", "log", "sqrt", "abs", "max", "min"];
operators = ["+", "-", "*", "/", "^", "neg"];
separators = [",", ";"];
brakets = ["(", ")"];
precedence = {
	"+": 1,
	"-": 1,
	"*": 2,
	"/": 2,
	"neg": 3,
	"^": 4
}
associativity = {
	"+": "left",
	"-": "left",
	"*": "left",
	"/": "left",
	"^": "right",
	"neg": "right"
}
functions_arguments = {
	"sin": 1,
	"cos": 1,
	"tan": 1,
	"cot": 1,
	"exp": 1,
	"log": 1,
	"sqrt": 1,
	"abs": 1,
	"max": 2,
	"min": 2
}
functions_objects = {
	"sin": sin,
	"cos": cos,
	"tan": tan,
	"cot": cot,
	"exp": exp,
	"log": log,
	"sqrt": sqrt,
	"abs": abs,
	"max": max,
	"min": min
}
operators_objects = {
	"+": add,
	"-": subtract,
	"*": multiply,
	"/": divide,
	"^": power,
	"neg": negation
}
operators_arguments = {
	"+": 2,
	"-": 2,
	"*": 2,
	"/": 2,
	"^": 2,
	"neg": 1
}

function_derivativs_objects = {
	"sin": sin_derivative,
	"cos": cos_derivative,
	"tan": tan_derivative,
	"cot": cot_derivative,
	"exp": exp_derivative,
	"log": log_derivative,
	"sqrt": sqrt_derivative,
	"abs": abs_derivative,
	"max": max_derivative,
	"min": min_derivative
}

operators_derivative_objects = {
	"+": add_derivative,
	"-": subtract_derivative,
	"*": multiply_derivative,
	"/": divide_derivative,
	"^": power_derivative,
	"neg": negation_derivative
}



function calculate_rpn_derivative(rpn, variables, variables_values, variable_derivative, variable_to_different_over)
{
	stack = [];
	derivative_stack = [];
	//console.log("rpn:");
	//console.log(rpn);

	for (let i = 0;i<rpn.length;i++)
	{
		/*console.log("ar:")
		console.log(stack);
		console.log(derivative_stack);
		console.log(rpn[i]);*/
		if (!isNaN(rpn[i]))
		{
			stack.push(rpn[i]);
			derivative_stack.push(0);
		}
		else if (constants.includes(rpn[i]))
		{
			stack.push(rpn[i]);
			derivative_stack.push(0);
		}
		else if (variables.includes(rpn[i]))
		{
			stack.push(rpn[i]);
			if (rpn[i]==variable_to_different_over)
				derivative_stack.push(variable_derivative);
			else
				derivative_stack.push(0);
		}
		else if (operators.includes(rpn[i]))
		{
			if (operators_arguments[rpn[i]]==2)
			{
				let b = stack.pop();
				let a = stack.pop();
				let db = derivative_stack.pop();
				let da = derivative_stack.pop();
				
				if (variables.includes(a))
					a = variables_values[variables.indexOf(a)];
				else if (constants.includes(a))
				{
					if (a == "e")
					{
						a = Math.E;
					}
					else if (a == "pi")
					{
						a = Math.PI;
					}
				}
				if (variables.includes(b))
					b = variables_values[variables.indexOf(b)];
				else if (constants.includes(b))
				{
					if (b == "e")
					{
						b = Math.E;
					}
					else if (a == "pi")
					{
						b = Math.PI;
					}
				}
				stack.push(operators_objects[rpn[i]](a, b));
				derivative_stack.push(operators_derivative_objects[rpn[i]](a, b, da, db));
			}
			else if (operators_arguments[rpn[i]]==1)
			{
				let a = stack.pop();
				let da = derivative_stack.pop();
				if (variables.includes(a))
					a = variables_values[variables.indexOf(a)];
				else if (constants.includes(a))
				{
					if (a == "e")
					{
						a = Math.E;
					}
					else if (a == "pi")
					{
						a = Math.PI;
					}
				}
				stack.push(operators_objects[rpn[i]](a));
				derivative_stack.push(operators_derivative_objects[rpn[i]](a, da));
			}
			else
			{
				console.log("undefined operator");
			}
		}
		else if (functions.includes(rpn[i]))
		{
			if (functions_arguments[rpn[i]]==2)
			{
				let b = stack.pop();
				let a = stack.pop();
				let db = derivative_stack.pop();
				let da = derivative_stack.pop();
				if (variables.includes(a))
					a = variables_values[variables.indexOf(a)];
				else if (constants.includes(a))
				{
					if (a == "e")
					{
						a = Math.E;
					}
					else if (a == "pi")
					{
						a = Math.PI;
					}
				}
				if (variables.includes(b))
					b = variables_values[variables.indexOf(b)];
				else if (constants.includes(b))
				{
					if (b == "e")
					{
						b = Math.E;
					}
					else if (a == "pi")
					{
						b = Math.PI;
					}
				}
				stack.push(functions_objects[rpn[i]](a, b));
				derivative_stack.push(function_derivativs_objects[rpn[i]](a, b, da, db));
			}
			else if (functions_arguments[rpn[i]]==1)
			{
				let a = stack.pop();
				let da = derivative_stack.pop();
				if (variables.includes(a))
					a = variables_values[variables.indexOf(a)];
				else if (constants.includes(a))
				{
					if (a == "e")
					{
						a = Math.E;
					}
					else if (a == "pi")
					{
						a = Math.PI;
					}
				}
				stack.push(functions_objects[rpn[i]](a));
				derivative_stack.push(function_derivativs_objects[rpn[i]](a, da));
			}
			else
			{
				console.log("undefined function");
			}
		}
	}
	
	/*console.log("ar:")
	console.log(stack);
	console.log(derivative_stack);
	console.log(rpn[rpn.length-1]);*/
	return derivative_stack;
}





function validateFormulaInput(input, variables, invalid_message_id) {
	// Join variables to create a pattern, and escape any special regex characters
	let validVars = variables.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
	// Add the valid variables to the regular expression
	let regexPattern = new RegExp(`[^-0123456789.sinctglomaxqrep+*/^(),;\\s${validVars}]`, 'g');
	
	// Perform replacement to filter out invalid characters
	input.value = input.value.replace(regexPattern, '');
	
	validate_formula(input, invalid_message_id, variables);
}



function tokenize_infix(formula, variables)
{
	//alert(variables);
	formula = formula.replace(/\s+/g, '');
	let tokens = constants.concat(variables).concat(functions).concat(operators).concat(separators).concat(brakets);
	tokens = tokens.filter(item => item !== "-");
	let tokenized_formula = [];
	let token = "";
	for(let i = 0;i<formula.length;i++)
	{
		token += formula[i];
		if (tokens.includes(token))
		{
			if (token == ";")
				token = ",";
			tokenized_formula.push(token);
			token = "";
		}
		else if (token == "-")
		{
			if (i == 0)
			{
				token = "neg";
			}
			else if (tokens.includes(formula[i-1]) && formula[i-1] != ")" && !variables.includes(formula[i-1]) && formula[i-1] != "e" && formula[i-1] != "pi" || formula[i-1] == "-")
			{
				token = "neg";
			}
			tokenized_formula.push(token);
			token = "";
		}
		else if (!isNaN(token))
		{
			if (i == formula.length-1)
			{
				tokenized_formula.push(token);
				token = "";
			}
			else if (isNaN(formula[i+1]))
			{
				if (formula[i+1] != ".")
				{
					tokenized_formula.push(token);
					token = "";
				}
				else if (token.includes("."))
				{
					return ["error"];
				}
			}
		}
	}
	if (token != "")
		return ["error"];
	return tokenized_formula;
}


function calculate_rpn(rpn, variables, variables_values)
{
	let stack = [];
	for (let i = 0;i<rpn.length;i++)
	{
		if (!isNaN(rpn[i]))
		{
			stack.push(rpn[i]);
		}
		else if (constants.includes(rpn[i]) || variables.includes(rpn[i]))
		{
			stack.push(rpn[i]);
		}
		else if(operators.includes(rpn[i]))
		{
			if (stack.length < operators_arguments[rpn[i]])
			{
				console.log(1);
				return "error";
			}
			if (operators_arguments[rpn[i]] == 2)
			{
				let b = stack.pop();
				let a = stack.pop();
				if (isNaN(a))
				{
					if (!variables.includes(a) && !constants.includes(a) && typeof a !== 'number')
					{
						console.log(2.11);
						return "error";
					}
					for (let i = 0;i<variables.length;i++)
					{
						if (a == variables[i])
						{
							a = variables_values[i];
							break;
						}
					}
					if (a == "e")
					{
						a = Math.E;
					}
					else if (a == "pi")
					{
						a = Math.PI;
					}
				}
				if (isNaN(b))
				{
					if (!variables.includes(b) && !constants.includes(b) && typeof b !== 'number')
					{
						console.log(2.12);
						return "error";
					}
					for (let i = 0;i<variables.length;i++)
					{
						if (b == variables[i])
						{
							b = variables_values[i];
							break;
						}
					}
					if (b == "e")
					{
						b = Math.E;
					}
					else if (b == "pi")
					{
						b = Math.PI;
					}
				}
				a = parseFloat(a);
				b = parseFloat(b);
				stack.push(operators_objects[rpn[i]](a, b));
			}
			else if (operators_arguments[rpn[i]] == 1)
			{
				var a = stack.pop();
				if (isNaN(a))
				{
					if (!variables.includes(a) && !constants.includes(a) && typeof a !== 'number')
					{
						console.log(a);
						console.log(2.11);
						return "error";
					}
					for (let i = 0;i<variables.length;i++)
					{
						if (a == variables[i])
						{
							a = variables_values[i];
							break;
						}
					}
					if (a == "e")
					{
						a = Math.E;
					}
					else if (a == "pi")
					{
						a = Math.PI;
					}
				}
				a = parseFloat(a);
				stack.push(operators_objects[rpn[i]](a));
			}
			
			
		}
		else if (functions.includes(rpn[i]))
		{
			if (stack.length < functions_arguments[rpn[i]])
			{
				console.log(3);
				return "error";
			}
			if (functions_arguments[rpn[i]] == 1)
			{
				let a = stack.pop();
				if (isNaN(a))
				{
					if (!variables.includes(a) && !constants.includes(a) && typeof a !== 'number')
					{
						console.log(String(a));
						console.log(2.21);
						return "error";
					}
					for (let i = 0;i<variables.length;i++)
					{
						if (a == variables[i])
						{
							a = variables_values[i];
							break;
						}
					}
					if (a == "e")
					{
						a = Math.E;
					}
					else if (a == "pi")
					{
						a = Math.PI;
					}
				}
				a = parseFloat(a);
				stack.push(functions_objects[rpn[i]](a));

			}
			else if (functions_arguments[rpn[i]] == 2)
			{
				let a = stack.pop();
				let b = stack.pop();
				if (isNaN(a))
				{
					if (!variables.includes(a) && !constants.includes(a) && typeof a !== 'number')
					{
						console.log(2.31);
						return "error";
					}
					for (let i = 0;i<variables.length;i++)
					{
						if (a == variables[i])
						{
							a = variables_values[i];
							break;
						}
					}
					if (a == "e")
					{
						a = Math.E;
					}
					else if (a == "pi")
					{
						a = Math.PI;
					}
				}
				if (isNaN(b))
				{
					if (!variables.includes(b) && !constants.includes(b) && typeof b !== 'number')
					{
						console.log(2.32);
						return "error";
					}
					for (let i = 0;i<variables.length;i++)
					{
						if (b == variables[i])
						{
							b = variables_values[i];
							break;
						}
					}
					if (b == "e")
					{
						b = Math.E;
					}
					else if (b == "pi")
					{
						b = Math.PI;
					}
				}
				a = parseFloat(a);
				b = parseFloat(b);
				stack.push(functions_objects[rpn[i]](a, b));
			}
		}
	}
	if (stack.length != 1)
	{
		console.log(4);
		return "error";
	}
	output = stack.pop();
	if (variables.includes(output))
	{
		return variables_values[variables.indexOf(output)];
	}
	else if (constants.includes(output))
	{
		if (output == "e")
		{
			return Math.E;
		}
		else if (output == "pi")
		{
			return Math.PI;
		}
	}
	return output;
}



function validate_formula(input, invalid_message_id, variables)
{
	let formula = input.value;
	//alert(formula);
	formula = tokenize_infix(formula, variables);
	//alert(formula);
	if (formula.length == 0)
	{
		$("#" + invalid_message_id).html("&nbsp;enter a formula");
		$("#" + invalid_message_id).show();
		return;
	}
	else if (formula[0]=="error")
	{
		$("#" + invalid_message_id).html("&nbsp;invalid formula, check for typos");
		$("#" + invalid_message_id).show();
		return;
	}
	else
	{
		$("#" + invalid_message_id).hide();
	}
	//to RPN
	let stack = [];
	let rpn = [];
	error = "";
	for (let i = 0; i < formula.length; i++)
	{
		if (!isNaN(formula[i]))
		{
			rpn.push(formula[i]);
		}
		else if (constants.includes(formula[i]) || variables.includes(formula[i]))
		{
			rpn.push(formula[i]);
		}
		else if (functions.includes(formula[i]))
		{
			stack.push(formula[i]);
		}
		else if (formula[i]==",")
		{
			while (stack.length > 0 && stack[stack.length-1] != "(")
			{
				rpn.push(stack.pop());
			}
			if (stack.length == 0)
			{
				error = 'inproper use of ","';
				break;
			}
			else if (stack.lenght<2)
			{
				error = 'inproper use of ","';
				break;
			}
			else if (!functions.includes(stack[stack.length-2]))
			{
				error = 'inproper use of ","';
				break;
			}
		}
		else if (operators.includes(formula[i]))
		{
			while (stack.length > 0 && operators.includes(stack[stack.length-1]) && (precedence[stack[stack.length-1]] > precedence[formula[i]] || (precedence[stack[stack.length-1]] == precedence[formula[i]] && associativity[formula[i]] == "left")))
			{
				rpn.push(stack.pop());
			}
			stack.push(formula[i]);
		}
		else if (formula[i] == "(")
		{
			stack.push(formula[i]);
		}
		else if (formula[i] == ")")
		{
			while (stack.length > 0 && stack[stack.length-1] != "(")
			{
				rpn.push(stack.pop());
			}
			if (stack.length == 0)
			{
				error = 'inproper use of ")"';
				break;
			}
			stack.pop();
			if (stack.length > 0 && functions.includes(stack[stack.length-1]))
			{
				rpn.push(stack.pop());
			}
		}
	}
	while (stack.length > 0)
	{
		if (stack[stack.length-1] == "(" || stack[stack.length-1] == ")")
		{
			error = 'inproper use of parentheses';
			break;
		}
		rpn.push(stack.pop());
	}
	if (error != "")
	{
		$("#" + invalid_message_id).html("&nbsp;"+error);
		$("#" + invalid_message_id).show();
		return;
	}
	//alert(rpn);
	if (calculate_rpn(rpn, variables, []) == "error")
	{
		$("#" + invalid_message_id).html("&nbsp;invalid formula");
		$("#" + invalid_message_id).show();
		return;
	}
	//alert(calculate_rpn(rpn, variables, []));


	
}


let activation_function_message_was_hidden = true;
let loss_function_message_was_hidden = true;

function validate_samples_input(input, invalid_message_id)
{
	//show invalid message if the input is empty or not natural number
	if (input.value == "" || parseFloat(input.value)<1 || parseInt(input.value) != parseFloat(input.value))
	{
		$("#" + invalid_message_id).show();
	}
	else
	{
		$("#" + invalid_message_id).hide();
	}
}

function validate_domain_input(input_min_id, input_max_id, invalid_message_id)
{
	let input_min = document.getElementById(input_min_id);
	let input_max = document.getElementById(input_max_id);
	if (input_min.value == "" || input_max.value == "")
	{
		$("#" + invalid_message_id).html("&nbsp;enter both min and max value");
		$("#" + invalid_message_id).show();
	}
	else if (parseFloat(input_min.value) >= parseFloat(input_max.value))
	{
		$("#" + invalid_message_id).html("&nbsp;min value must be less than max value");
		$("#" + invalid_message_id).show();
	}
	else
	{
		$("#" + invalid_message_id).hide();
	}
}


function train_button()
{
	validateFormulaInput(document.getElementById("formula"), ['x'], 'invalid_function_formula_message');
	if ($("#advanced_activation_function").is(':checked'))
	{
		validateFormulaInput(document.getElementById("activation_function_formula"), ['x'], 'invalid_activation_function_formula_message');
	}
	validate_domain_input('domain_min', 'domain_max', 'invalid_domain_message');
	if ($("#advanced_loss_function").is(':checked'))
	{
		validateFormulaInput(document.getElementById("loss_function_formula"), ['y', 'true_label'], 'invalid_loss_function_formula_message');
	}
	validate_samples_input(document.getElementById("train_samples"), 'invalid_train_samples_message');
	validate_samples_input(document.getElementById("test_samples"), 'invalid_test_samples_message');

	if ($("#invalid_function_formula_message").is(":hidden") && $("#invalid_domain_message").is(":hidden") && $("#invalid_train_samples_message").is(":hidden") && $("#invalid_test_samples_message").is(":hidden") && $("#invalid_activation_function_formula_message").is(":hidden") && $("#invalid_loss_function_formula_message").is(":hidden"))
	{
		formula = $("#formula").val();
		if ($("#advanced_activation_function").is(':checked'))
		{
			activation_function = $("#activation_function_formula").val();
		}
		else
		{
			activation_function = $("#activation_function").val();
		}
		domain_min = parseFloat($("#domain_min").val());
		domain_max = parseFloat($("#domain_max").val());
		if ($("#advanced_loss_function").is(':checked'))
		{
			loss_function = $("#loss_function_formula").val();
		}
		else
		{
			loss_function = $("#loss_function").val();
		}
		train_samples = parseInt($("#train_samples").val());
		test_samples = parseInt($("#test_samples").val());

		data = {formula: formula, activation_function: activation_function, domain_min: domain_min, domain_max: domain_max, loss_function: loss_function, train_samples: train_samples, test_samples: test_samples};
		params = new URLSearchParams(data).toString();
		window.location.href = "train/index.html?" + params;
	}


}

$(document).ready(function()
{
	$("#advanced_activation_function").change(function() {
		if ($("#advanced_activation_function").is(':checked'))
		{
			$("#domain_title").css("margin-top", "66px");
			$("#activation_function_formula").show();
			$("#activation_function").hide();
			if (!activation_function_message_was_hidden)
			{
				$("#invalid_activation_function_formula_message").show();
			}
		}
		else
		{
			$("#domain_title").css("margin-top", "0px");
			$("#activation_function_formula").hide();
			$("#activation_function").show();
			if ($("#invalid_activation_function_formula_message").is(":hidden"))
			{
				activation_function_message_was_hidden = true;
			}
			else
			{
				activation_function_message_was_hidden = false;
			}
			$("#invalid_activation_function_formula_message").hide();
		}
	});

	$("#advanced_loss_function").change(function() {
		if ($("#advanced_loss_function").is(':checked'))
		{
			$("#training_samples_title").css("margin-top", "76px");
			$("#loss_function_formula").show();
			$("#loss_function").hide();
			if (!loss_function_message_was_hidden)
			{
				$("#invalid_loss_function_formula_message").show();
			}
		}
		else
		{
			$("#training_samples_title").css("margin-top", "10px");
			$("#loss_function_formula").hide();
			$("#loss_function").show();
			if ($("#invalid_loss_function_formula_message").is(":hidden"))
			{
				loss_function_message_was_hidden = true;
			}
			else
			{
				loss_function_message_was_hidden = false;
			}
			$("#invalid_loss_function_formula_message").hide();
		}
	});
});