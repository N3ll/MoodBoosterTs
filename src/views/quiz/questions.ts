import {model} from "../../shared/model";
import {EventData} from "data/observable";
import {Page} from "ui/page";

export function load(args: EventData){
	var page = <Page>args.object;
	page.bindingContext = model;
}



