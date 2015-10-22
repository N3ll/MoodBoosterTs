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
			this.notifyPropertyChange("username",value);	
			console.log("username " + this.username);
		}
	}

	get password(): string {
		return this._password;
	}

	set password(value: string) {
		if (this._password !== value) {
			this._password = value;
			this.notifyPropertyChange("password",value);
			console.log("password " + this.password);
		}
	}

	public get util(): Utility {
		return this._util;
	}

	public set util(value: Utility) {
		if (this._util !== value) {
			this._util = value;
			this.notifyPropertyChange("util",value);
		}
	}
	public logIn() {
		if (this.validate()) {
			if (!this.util.beginLoading()) return;
			console.log(`signIn, email: ${this.username}, password: ${this.password}`);
			el.authentication.login(this.username, this.password)
				.then(()=> {
					this.util.endLoading();
					console.log(`signIn success, email: ${this.username}, password: ${this.password}`);
					frameModule.topmost().navigate("./views/options/options");
				})
				.catch((error)=> {  
					dialogsModule.alert({
						title: "Error",
						message: "Wrong username or password. Please try again",
						okButtonText: "OK"
				});
					console.log("ERROR: " + error.message);
					console.log(JSON.stringify(error));
					this.util.endLoading();
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
				okButtonText: "OK"
			});
			return false;
		}
		return true;
	}
}