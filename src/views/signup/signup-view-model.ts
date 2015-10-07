import {Observable} from "data/observable";
import dialogsModule = require("ui/dialogs");
import {el} from "../../shared/config";
import frameModule = require("ui/frame");
import {Utility} from "../../shared/util";

export class SignupViewModel extends Observable {
	private _email: string;
	private _password: string;
	private _util:Utility;

	constructor() {
		super();
		this._email = "";
		this._password = "";
	}

	get email(): string {
		return this._email;
	}

	set email(value: string) {
		if (this._email !== value) {
			this._email = value;

			this.notify({
				eventName: "propertyChange",
				propertyName: "email",
				object: this,
				value: value
			});
		}
	}

	get password(): string {
		return this._password;
	}

	set password(value: string) {
		if (this._password !== value) {
			this._password = value;

			this.notify({
				eventName: "propertyChange",
				propertyName: "password",
				object: this,
				value: value
			});
		}
	}
	
	public get util():Utility{
		return this._util;
	}
	
	public set util(value:Utility){
		if (this._util !== value){
			this._util = value;
			this.notify({
						eventName: "propertyChange",
						propertyName: "util",
						object: this,
						value: this._util
					});
		}
	}

	public signUp() {
		if(!this.util.beginLoading())return;
		console.log(`register, email: ${this.email}, password: ${this.password}`);
		el.Users.register(this.email, this.password)
			.then(function() {
				this.util.endLoading();
				console.log(`register success, email: ${this.email}, password: ${this.password}`);
				frameModule.topmost().navigate("./views/options/options");
			})
			.catch(function(error) {
				console.log(JSON.stringify(error));
				this.util.endLoading();
			})
	}
}