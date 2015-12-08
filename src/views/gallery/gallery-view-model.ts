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
	
	constructor(){
		super();
		this.arrayOfPictures=[];
		this.loadingCounter = new LoadingCounter();
	}
	
	public loadImages() {
		if (this.loadingCounter.isLoading) return;
		this.loadingCounter.beginLoading();
		
		model.getImages().then(images => {
			this.loadingCounter.endLoading();
			console.log("this.util.endLoading(): " + this.loadingCounter.isLoading);

			images.forEach(fileMetadata => {
				fromUrl(fileMetadata.Uri).then(result => {
					var item = {
						itemImage: result
					};
					this.arrayOfPictures.push(item);
				})
			})}, error => {
					this.loadingCounter.endLoading();
				});
	}
}
