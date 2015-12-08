import {GalleryViewModel} from "./gallery-view-model";
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

var viewModel: GalleryViewModel;
var page;
var imgView: Image;
var cup: Image;

export function navigatingTo(args: EventData) {
	console.log("navigatingTo");
	page = <Page>args.object;
	viewModel = new GalleryViewModel();
	page.bindingContext = viewModel;
}