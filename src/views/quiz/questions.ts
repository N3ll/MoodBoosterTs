import {QuestionsViewModel} from "./questions-view-model";
import {EventData} from "data/observable";
import {Button} from "ui/button";
import {Page} from "ui/page";
import {GestureEventData } from "ui/gestures"
import {Image} from "ui/image";

var viewModel: QuestionsViewModel;
var page;

export function navigatedTo(args: EventData) {
	page = <Page>args.object;
	viewModel = new QuestionsViewModel();
	page.bindingContext = viewModel;
}

export function saveAnswerTap(args: GestureEventData){
	 viewModel.saveAnswer(args.view.parent.bindingContext,args.view.bindingContext);
	}
	
export function animate(args:GestureEventData){
	var imgView =<Image> page.getViewById("coffee");
	imgView.animate({
    scale: { x: 0, y: 2},
    duration: 3000
});
}