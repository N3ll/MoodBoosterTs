import {Observable} from "data/observable";

export class LoadingCounter extends Observable {
	private _isLoading: boolean;
	private _loadingCount: number;

	constructor() {
		super();
		this._isLoading = false;
		this._loadingCount = 0;
	}

	public get loadingCount(): number {
		return this._loadingCount;
	}
	public set loadingCount(value: number) {
		if (this._loadingCount !== value) {
			this._loadingCount = value;
		}
	}

	public get isLoading(): boolean {
		return this._isLoading;
	}
	public set isLoading(value: boolean) {
		if (this._isLoading !== value) {
			this._isLoading = value;
			console.log("loading set to: " + value)
			// this.notify({
			// 	eventName: "propertyChange",
			// 	propertyName: "isLoading",
			// 	object: this,
			// 	value: value
			// });
		}
	}

	public beginLoading(): void {
		if (!this.isLoading) {
			console.log("set loading to true");
			this.isLoading = true;
		}

		this._loadingCount++;
		console.log("beginLoading ended: " + this._loadingCount);
	}

	public endLoading() {
		if (this._loadingCount > 0) {
			this._loadingCount--;
			if (!this._loadingCount) {
				console.log("stopped loading to false");
				this.isLoading = false;
			}
		}
		console.log("endLoading ended: " + this._loadingCount);
	}
}
