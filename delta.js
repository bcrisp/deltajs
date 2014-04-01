/*
The MIT License (MIT)

Copyright (c) 2014 Brandon Crisp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var FAlgebra;

function setStructure(algebra)
{
	FAlgebra = algebra;
}

// find the string representation of the state object
function findPath (state)
{
	var result;
	function ci(tree, final, acc){

		if (tree == final)
		{
			result = acc;
			return;
		}

		Object.keys(tree).forEach(function (child) {
			return ci(tree[child], final, acc + "." + child);
		});
	};

	ci(FAlgebra, state, 'FAlgebra');

	return result;
}


// call each UI transition in order
function executeChain(algebra, transitionPath) {

    $('.FAlgebra').hide();
    $('.clientalert').hide();

    if (typeof(transitionPath) == 'object')
        transitionPath = findPath(transitionPath);

	var acc = algebra;
	var states = transitionPath.split('.');

	$(states).slice(1).each(function(i, a){
		acc = acc[a];
		if (typeof(acc.f) == 'function')
		    acc.f();
	});
}

var transitionTo = function (state) {
    executeChain(FAlgebra, state);
}

function setTransition(state, transition) {
    if (state){
        var path = findPath(state);

        if (state.f)
            new Error(state + ' already has a transition function attached. Please add additional functionality to the existing function');
        else
            state.f = transition;
    }
    else console.log(state + ' is not a recognized path.');
}

 // jQuery plugin
(function ($) {

    $.fn.setTransition = function (state, transition) {

        if (state) {
            var path = findPath(state);
            if (transition)
                state.f = transition;

            $(this).click(function () {
                executeChain(FAlgebra, path);
            });
        }
        else console.log(state + ' is not a recognized path.');
    }

}(jQuery));