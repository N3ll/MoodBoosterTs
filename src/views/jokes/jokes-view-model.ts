import {model} from "../../shared/model";
import {LoadingCounter} from "../../shared/util";
import {Observable} from "data/observable";


interface Joke {
	joke: string;
	category: number;
}

export class JokesViewModel extends Observable {
	private _jokes: Joke[]=[];
	private _loadingCounter: LoadingCounter = new LoadingCounter();

	constructor() {
		super();
		this.loadJokes();
	}

	public set jokes(value: Joke[]) {
		if (this._jokes !== value) {
			this._jokes = value;
			this.notifyPropertyChange("jokes", value);
		}
	}

	public get jokes(): Joke[] {
		return this._jokes;
	}

	public get loadingCounter(): LoadingCounter {
		return this._loadingCounter;
	}

	public set loadingCounter(value: LoadingCounter) {
		if (this._loadingCounter !== value) {
			this._loadingCounter = value;
			this.notifyPropertyChange("loadingCounter", value);
		}
	}

	public loadJokes() {
		
		if (this.loadingCounter.isLoading) return;
		this.loadingCounter.beginLoading();

		model.getJokes().then(jokes => {
		console.log("jokes "+JSON.stringify(jokes));
			
			this.loadingCounter.endLoading();
			
			var tempJokes = [];
		for (var index = 0; index < jokes.length; index++) {
			var tempJoke = {
				joke : <string>jokes[index].Joke,
				category: <number>jokes[index].Category
			};
			tempJokes.push(tempJoke);
		}			
			this.jokes = tempJokes;
		}, error => {
			this.loadingCounter.endLoading();
		});
	}


	public getRandomJoke(category: number): string {
		
		var jokesFromCategory: Joke[] = [];
		this.jokes.forEach(joke => {
			console.log("jokes cat"+joke.category);
			if (joke.category === category) {
				jokesFromCategory.push(joke);
			}
		});
		console.log("jokesFromCat " + jokesFromCategory);
		console.log("the joke "+jokesFromCategory[Math.floor((Math.random() * jokesFromCategory.length))].joke);
		return jokesFromCategory[Math.floor((Math.random() * jokesFromCategory.length))].joke;
	}
}
	