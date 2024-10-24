const urlParams = new URLSearchParams(window.location.search);
let formula = urlParams.get('formula');
let activation_function_original = urlParams.get('activation_function');
const domain_min = parseFloat(urlParams.get('domain_min'));
const domain_max = parseFloat(urlParams.get('domain_max'));
let loss_function_original = urlParams.get('loss_function');
const train_samples = urlParams.get('train_samples');
const test_samples = urlParams.get('test_samples');


const layer1_size = 100;
const layer2_size = 100;
const layer3_size = 1;

function to_rpn(formula, variables)
{
	formula = tokenize_infix(formula, variables);
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
			else if (stack.length<2)
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
		return error;
	}
	return rpn;
}

//alert(calculate_rpn_derivative(to_rpn("2*x*sin(cos(log(x)))^2", ["x"]), ["x"], [3], [1], "x"));




let activation_function_formula = activation_function_original;
let loss_function_formula = loss_function_original;

if (activation_function_formula == "ReLU")
{
	activation_function_formula = "max(0, x)";
}
else if (activation_function_formula == "Sigmoid")
{
	activation_function_formula = "1/(1+e^(-x))";
}
else if (activation_function_formula == "Tanh")
{
	activation_function_formula = "(e^(x)-e^(-x))/(e^(x)+e^(-x))";
}

if (loss_function_formula == "MSE")
{
	loss_function_formula = "abs(y-true_label)^2";
}
else if (loss_function_formula == "MAE")
{
	loss_function_formula = "abs(y-true_label)";
}

activation_function_formula = to_rpn(activation_function_formula, ["x"]);
//alert(activation_function_formula);
loss_function_formula = to_rpn(loss_function_formula, ["y", "true_label"]);
//alert(loss_function_formula);

let learning_rate = 0.01;


let chart = null;
function draw_chart(x, y1, y2=null) {
	const ctx = document.getElementById('chart').getContext('2d');

	if (y2===null) {
		var data = {
			labels: x,
			datasets: [{
				label: 'target function',
				data: y1,
				borderColor: 'rgba(255, 0, 0, 1)',
				pointRadius: 0
			}]
		};
	}
	else {
		var data = {
			labels: x,
			datasets: [{
				label: 'target function',
				data: y1,
				borderColor: 'rgba(255, 0, 0, 1)',
				pointRadius: 0
			},
			{
				label: 'model function',
				data: y2,
				borderColor: 'rgba(0, 0, 255, 1)',
				pointRadius: 0
			}
		]
		};
	}

	const config = {
		type: 'line',
		data: data,
		options: {
			animation: false,
			//maintainAspectRatio: false,
			scales: {
				x: {
					type: 'linear',
					ticks: {
						display: false
					},
					grid: {
						display: false
					},
					title: {
						display: false
					}
				},
				y: {
					ticks: {
						display: false
					},
					grid: {
						display: false
					},
					title: {
						display: false
					}
				}
			}
		}
	};

	chart = new Chart(ctx, config);
}



function calculate_derivative_of_formulas_sequence(formulas, variables, variables_values, variable, variable_derivative)
{
	/*
	calcualtes the derivative over the variable of the sequence of formulas. the assumptin is the result of the formula of index i is the value of variable with name given in 'variable' in sequence of index i+1
	the variable_values[i] is the value of i formula
	*/
	derivatives = Array(formulas.length);
	for (let i = formulas.length-1; i >= 0; i--)
	{
		if (i == formulas.length-1)
		{
			derivatives[i] = calculate_rpn_derivative(formulas[i], variables[i], variables_values[i], variable_derivative, variable);
		}
		else
		{
			derivatives[i] = calculate_rpn_derivative(formulas[i], variables[i], variables_values[i], derivatives[i+1], variable);
		}

		
	}
	return derivatives[0];
}

//alert(calculate_derivative_of_formulas_sequence([to_rpn("sin(x)", ["x"]), to_rpn("x*2", ["x"]), to_rpn("x^2", ["x"])], [["x"], ["x"], ["x"]], [[3.1], [0.0415807], [0.0831614]], "x", 1));



function activation_function(x)
{
	return calculate_rpn(activation_function_formula, ["x"], [x]);
}
function loss_function(y, true_label)
{
	return calculate_rpn(loss_function_formula, ["y", "true_label"], [y, true_label]);
}


function round(a, decimal_place)
{
	return Math.round(a*Math.pow(10, decimal_place))/Math.pow(10, decimal_place);
}

$(document).ready(function() {
	
	train = false;
	//$("#test").text("Formula: " + formula + " Activation Function: " + activation_function + " Domain Min: " + domain_min + " Domain Max: " + domain_max + " Loss Function: " + loss_function + " Train Samples: " + train_samples + " Test Samples: " + test_samples);
	$("#learning_rate_input").on("change", function() {
		if (parseFloat(this.value) < 0 && learning_rate >= 0) {
			alert("Warning! Learning rate shouldn't be negative. Negative learning rate leads to divergence.");
		}
		else if (parseFloat(this.value) == 0 && learning_rate != 0) {
			alert("Warning! Learning rate is set to zero. The model won't be changing.");
		}
		learning_rate = parseFloat(this.value);
	});
	$("#stop").on("click", function() {
		$("#stop_div").hide();
		$("#play_div").show();
		train = false;
	});
	$("#play").on("click", function() {
		$("#play_div").hide();
		$("#stop_div").show();
		train = true;
	});
	$("#reset").on("click", function() {
		$("#stop_div").hide();
		$("#play_div").show();
		train = false;

		let points_numebr = 1000;
		let correct_x = [];
		let correct_y = [];
		for (let i = 0; i < points_numebr; i++)
		{
			correct_x.push(domain_min + i*(domain_max-domain_min)/points_numebr);
			correct_y.push(calculate_rpn(rpn_formula, variables, [correct_x[i]]));
		}
		let x_train = [];
		let y_train = [];
		for (let i = 0; i < train_samples; i++)
		{
			x_train.push(domain_min + Math.random()*(domain_max-domain_min));
		}
		x_train = x_train.sort((a, b) => a - b);
		for (let i = 0; i < train_samples; i++)
		{
			y_train.push(calculate_rpn(rpn_formula, variables, [x_train[i]]));
		}
		let x_test = [];
		let y_test = [];
		for (let i = 0; i < test_samples; i++)
		{
			x_test.push(domain_min + Math.random()*(domain_max-domain_min));
		}
		x_test = x_test.sort((a, b) => a - b);
		for (let i = 0; i < test_samples; i++)
		{
			y_test.push(calculate_rpn(rpn_formula, variables, [x_test[i]]));
		}

		layer1_weights = [];
		layer1_biases = [];
		layer2_weights = [];
		layer2_biases = [];
		layer3_weights = [];
		layer3_biases = [];
		/*output_bias = Math.random()-0.5;
		for (let i = 0;i<layer1_size;i++)
		{
			weights[i] = Math.random()-0.5;
			biases[i] = Math.random()-0.5;
			output_weights[i] = Math.random()-0.5;
		}*/
		for (let i = 0;i<layer1_size;i++)
		{
			layer1_weights.push([generate_random_value()]);
			layer1_biases.push([generate_random_value()]);
		}
		for (let i = 0;i<layer2_size;i++)
		{
			layer2_weights.push([]);
			for(let j = 0;j<layer1_size;j++)
			{
				layer2_weights[i].push(generate_random_value());
			}
			layer2_biases.push(generate_random_value());
		}
		for (let i = 0;i<layer3_size;i++)
		{
			layer3_weights.push([]);
			for(let j = 0;j<layer2_size;j++)
			{
				layer3_weights[i].push(generate_random_value());
			}
			layer3_biases.push(generate_random_value());
		}
		y_plot = [];
		for(let i = 0; i < points_numebr; i++)
		{
			y_plot.push(forward(correct_x[i])[0]);
		}
		chart.destroy();
		draw_chart(correct_x, correct_y, y_plot);
		epoch = 0;
		$("#epoch_number").text(epoch);
		$("#training_loss_value").text("0");
		$("#test_loss_value").text("0");
	});
	
	$("#formula").text(`formula: ${formula}`);
	$("#activation_function").text(`activation function: ${activation_function_original}`);
	$("#domain").text(`domain: from ${domain_min} to ${domain_max}`);
	$("#loss_function").text(`loss function: ${loss_function_original}`);
	$("#samples_number").html(`samples: &nbsp;train: ${train_samples}&nbsp;&nbsp; test: ${test_samples}`);

	
		


	let variables = ["x"];
	
	const rpn_formula = to_rpn(formula, ["x"]);
	//alert(rpn_formula);

	//alert(activation_function(10));
	//alert(activation_function(-10));
	

	let points_numebr = 1000;
	let correct_x = [];
	let correct_y = [];
	for (let i = 0; i < points_numebr; i++)
	{
		correct_x.push(domain_min + i*(domain_max-domain_min)/points_numebr);
		correct_y.push(calculate_rpn(rpn_formula, variables, [correct_x[i]]));
	}
	let x_train = [];
	let y_train = [];
	for (let i = 0; i < train_samples; i++)
	{
		x_train.push(domain_min + Math.random()*(domain_max-domain_min));
	}
	x_train = x_train.sort((a, b) => a - b);
	for (let i = 0; i < train_samples; i++)
	{
		y_train.push(calculate_rpn(rpn_formula, variables, [x_train[i]]));
	}
	let x_test = [];
	let y_test = [];
	for (let i = 0; i < test_samples; i++)
	{
		x_test.push(domain_min + Math.random()*(domain_max-domain_min));
	}
	x_test = x_test.sort((a, b) => a - b);
	for (let i = 0; i < test_samples; i++)
	{
		y_test.push(calculate_rpn(rpn_formula, variables, [x_test[i]]));
	}
	//alert(correct_x);
	//alert(correct_y);
	$("#loading_container").hide();
	//draw_chart(correct_x, correct_y);
	//draw_chart(x_test, y_test);
	//draw_chart(correct_x, correct_y, y_test)


	//alert(rpn_formula);
	//alert(calculate_rpn_derivative(rpn_formula, ["x"], [5], 1, "x"));
	//alert(calculate_rpn_derivative(loss_function_formula, ["y", "true_label"], [13, 10], 2, "y"));
	//alert(calculate_rpn(loss_function_formula, ["y", "true_label"], [11, 10]));

	function generate_random_value()
	{
		return (Math.random()-0.5);
	}

	layer1_weights = [];
	layer1_biases = [];
	layer2_weights = [];
	layer2_biases = [];
	layer3_weights = [];
	layer3_biases = [];
	/*output_bias = Math.random()-0.5;
	for (let i = 0;i<layer1_size;i++)
	{
		weights[i] = Math.random()-0.5;
		biases[i] = Math.random()-0.5;
		output_weights[i] = Math.random()-0.5;
	}*/
	for (let i = 0;i<layer1_size;i++)
	{
		layer1_weights.push([generate_random_value()]);
		layer1_biases.push([generate_random_value()]);
	}
	for (let i = 0;i<layer2_size;i++)
	{
		layer2_weights.push([]);
		for(let j = 0;j<layer1_size;j++)
		{
			layer2_weights[i].push(generate_random_value());
		}
		layer2_biases.push(generate_random_value());
	}
	for (let i = 0;i<layer3_size;i++)
	{
		layer3_weights.push([]);
		for(let j = 0;j<layer2_size;j++)
		{
			layer3_weights[i].push(generate_random_value());
		}
		layer3_biases.push(generate_random_value());
	}
	y_plot = [];
	for(let i = 0; i < points_numebr; i++)
	{
		y_plot.push(forward(correct_x[i])[0]);
	}
	draw_chart(correct_x, correct_y, y_plot);

	function forward(x)
	{
		let layer1_neurons_values = Array(layer1_size);
		for (let i = 0;i<layer1_size;i++)
		{
			layer1_neurons_values[i] = x*layer1_weights[i][0]+layer1_biases[i];
			layer1_neurons_values[i] = activation_function(layer1_neurons_values[i]);

		}
		let layer2_neurons_values = Array(layer2_size);
		for (let i = 0;i<layer2_size;i++)
		{
			layer2_neurons_values[i] = layer2_biases[i];
			for (let j = 0;j<layer1_size;j++)
			{
				layer2_neurons_values[i] += layer1_neurons_values[j]*layer2_weights[i][j];
			}
			layer2_neurons_values[i] = activation_function(layer2_neurons_values[i]);
		}
		let layer3_neurons_values = Array(layer3_size);
		for (let i = 0;i<layer3_size;i++)
		{
			layer3_neurons_values[i] = layer3_biases[i];
			for (let j = 0;j<layer2_size;j++)
			{
				layer3_neurons_values[i] += layer2_neurons_values[j]*layer3_weights[i][j];
			}
		}
		return [layer3_neurons_values[0], layer1_neurons_values, layer2_neurons_values];
	}

	function iteration()
	{
		let train_loss = 0;
		for (let i = 0; i < train_samples; i++)
		{
			forward_output = forward(x_train[i]);
			let y = forward_output[0];
			train_loss += loss_function(y, y_train[i]);
			let layer1_neurons_values = forward_output[1];
			let layer2_neurons_values = forward_output[2];
			let y_derivcative = calculate_rpn_derivative(loss_function_formula, ["y", "true_label"], [y, y_train[i]], 1, "y");
			let layer3_weights_derivative = Array(layer3_size);
			for (let j = 0;j<layer3_size;j++)
			{
				layer3_weights_derivative[j] = y_derivcative*layer2_neurons_values[j];
			}
			let layer3_bias_derivative = y_derivcative;
			let layer2_neurons_values_derivative = Array(layer2_size);
			for (let j = 0;j<layer2_size;j++)
			{
				layer2_neurons_values_derivative[j] = 0;
				for (let k = 0;k<layer3_size;k++)
				{
					layer2_neurons_values_derivative[j] += y_derivcative*layer3_weights[k][j];
				}
				layer2_neurons_values_derivative[j] *= calculate_rpn_derivative(activation_function_formula, ["x"], [layer2_neurons_values[j]], 1, "x");
			}
			let layer2_weights_derivative = Array(layer2_size);
			for (let j = 0;j<layer2_size;j++)
			{
				layer2_weights_derivative[j] = Array(layer1_size);
				for (let k = 0;k<layer1_size;k++)
				{
					layer2_weights_derivative[j][k] = layer2_neurons_values_derivative[j]*layer1_neurons_values[k];
				}
			}
			let layer2_biases_derivative = Array(layer2_size);
			for (let j = 0;j<layer2_size;j++)
			{
				layer2_biases_derivative[j] = layer2_neurons_values_derivative[j];
			}
			let layer1_neurons_values_derivative = Array(layer1_size);
			for (let j = 0;j<layer1_size;j++)
			{
				layer1_neurons_values_derivative[j] = 0;
				for (let k = 0;k<layer2_size;k++)
				{
					layer1_neurons_values_derivative[j] += layer2_neurons_values_derivative[k]*layer2_weights[k][j];
				}
				layer1_neurons_values_derivative[j] *= calculate_rpn_derivative(activation_function_formula, ["x"], [layer1_neurons_values[j]], 1, "x");
			}
			let layer1_weights_derivative = Array(layer1_size);
			for (let j = 0;j<layer1_size;j++)
			{
				layer1_weights_derivative[j] = Array(1);
				layer1_weights_derivative[j][0] = layer1_neurons_values_derivative[j]*x_train[i];
			}
			let layer1_biases_derivative = Array(layer1_size);
			for (let j = 0;j<layer1_size;j++)
			{
				layer1_biases_derivative[j] = layer1_neurons_values_derivative[j];
			}
			for (let j = 0;j<layer3_size;j++)
			{
				layer3_weights[0][j] -= learning_rate*layer3_weights_derivative[j];
			}
			layer3_biases[0] -= learning_rate*layer3_bias_derivative;
			for (let j = 0;j<layer2_size;j++)
			{
				for (let k = 0;k<layer1_size;k++)
				{
					layer2_weights[j][k] -= learning_rate*layer2_weights_derivative[j][k];
				}
				layer2_biases[j] -= learning_rate*layer2_biases_derivative[j];
			}
			for (let j = 0;j<layer1_size;j++)
			{
				layer1_weights[j][0] -= learning_rate*layer1_weights_derivative[j][0];
				layer1_biases[j] -= learning_rate*layer1_biases_derivative[j];
			}
		}

		$("#training_loss_value").text(round(train_loss/train_samples, 6));
		let test_loss = 0;
		for (let i = 0; i < test_samples; i++)
		{
			forward_output = forward(x_test[i]);
			let y = forward_output[0];
			test_loss += loss_function(y, y_test[i]);
		}
		$("#test_loss_value").text(round(test_loss/test_samples, 6));
	}


	$("#step").on("click", function() {
		epoch++;
		$("#epoch_number").text(epoch);
		//console.log(epoch);
		iteration();
		if (train)
		{
			$("#stop_div").hide();
			$("#play_div").show();
			train = false;
		}
		//plot
		let y = [];
		for (let i = 0; i < points_numebr; i++)
		{
			y.push(forward(correct_x[i])[0]);
		}
		//console.log(y);
		chart.destroy();
		draw_chart(correct_x, correct_y, y);

	});
	

	epoch = 0
	const interval = setInterval(() => {
		if (train)
		{
			epoch++;
			$("#epoch_number").text(epoch);
			//console.log(epoch);
			iteration();
			//plot
			let y = [];
			for (let i = 0; i < points_numebr; i++)
			{
				y.push(forward(correct_x[i])[0]);
			}
			chart.destroy();
			draw_chart(correct_x, correct_y, y);
		}
	}, 100);


	//clearInterval(interval);




});