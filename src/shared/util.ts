import {Observable} from "data/observable";

export class Utility extends Observable{
	private _isLoading: boolean;
	private _loadingCount: number;
	
	constructor(){
		super();
		this._isLoading = false;
		this._loadingCount = 0;
	}
	
	public get loadingCount():number{
		return this._loadingCount;
	}
	
	public get isLoading(): boolean {
		return this._isLoading;
	}
	
	public set loadingCount(value:number){
		if(this._loadingCount !== value){
			this._loadingCount = value;
		}
	}
	
	public set isLoading(value: boolean) {
		if(this._isLoading !== value){
			this._isLoading = value;
			this.notify({
				eventName: "propertyChange",
				propertyName: "isLoading",
				object: this,
				value: value
			});
		}
	}
	
	public beginLoading():boolean{
		if(!this._loadingCount){
			console.log("loading");
			this.isLoading = true;
		}
		
		this._loadingCount++;
		console.log("loading count "+this._loadingCount);
		return true
	}
	
	public endLoading(){
		if(this._loadingCount>0){
			this._loadingCount--;
			// console.log("stopping count "+this._loadingCount);
			if(!this._loadingCount){
				// console.log("stopped loading");
				this.isLoading = false;
			}
		}
	}
}
