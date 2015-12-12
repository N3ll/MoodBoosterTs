import {QuestionsViewModel} from "../quiz/questions-view-model";
import {EventData, PropertyChangeData} from "data/observable";
import {Page} from "ui/page";
import frameModule = require("ui/frame");

var viewModel: QuestionsViewModel;

// export function navigatingTo(args: EventData) {
// 	console.log("navigatingTo");
// 	page = <Page>args.object;
// 	viewModel = new QuestionsViewModel();
// 	page.bindingContext = viewModel;
// }

export function navigatedTo(args) {
    var page = args.object;
    page.bindingContext = page.navigationContext;
	console.log("context "+JSON.stringify(page.context));
}

export function tapToGallery(args){
	frameModule.topmost().navigate("./views/gallery/gallery");
}

export function tapToQuiz(args){
	frameModule.topmost().navigate("./views/quiz/questions");
}