import {QuestionsViewModel} from "./questions-view-model";
import {EventData, PropertyChangeData} from "data/observable";
import {Button} from "ui/button";
import {Page} from "ui/page";
import {Label} from "ui/label";
import {GestureEventData } from "ui/gestures"
import {Image} from "ui/image";
import {GestureTypes} from "ui/gestures";
import {Slider} from "ui/slider";
import {ScrollView} from "ui/scroll-view";
import {device, platformNames} from "platform";

var viewModel: QuestionsViewModel;
var page;
var imgView: Image;
var cup: Image;

export function navigatingTo(args: EventData) {
	console.log("navigatingTo");
	page = <Page>args.object;
	viewModel = new QuestionsViewModel();
	page.bindingContext = viewModel;

	var slider = <Slider>page.getViewById("slider");
	imgView = <Image>page.getViewById("coffee");
	cup = <Image>page.getViewById("cup");

	// TODO: rethink this
	slider.on("propertyChange", function(args: PropertyChangeData) {
		// console.log("args.propertyName: " + args.propertyName);
		if(args.propertyName === "value"){
			animateCup(Math.round(args.value));
		}
	});
}
export function loaded(args: EventData) {
	var slider = <Slider>page.getViewById("slider");
	page = <Page>args.object;
	if (device.os === platformNames.android) {
		slider.android.setOnTouchListener(new android.view.View.OnTouchListener(
			{
				onTouch(view, event) {
					var action = event.getAction();
					switch (action) {
						case android.view.MotionEvent.ACTION_DOWN:
							// Disallow ScrollView to intercept touch events.
							view.getParent().requestDisallowInterceptTouchEvent(true);
							break;

						case android.view.MotionEvent.ACTION_UP:
							// Allow ScrollView to intercept touch events.
							view.getParent().requestDisallowInterceptTouchEvent(false);
							break;
					}
					// Handle ListView touch events.
					view.onTouchEvent(event);
					return true;
				}
			}));
	}
}


export function saveAnswer(args) {
	console.log("view: " + args.view);
	console.log("object: " + args.object);
	
	console.log("view.idAnswer: " + args.view.idAnswer);
	console.log("object.idAnswer: " + args.object.idAnswer);

	console.log("idAnswer " + args.object.idAnswer);
	viewModel.saveAnswer(args.object.idAnswer);
}

function animateCup(state: number) {
	switch (state) {
		case 0:
			cup.src = "~/images/f1.png";
			imgView.animate({
				opacity: 1,
				scale: { x: 1, y: 1 },
				duration: 2000
			})
			break;
		case 1:
			cup.src = "~/images/f2.png";
			imgView.animate({
				opacity: 1,
				scale: { x: 18 / 19, y: 6 / 7 },
				duration: 2000
			})
			break;
		case 2:
			cup.src = "~/images/f3.png";
			imgView.animate({
				opacity: 1,
				scale: { x: 17 / 19, y: 5 / 7 },
				duration: 2000
			})
			break;
		case 3:
			cup.src = "~/images/f4.png";
			imgView.animate({
				// scale: { x: 1 / 2, y: 1/2},
				opacity: 0,
				duration: 500
			})
			break;
		default:
			cup.src = "~/images/f1.png";
			imgView.animate({
				opacity: 1,
				scale: { x: 1, y: 1 },
				duration: 2000
			})
			break;

	}
}


