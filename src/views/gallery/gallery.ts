import {GalleryViewModel} from "./gallery-view-model";
import {EventData, PropertyChangeData} from "data/observable";
import {Page} from "ui/page";

var viewModel: GalleryViewModel;
var page;

export function navigatingTo(args: EventData) {
	console.log("navigatingTo");
	page = <Page>args.object;
	viewModel = new GalleryViewModel();
	page.bindingContext = viewModel;
}