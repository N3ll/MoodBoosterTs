import {el} from "../../shared/config";
import frameModule = require("ui/frame");
import {model} from "../../shared/model";

export function load(args) {
	var page = args.object;
	page.bindingContext = model.user;
}

export function register() {
	console.log(`register, email: ${model.user.email}, password: ${model.user.password}`);
	el.Users.register(model.user.email, model.user.password)
		.then(function() {
			console.log(`register success, email: ${model.user.email}, password: ${model.user.password}`);
			frameModule.topmost().navigate("./views/options/options");
		})
		.catch(function(error) {
			console.log(JSON.stringify(error));
		})
}