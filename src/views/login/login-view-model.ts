import {Observable} from "data/observable";
import dialogsModule = require("ui/dialogs");
import {el} from "../../shared/config";
import frameModule = require("ui/frame");
import {LoadingCounter} from "../../shared/util";

export class LoginViewModel extends Observable {
	private _username: string;
	private _password: string;
	private _loadingCounter: LoadingCounter;

	constructor() {
		super();
		this._username = "user@domain.com";
		this._password = "password";
		this.loadingCounter = new LoadingCounter();
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

	public get loadingCounter(): LoadingCounter {
		return this._loadingCounter;
	}

	public set loadingCounter(value: LoadingCounter) {
		if (this._loadingCounter !== value) {
			this._loadingCounter = value;
			this.notifyPropertyChange("loadingCounter",value);
		}
	}
	
	public logIn() {
		console.log("logIn() called isLoading:" + this.loadingCounter.isLoading);
		if (this.loadingCounter.isLoading || !this.validate()) return;
		
		console.log(`signIn, email: ${this.username}, password: ${this.password}`);
		this.loadingCounter.beginLoading();
		console.log("after this.util.beginLoading() isLoading:" + this.loadingCounter.isLoading);	
		el.authentication.login(this.username, this.password)
			.then(
				()=> {
				this.loadingCounter.endLoading();
				console.log(`signIn success, email: ${this.username}, password: ${this.password}`);
				frameModule.topmost().navigate("./views/options/options");
			})
			.catch(
				(error)=> {  
				this.loadingCounter.endLoading();
				
				console.log("ERROR: " + error.message);
				console.log(JSON.stringify(error));
					
				dialogsModule.alert({
						title: "Error",
						message: "Wrong username or password. Please try again",
						okButtonText: "OK"
				});
			});
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