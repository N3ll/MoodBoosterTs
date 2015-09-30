import {model} from "../../shared/model";
import {EventData} from "data/observable";
import {Button} from "ui/button";
import {Page} from "ui/page";

var page;
var viewPrev;
var viewNext;

export function load(args: EventData){
	page = <Page>args.object;
	page.bindingContext = model;
}

// export function changeQuestion(args){
	
// 	console.log(model.questions);
// 	console.log(JSON.stringify(model.currentQuestion));
	
// 	var button = <Button>args.object;
// 	if(button.text === "Next"){
	
// 	}else if(button.text === "Previous"){
// 		model.currentQuestion = model.questions[model.currentQuestion.order--];
// 	}
// }

export function previousTap(args: EventData) {
	console.log("Previous TAP");
	changeQuestion(-1);
}

export function nextTap(args: EventData) {
	console.log("Next TAP");
	changeQuestion(1);	
}

function changeQuestion(direction: number) {
	model.currentQuestion = model.questions[model.currentQuestion.order + direction - 1];
}



