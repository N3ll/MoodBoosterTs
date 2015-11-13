import {QuestionsViewModel} from "./questions-view-model";
import {EventData,PropertyChangeData} from "data/observable";
import {Button} from "ui/button";
import {Page} from "ui/page";
import {GestureEventData } from "ui/gestures"
import {Image} from "ui/image";
import {GestureTypes} from "ui/gestures";
import {Slider} from "ui/slider";

var viewModel: QuestionsViewModel;
var page;
var imgView: Image;
var cup: Image;

export function navigatedTo(args: EventData) {
	page = <Page>args.object;
	viewModel = new QuestionsViewModel();
	page.bindingContext = viewModel;

	var slider = <Slider>page.getViewById("slider");
	console.log(slider.value);
	slider.value=0;
	console.log(slider.value);
	
	imgView = <Image>page.getViewById("coffee");
	cup = <Image>page.getViewById("cup");
	
	slider.on(Slider.propertyChangeEvent, function(args:PropertyChangeData) {
	animateCup(Math.round(args.value));
	});
}

function animateCup(state: number) {
	switch (state) {
		case 0:
			cup.src = "~/images/f1.png";
			imgView.animate({
				opacity:1,
				scale: { x: 1, y: 1 },
				duration: 2000
			})
			break;
		case 1:
			cup.src = "~/images/f2.png";
			imgView.animate({
				opacity:1,
				scale: { x: 18 / 19, y: 6 / 7 },
				duration: 2000
			})
			break;
		case 2:
			cup.src = "~/images/f3.png";
			imgView.animate({
				opacity:1,
				scale: { x: 17 / 19, y: 5 / 7 },
				duration: 2000
			})
			break;
		case 3:
			cup.src = "~/images/f4.png";
			imgView.animate({
				// scale: { x: 1 / 2, y: 1/2},
				opacity:0,
				duration: 500
			})
			break;
		default:
		cup.src = "~/images/f1.png";
			imgView.animate({
				opacity:1,
				scale: { x: 1, y: 1 },
				duration: 2000
			})
			break;
		
	}
}


export function saveAnswerTap(args: GestureEventData) {
	viewModel.saveAnswer(args.view.parent.bindingContext, args.view.bindingContext);
}
