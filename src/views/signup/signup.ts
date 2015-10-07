import {SignupViewModel} from "./signup-view-model";
import {Page} from "ui/page";
import {EventData} from "data/observable";

var viewModel: SignupViewModel;

export function navigatedTo(args:EventData) {
	var page = <Page>args.object;
	viewModel = new SignupViewModel();
	page.bindingContext = viewModel;
}
