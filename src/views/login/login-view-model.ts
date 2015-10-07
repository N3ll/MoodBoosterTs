import {Observable} from "data/observable";
import dialogsModule = require("ui/dialogs");
import {el} from "../../shared/config";
import frameModule = require("ui/frame");
import {Utility} from "../../shared/util";

export class LoginViewModel extends Observable {
	private _username: string;
	private _password: string;
	private _util: Utility;

	constructor() {
		super();
		this._username = "user@domain.com";
		this._password = "password";
		this.util = new Utility();
	}

	get username(): string {
		return this._username;
	}

	set username(value: string) {
		if (this._username !== value) {
			this._username = value;

			this.notify({
				eventName: "propertyChange",
				propertyName: "username",
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
			this._password;

			this.notify({
				eventName: "propertyChange",
				propertyName: "password",
				object: this,
				value: value
			});
		}
	}

	public get util(): Utility {
		return this._util;
	}

	public set util(value: Utility) {
		if (this._util !== value) {
			this._util = value;
			this.notify({
				eventName: "propertyChange",
				propertyName: "util",
				object: this,
				value: this._util
			});
		}
	}
	public logIn() {
		if (this.validate()) {
			if (!this.util.beginLoading()) return;
			console.log(`signIn, email: ${this.username}, password: ${this.password}`);
			var that = this;
			el.authentication.login(this.username, this.password)
				.then(function() {
					that.util.endLoading();
					console.log(`signIn success, email: ${that.username}, password: ${that.password}`);
					frameModule.topmost().navigate("./views/options/options");
				})
				.catch(function(error) {
					console.log("ERROR: " + error.message);
					console.log(JSON.stringify(error));
					that.util.endLoading();
				});
		} else {
			this.util.endLoading();
		}
	}

	public signUp() {
		frameModule.topmost().navigate("./views/signup/signup");
	}

	private validate(): boolean {
		if (!this.username || this.username === "") {
			dialogsModule.alert({
				title: "Error",
				message: "Please enter username",
				okButtonText: "OK"
			});
			return false;
		}

		if (!this.password || this.password === "") {
			dialogsModule.alert({
				title: "Error",
				message: "Please enter password",
				okButton: "OK"
			});
			return false;
		}
		return true;
	}
}