import {el, Query} from "./config";
import {Observable} from "data/observable";

var QUESTIONS = "Questions";
var JOKES = "Jokes";


class AppModel extends Observable {

	public getQuestions(): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			var query = new Query();

			query.expand({
				"Answers": {
					"TargetTypeName": "Answers",
					"Fields": { "Answer": 1, "Weight": 1}
				}

			}).select("Question", "Type", "Answers", "Order").order("Order");

			el.data(QUESTIONS).get(query).then(data => {
				resolve(<any[]>data.result);
			}, error => {
				reject(error);
			})
		});
	}

	public getJokes(): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			var query = new Query();
			query.select("Joke", "Category","Id");
			
			el.data(JOKES).get(query).then(data => {
				resolve(<any[]>data.result);
			}, error => {
				reject(error);
			})
		});
	}
}

export var model: AppModel = new AppModel();
