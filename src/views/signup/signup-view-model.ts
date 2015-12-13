import {Observable} from "data/observable";
import dialogsModule = require("ui/dialogs");
import {el} from "../../shared/config";
import frameModule = require("ui/frame");
import {LoadingCounter} from "../../shared/util";

export class SignupViewModel extends Observable {
	private _email: string;
	private _password: string;
	private _loadingCounter: LoadingCounter = new LoadingCounter();

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
			this.notifyPropertyChange("email", value);
		}
	}

	get password(): string {
		return this._password;
	}

	set password(value: string) {
		if (this._password !== value) {
			this._password = value;
			this.notifyPropertyChange("password", value);
		}
	}

	public get loadingCounter(): LoadingCounter {
		return this._loadingCounter;
	}

	public set loadingCounter(value: LoadingCounter) {
		if (this._loadingCounter !== value) {
			this._loadingCounter = value;
			this.notifyPropertyChange("loadingCounter", value);
		}
	}

	public signUp() {
		if (this.loadingCounter.isLoading) return;
		this.loadingCounter.beginLoading();
		console.log(`register, email: ${this.email}, password: ${this.password}`);
		el.Users.register(this.email, this.password)
			.then(() => {
				this.loadingCounter.endLoading();
				console.log(`register success, email: ${this.email}, password: ${this.password}`);
				frameModule.topmost().navigate("./views/options/options");
			})
			.catch(error => {
				console.log("error"+JSON.stringify(error));
				this.loadingCounter.endLoading();
			})
	}
}