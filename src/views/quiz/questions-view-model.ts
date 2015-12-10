import {Observable} from "data/observable";
import frameModule = require("ui/frame");
import {model} from "../../shared/model";
import {LoadingCounter} from "../../shared/util";
import {EventData} from "data/observable";
import {Label} from "ui/label";
import {confirm} from "ui/dialogs";
import {alert} from "ui/dialogs";
import {takePicture} from "camera";
import {ImageFormat} from "ui/enums";
import {el} from "../../shared/config";
import {JokesViewModel} from "../jokes/jokes-view-model";

interface Answer {
	answer: string;
	weight: number;
	id: string;
}

interface Question {
	question: string;
	type: string;
	answers: Answer[];
	id: string;
}

export class QuestionViewModel extends Observable {
	public id: string;
	public question: string;
	public type: string;
	public answers: Answer[];
	public chosenAnswer: Answer;

	public listPickerItems;
	public answerString: string;
	public switchProperty: boolean;

	private _sliderPropertyAnswer: number;
	private _listPickerProperty: number;

	public jokesViewModel = new JokesViewModel();

	public finishQuiz() {
		console.log("switchProperty value " + this.switchProperty);
		if (!this.switchProperty) {
			confirm({
				title: "Unbelievable",
				message: "This is statistically highly unlikely answer. Maybe you didn't get the question. Try again: Do you want to take a selfie?",
				okButtonText: "Absolutely",
				cancelButtonText: "Nope"
			}).then(result => {
				if (result) {
					console.log("about to take picture dialog");
					var joke = this.jokesViewModel.getRandomJoke(4);
					this.makePicture(joke);
				}
				else {
					//generate randon picture with a joke
				}
			});
		} else {
			console.log("about to take picture");
			var joke = this.jokesViewModel.getRandomJoke(4);
			this.makePicture(joke);
		}
	}

	private makePicture(joke) {
		console.log("in makePicture()");
		takePicture({
			width: 300,
			height: 300,
			keepAspectRatio: true
		}).then(picture => {
			console.log("picture is preparing for upload ");
			var file = {
				"Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
				"ContentType": "image/jpeg",
				"base64": picture.toBase64String(ImageFormat.jpeg, 100),
				"joke": joke
			};

			el.Files.create(file,
				function(data) { console.log("picture uploaded "); },
				function(error) { console.log("picture not uploaded "); });
		}, error => {
			console.log("cannot take picture " + error);
		});
	}

	public get sliderPropertyAnswer(): number {
		return this._sliderPropertyAnswer;
	}

	public set sliderPropertyAnswer(value: number) {
		this._sliderPropertyAnswer = value;
		var roundedValue = Math.round(value);

		if (this.answers[roundedValue]) {
			this.set("answerString", this.answers[roundedValue].answer);
			this.set("chosenAnswer", this.answers[roundedValue])
		}
	}

	public get listPickerProperty(): number {
		return this._listPickerProperty;
	}

	public set listPickerProperty(value: number) {
		this._listPickerProperty = value;
		if (this.answers[value]) {
			this.set("chosenAnswer", this.answers[Math.round(value)])
		}
	}

	constructor(everliveQuestion: any) {
		super();
		this.id = <string>everliveQuestion.Id;
		this.question = <string>everliveQuestion.Question;
		this.type = <string>everliveQuestion.Type;
		
		//  console.log("constructor beginning chosenAnswer " + this.chosenAnswer.answer);
		
		this.answers = [];
		for (var index2 = 0; index2 < everliveQuestion.Answers.length; index2++) {
			var tempAnswer = {
				id: <string>everliveQuestion.Answers[index2].Id,
				answer: <string>everliveQuestion.Answers[index2].Answer,
				weight: <number>everliveQuestion.Answers[index2].Weight,
			};
			this.answers.push(tempAnswer);
		}

		//  console.log("constructor before if-type chosenAnswer " + this.chosenAnswer.answer);
		

		if (this.type !== "repeater") {
			console.log("not repeater " + this.question + " type " + this.type);
			this.set("chosenAnswer", this.answers[0]);
		} 
		
		//  console.log("constructor after if-type chosenAnswer " + this.chosenAnswer.answer);
		// TODO: do this only for list picker questions
		var listAnswers = this.answers;
		this.listPickerItems = {};
		this.listPickerItems.length = listAnswers.length;
		this.listPickerItems.getItem = function(index) {
			return listAnswers[index].answer;
		}

		this.sliderPropertyAnswer = 0;
		this.switchProperty = true;

		// console.log("in the end of constructor chosenAnswer " + this.chosenAnswer.answer);
		
	}

	public questionIsAnswered(): boolean {
		console.log("in question is answered " + this.chosenAnswer.answer);
		if (!this.chosenAnswer) {
			alert("Come on, pick an answer").then(function() {
				console.log("Dialog closed!");
			});
			return false;
		} else {
			return true;
		}
	}
}

export class QuestionsViewModel extends Observable {
	private _currentQuestion: QuestionViewModel;
	private _canGoToNext: boolean;
	private _canGoToPrevious: boolean;

	private _questions: QuestionViewModel[] = [];
	private _sum: number = 0;
	private _currentQuestionIndex: number = 0;
	private _progress: number = 1;
	private _loadingCounter: LoadingCounter = new LoadingCounter();
	private answeredQuestions = {};

	public visibleQ1: string = "collapsed";
	public visibleQ2: string = "collapsed";
	public visibleQ3: string = "collapsed";
	public visibleQ4: string = "collapsed";
	public visibleQ5: string = "collapsed";


	constructor() {
		super();
		this.loadQuestions();
		this.checkGoToNextAndPrevious();
		this.setVisibleQuestion(this._currentQuestionIndex);
	}

	public set questions(value: QuestionViewModel[]) {
		if (this._questions !== value) {
			this._questions = value;
			this.notifyPropertyChange("questions", value);
		}
	}

	public get questions(): QuestionViewModel[] {
		return this._questions;
	}

	public get currentQuestion(): QuestionViewModel {
		return this._currentQuestion;
	}

	public set currentQuestion(value: QuestionViewModel) {
		if (this._currentQuestion !== value) {
			this._currentQuestion = value;
			this.notifyPropertyChange("currentQuestion", value);
			this.checkGoToNextAndPrevious();
		}
	}

	public get currentQuestionIndex(): number {
		return this._currentQuestionIndex;
	}

	public set currentQuestionIndex(value: number) {
		if (this._currentQuestionIndex !== value) {
			this._currentQuestionIndex = value;
			this.notifyPropertyChange("currentQuestionIndex", value);
		}
	}

	public get canGoToPrevious(): boolean {
		return this._canGoToPrevious;
	}

	public set canGoToPrevious(value: boolean) {
		if (this._canGoToPrevious !== value) {
			this._canGoToPrevious = value;
			this.notifyPropertyChange("canGoToPrevious", value);
		}
	}

	public get canGoToNext(): boolean {
		return this._canGoToNext;
	}

	public set canGoToNext(value: boolean) {
		if (this._canGoToNext !== value) {
			this._canGoToNext = value;
			this.notifyPropertyChange("canGotToNext", value);
		}
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

	public get sum(): number {
		return this._sum;
	}

	public set sum(value: number) {
		if (this._sum !== value) {
			this._sum = value;
			this.notifyPropertyChange("sum", value);
		}
	}

	public get progress(): number {
		return this._progress;
	}

	public set progress(value: number) {
		if (this._progress !== value) {
			this._progress = value;
			this.notifyPropertyChange("progress", value);
		}
	}

	public loadQuestions() {
		if (this.loadingCounter.isLoading) return;

		this.loadingCounter.beginLoading();
		model.getQuestions().then(questions => {
			this.loadingCounter.endLoading();
			for (var index = 0; index < questions.length; index++) {
				var tempQuestion = new QuestionViewModel(questions[index]);
				this._questions.push(tempQuestion);
			}
			this.currentQuestion = this._questions[this.currentQuestionIndex];
			this.setVisibleQuestion(this.currentQuestionIndex);
		}, error => {
			this.loadingCounter.endLoading();
		});
	}

	public setVisibleQuestion(currentQuestionIndex: number) {
		var index = this.currentQuestion ? (currentQuestionIndex + 1) : -1;
		for (var i = 1; i <= 5; i++) {
			let visibility = (i === index) ? "visible" : "collapsed";
			this.set("visibleQ" + i, visibility);
		}
	}

	public previousTap(args: EventData) {
		console.log("in previousTap chosen answer " + this.currentQuestion.chosenAnswer);
		if (this.currentQuestion.questionIsAnswered()) {
			if (this.currentQuestionIndex) {
				this.currentQuestionIndex--;
				this.progress--;
				// console.log("in previous, current index " + this.currentQuestionIndex);
			}
			this.calculateSum(this.currentQuestion);
			this.currentQuestion = this.questions[this.currentQuestionIndex];
			this.setVisibleQuestion(this.currentQuestionIndex);
		}
	}

	public nextTap(args: EventData) {
		console.log("in nextTap chosen answer " + this.currentQuestion.chosenAnswer.answer);
		if (this.currentQuestion.questionIsAnswered()) {
			if (this.currentQuestionIndex < this.questions.length - 1) {
				this.currentQuestionIndex++;
				this.progress++;
				// console.log("in next, current index " + this.currentQuestionIndex);
			}
			this.calculateSum(this.currentQuestion);
			this.currentQuestion = this.questions[this.currentQuestionIndex];
			this.setVisibleQuestion(this.currentQuestionIndex);
		}
	}

	private checkGoToPrevious() {
		if (!this.currentQuestionIndex) {
			this.canGoToPrevious = false;
		} else {
			this.canGoToPrevious = true;
		}
	}

	private checkGoToNext() {
		if (this.currentQuestionIndex < this.questions.length - 1) {
			this.canGoToNext = true;
		} else {
			this.canGoToNext = false;
		}
	}

	private checkGoToNextAndPrevious() {
		this.checkGoToNext();
		this.checkGoToPrevious();
		// console.log(this.currentQuestionIndex);
		// console.log("canGoToNext " + this.canGoToNext);
		// console.log("canGoToPrevious " + this.canGoToPrevious);
	}

	public visibilityConverter(value: boolean) {
		if (value) {
			return "visible";
		} else {
			return "collapsed";
		}
	}

	public saveAnswer(idAnswer) {
		this.currentQuestion.answers.forEach(answer => {
			if (answer.id === idAnswer) {
				this.currentQuestion.chosenAnswer = answer;
				console.log("tapped answer is saved")
			}
		});
	}

	public calculateSum(selectedQuestion: QuestionViewModel) {
		// console.log("sum start:" + this.sum);
		// console.log("selected question id " + selectedQuestion.id);
		// console.log("the value for question id " + JSON.stringify(this.answeredQuestions[selectedQuestion.id]));
		// console.log("the chosen answer " + JSON.stringify(selectedQuestion.chosenAnswer));
		// console.log("all questions and answers " + JSON.stringify(this.answeredQuestions));

		if (this.answeredQuestions[selectedQuestion.id]) {
			if (this.answeredQuestions[selectedQuestion.id] !== selectedQuestion.chosenAnswer) {
				this.sum -= this.answeredQuestions[selectedQuestion.id].weight;
				this.sum += selectedQuestion.chosenAnswer.weight;
				this.answeredQuestions[selectedQuestion.id] = selectedQuestion.chosenAnswer;
			}
		} else {
			// console.log("selected answer weight " + selectedQuestion.chosenAnswer.weight)
			this.sum += selectedQuestion.chosenAnswer.weight;
			this.answeredQuestions[selectedQuestion.id] = selectedQuestion.chosenAnswer;
		}
		// console.log("sum end:" + this.sum);
	}
}



