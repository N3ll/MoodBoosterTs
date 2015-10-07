import {QuestionsViewModel} from "./questions-view-model";
import {EventData} from "data/observable";
import {Button} from "ui/button";
import {Page} from "ui/page";
import { GestureEventData } from "ui/gestures"

var viewModel: QuestionsViewModel;

export function navigatedTo(args: EventData) {
	var page = <Page>args.object;
	viewModel = new QuestionsViewModel();
	page.bindingContext = viewModel;
}

export function saveAnswerTap(args: GestureEventData){
	 viewModel.saveAnswer(args.view.parent.bindingContext,args.view.bindingContext);
	}