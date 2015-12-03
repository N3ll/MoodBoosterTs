import {model} from "../../shared/model";
import {LoadingCounter} from "../../shared/util";
import {Observable} from "data/observable";


interface Jokes {
	jokes: string;
	category: number;
}

export class JokesViewModel extends Observable{
	private _jokes:Jokes[];
	private _loadingCounter:LoadingCounter;
	
	constructor(){
		super();
		this.jokes=[];
		this.util = new LoadingCounter();
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
	
	public get util():LoadingCounter{
		return this._loadingCounter;
	}
	
	public set util(value:LoadingCounter){
		if (this._loadingCounter !== value){
			this._loadingCounter = value;
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
	