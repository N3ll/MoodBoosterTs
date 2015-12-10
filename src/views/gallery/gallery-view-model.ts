import {Observable} from "data/observable";
import dialogsModule = require("ui/dialogs");
import {el} from "../../shared/config";
import frameModule = require("ui/frame");
import {LoadingCounter} from "../../shared/util";
import {model} from "../../shared/model";
import {fromUrl} from "image-source";

export class GalleryViewModel extends Observable {
	public arrayOfPictures;
	public loadingCounter: LoadingCounter;

	constructor() {
		super();
		console.log("in the constructor of gallery-view-model");
		//this.arrayOfPictures=[];
		this.loadingCounter = new LoadingCounter();
		this.loadImages();
	}

	public loadImages() {
		console.log("in loadImages");
		if (this.loadingCounter.isLoading) return;
		this.loadingCounter.beginLoading();

		model.getImages().then(images => {
			this.loadingCounter.endLoading();
			this.set("arrayOfPictures", images);
		}, error => {
			this.loadingCounter.endLoading();
		});
	}
}
