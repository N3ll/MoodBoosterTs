import frameModule = require("ui/frame");
import {el} from "../../shared/config";
import {model} from "../../shared/model";
import {Page} from "ui/page";

export function load(args) {
	var page = <Page>args.object;
	page.bindingContext =model.user;
}

export function register() {
	var topmost = frameModule.topmost();
	topmost.navigate("./views/register/register");
}

export function signIn() {
	console.log(`signIn, email: ${model.user.email}, password: ${model.user.password}`);
	el.authentication.login(model.user.email, model.user.password)
		.then(function() {
			console.log(`signIn success, email: ${model.user.email}, password: ${model.user.password}`);
			frameModule.topmost().navigate("./views/options/options");
		})
		.catch(function(error) {
			console.log(JSON.stringify(error));
		});
}