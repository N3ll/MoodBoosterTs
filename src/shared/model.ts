import {el, Query} from "./config";
import {Observable} from "data/observable";

export interface User {
	email: string;
	password: string;
}

interface Answer {
	answer: String;
	weight: Number;	
}

interface Question {
	question: String;
	order: Number;
	type: String;
	answers: Answer[];
}

interface Jokes {
	jokes: string;
	category: Number;
}

class AppModel extends Observable {
	private _user: User = { email: "user@domain.com", password: "password" };
	public get user(): User {
		return this._user;
	}
	public set user(value: User) {
		if (value !== this._user) {
			this._user = value;
		}
	}

	private _isLoading: boolean = false;
	public get isLoading(): boolean {
		return this._isLoading;
	}

	setIsLoading(value: boolean): void {
		this._isLoading = value;

		this.notify({
			eventName: "propertyChange",
			propertyName: "isLoading",
			object: this,
			value: value
		});
	}

	private _query: any;
	public get query(): any {
		if (!this._query) {
			this._query = new Query();
			this._query.expand({
				"Answers": {
					"TargetTypeName": "Answers",
					"Fields": { "Answer": 1, "Weight": 1 }
				}
			}).select("Question", "Type", "Answers").order("Order");
		}

		return this._query;
	}

	private _questions: Question[];
	public get questions(): Question[] {
		if (!this._questions) {
			
			//this.setIsLoading(true);
			console.log("START QUERY Questions")
			var questionsQuery = el.data("Questions");
			questionsQuery.get(this.query)
				.then(data => {
					this._questions = [];
						
					for (var index = 0; index < data.result.length; index++) {
						//setting the questions
						var tempQuestion:Question = {question:<String>data.result[index].Question,
													type:<String>data.result[index].Type,
													order:<Number>data.result[index].Order,
													answers:[]
						}
						
						//setting the answers
						for (var index2 = 0; index2 < data.result[index].Answers.length; index2++) {
							var tempAnswer:Answer = {answer: <String>data.result[index].Answers[index2].Answer,
													weight : <Number>data.result[index].Answers[index2].Weight
							};
							
							tempQuestion.answers.push(tempAnswer);
						}
						
						this._questions.push(tempQuestion);
					}
					
					console.log("END QUERY: " + JSON.stringify(this._questions));
					this.notify({
						eventName: "propertyChange",
						propertyName: "questions",
						object: this,
						value: this._questions
					});
					
					//this.setIsLoading(false);
				},
					function(error) {
						console.log("error: " + JSON.stringify(error));
					});

			return this._questions;
		}
	}

	private _jokes: Jokes;
	public get jokes(): Jokes {
		if (!this._jokes) {
			var jokesQuery = new Query();
			jokesQuery.select("Joke", "Category");
			var jokes = el.data("Jokes");
			jokes.get(jokesQuery)
				.then(data => {
					this._jokes = data.result;
					this.notify({
						eventName: "propertyChange",
						propertyName: "jokes",
						object: this,
						value: this._jokes
					});
				},
					function(error) {
						console.log("error: " + JSON.stringify(error));
					});

			return this._jokes;
		}
	}
}

export var model: AppModel = new AppModel();
