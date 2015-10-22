import {model} from "../../shared/model";
import {Utility} from "../../shared/util";
import {Observable} from "data/observable";


interface Jokes {
	jokes: string;
	category: number;
}

export class JokesViewModel extends Observable{
	private _jokes:Jokes[];
	private _util:Utility;
	
	constructor(){
		super();
		this.jokes=[];
		this.util = new Utility();
	}
	
	public set jokes(value:Jokes[]){
		if(this._jokes !== value){
			this._jokes = value;
			this.notifyPropertyChange("jokes",value);
		}
	}
	
	public get jokes():Jokes[]{
		return this._jokes;
	}
	
	public get util():Utility{
		return this._util;
	}
	
	public set util(value:Utility){
		if (this._util !== value){
			this._util = value;
			this.notifyPropertyChange("util",value);
		}
	}
	
	public loadJokes(){
		if(!this.util.beginLoading())return;
		model.getJokes().then (jokes => {
			this.jokes = jokes;
		},error => {
			this.util.endLoading();
		});
	}
	
}
	