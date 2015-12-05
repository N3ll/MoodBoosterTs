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
	page = <Page>args.object;
	viewModel = new QuestionsViewModel();
	page.bindingContext = viewModel;

	var slider = <Slider>page.getViewById("slider");

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
	imgView = <Image>page.getViewById("coffee");
	cup = <Image>page.getViewById("cup");

	slider.on(Slider.propertyChangeEvent, function(args: PropertyChangeData) {
		animateCup(Math.round(args.value));
	});
}

export function saveAnswer(args) {
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


