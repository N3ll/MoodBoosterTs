import {el, Query} from "./config";
import {Observable} from "data/observable";

var QUESTIONS = "Questions";
var JOKES = "Jokes";


class AppModel extends Observable {

	public getQuestions(): Promise<any[]> {
		console.log("getQuestions() start");		
		return new Promise<any[]>((resolve, reject) => {
			var query = new Query();

			query.expand({
				"Answers": {
					"TargetTypeName": "Answers",
					"Fields": { "Answer": 1, "Weight": 1}
				}

			}).select("Question", "Type", "Answers", "Order").order("Order");

			el.data(QUESTIONS).get(query).then(data => {
				console.log("getQuestions success!");
				resolve(<any[]>data.result);
			}, error => {
				console.log("getQuestions error: " + error);
				reject(error);
			})
		});
	}

	public getJokes(): Promise<any[]> {
		console.log("getJokes() start");
		return new Promise<any[]>((resolve, reject) => {
			var query = new Query();
			query.select("Joke", "Category","Id");
			
			el.data(JOKES).get(query).then(data => {
				console.log("getJokes success!");
				resolve(<any[]>data.result);
			}, error => {
				console.log("getJokes error: " + error);
				reject(error);
			})
		});
	}
	
	public getImages(): Promise<any[]>{
		console.log("getImages() start");
		
		return new Promise<any[]>((resolve, reject) => {
			el.Files.get().then(data => {
				console.log("getImages success!");
				resolve(<any[]>data.result);
			}, error => {
				console.log("getImages error: " + error);
				reject(error);
			})
		});
	}
}

export var model: AppModel = new AppModel();
