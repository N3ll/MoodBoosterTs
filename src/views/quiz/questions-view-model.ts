import {Observable} from "data/observable";
import frameModule = require("ui/frame");
import {model} from "../../shared/model";
import {LoadingCounter} from "../../shared/util";
import {EventData} from "data/observable";
import {Label} from "ui/label";
import {confirm} from "ui/dialogs";
import {alert} from "ui/dialogs";
import {Bindable} from "ui/core/bindable"

interface Answer {
	answer: string;
	weight: number;
	id: string;
}

interface Question {
	question: string;
	order: number;
	type: string;
	answers: Answer[];
	id: string;
}

export class QuestionViewModel extends Observable {
	public question: string;
	public order: number;
	public type: string;
	public answers: Answer[];
	public id: string;
	private _sliderPropertyAnswer: number;
	public chosenAnswer: Answer;
	public listPickerItems;
	public answerString: string;
	private _switchProperty: boolean;

	public get switchProperty(): boolean {
		return this._switchProperty;
	}

	public set switchProperty(value: boolean) {
		this._switchProperty = value;
		if (!value) {
			confirm({
				title: "Unbelievable",
				message: "This is statistically highly unlikely answer. Maybe you didn't get the question. Try again: Do you want to take a selfie?",
				okButtonText: "Absolutely",
				cancelButtonText: "Nope"
			}).then(function(result) {
				if (result) {
					// open the camera
				}
				else {
					//generate randon picture with a joke
				}
			});
		}
	}

	public get sliderPropertyAnswer(): number {
		return this._sliderPropertyAnswer;
	}

	public set sliderPropertyAnswer(value: number) {
		this._sliderPropertyAnswer = value;
		if (this.answers[value]) {
			this.set("answerString", this.answers[Math.round(value)].answer);
			this.set("chosenAnswer", this.answers[Math.round(value)])
		}
	}

	constructor(everliveQuestion: any) {
		super();
		this.question = <string>everliveQuestion.Question;
		this.type = <string>everliveQuestion.Type;
		this.order = <number>everliveQuestion.Order;
		this.answers = [];
		this.id = <string>everliveQuestion.Id;
		this.sliderPropertyAnswer = -1;
		this.switchProperty = true;

		for (var index2 = 0; index2 < everliveQuestion.Answers.length; index2++) {
			var tempAnswer = {
				answer: (index2 + 1) + ". " + <string>everliveQuestion.Answers[index2].Answer,
				weight: <number>everliveQuestion.Answers[index2].Weight,
				id: <string>everliveQuestion.Answers[index2].Id,
			};
			this.answers.push(tempAnswer);
			this.answers[index2] = tempAnswer;
		}

		if (this.type !== "repeater") {
			this.set("chosenAnswer", this.answers[0]);
		}
		
		// TODO: do this only for list picker questions
		var listAnswers = this.answers;
		this.listPickerItems = {};
		this.listPickerItems.length = listAnswers.length;
		this.listPickerItems.getItem = function(index) {
			console.log("getting item " + index);
			return listAnswers[index].answer;
		}
	}

	public questionIsAnswered(): boolean {
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
	private _questions: QuestionViewModel[];
	private _currentQuestion: QuestionViewModel;
	private _currentQuestionIndex: number;
	private _canGoToNext: boolean;
	private _canGoToPrevious: boolean;
	private _sum: number;
	private _loadingCounter: LoadingCounter;
	private answeredQuestions;
	private _progress: number;
	public visibleQ1: string;
	public visibleQ2: string;
	public visibleQ3: string;
	public visibleQ4: string;
	public visibleQ5: string;

	constructor() {
		super();
		this.questions = [];
		this.currentQuestionIndex = 0;
		this.loadingCounter = new LoadingCounter();
		this.sum = 0;
		this.answeredQuestions = {};
		this.progress = 1;
		this.visibleQ1 = "collapsed";
		this.visibleQ2 = "collapsed";
		this.visibleQ3 = "collapsed";
		this.visibleQ4 = "collapsed";
		this.visibleQ5 = "collapsed";
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
			this.notifyPropertyChange("util", value);
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
			console.log("this.util.endLoading(): " + this.loadingCounter.isLoading);

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
		if (this.currentQuestion.questionIsAnswered()) {
			if (this.currentQuestionIndex) {
				this.currentQuestionIndex--;
				this.progress--;
				console.log("in previous, current index " + this.currentQuestionIndex);
			}
			this.calculateSum(this.currentQuestion);
			this.currentQuestion = this.questions[this.currentQuestionIndex];
			this.setVisibleQuestion(this.currentQuestionIndex);
		}
	}

	public nextTap(args: EventData) {
		if (this.currentQuestion.questionIsAnswered()) {
			if (this.currentQuestionIndex < this.questions.length - 1) {
				this.currentQuestionIndex++;
				this.progress++;
				console.log("in next, current index " + this.currentQuestionIndex);
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
		console.log(this.currentQuestionIndex);
		console.log("canGoToNext " + this.canGoToNext);
		console.log("canGoToPrevious " + this.canGoToPrevious);
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
		console.log("sum start:" + this.sum);
		console.log("selected question id " + selectedQuestion.id);
		console.log("the value for question id " + JSON.stringify(this.answeredQuestions[selectedQuestion.id]));
		console.log("the chosen answer " + JSON.stringify(selectedQuestion.chosenAnswer));
		console.log("all questions and answers " + JSON.stringify(this.answeredQuestions));
		
		if (this.answeredQuestions[selectedQuestion.id]) {
			if (this.answeredQuestions[selectedQuestion.id] !== selectedQuestion.chosenAnswer) {
				console.log("here");
				this.sum -= this.answeredQuestions[selectedQuestion.id].weight;
				this.sum += selectedQuestion.chosenAnswer.weight;
				this.answeredQuestions[selectedQuestion.id] = selectedQuestion.chosenAnswer;
			}
		} else {
			console.log("selected answer weight " + selectedQuestion.chosenAnswer.weight)
			this.sum += selectedQuestion.chosenAnswer.weight;
			this.answeredQuestions[selectedQuestion.id] = selectedQuestion.chosenAnswer;
		}
		console.log("sum end:" + this.sum);
	}
}



