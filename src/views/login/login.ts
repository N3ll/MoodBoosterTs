import {LoginViewModel} from "./login-view-model";
import {Page} from "ui/page";
import {EventData} from "data/observable";

var viewModel:LoginViewModel;

export function navigatingTo(args: EventData){
	console.log("navigated to login");
	var page = <Page> args.object;
	viewModel = new LoginViewModel();
	page.bindingContext = viewModel;
}
