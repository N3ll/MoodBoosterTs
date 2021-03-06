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
import {knownFolders, path} from "file-system";
import {fromFile} from "image-source";

export class AnswerViewModel extends Observable{
	public answer: string;
	public weight: number;
	public id: string;
	public isTheAnswer: boolean;

	public constructor(everLiveAnswer:any){
		super();
		this.id = <string>everLiveAnswer.Id,
		this.answer = <string>everLiveAnswer.Answer,
		this.weight = <number>everLiveAnswer.Weight,
		this.isTheAnswer = false
	}
}

export class QuestionViewModel extends Observable {
	public id: string;
	public question: string;
	public type: string;
	public answers: AnswerViewModel[];
	public chosenAnswer: AnswerViewModel;

	public listPickerItems;
	public answerString: string;
	public switchProperty: boolean;

	private _sliderPropertyAnswer: number;
	private _listPickerProperty: number;

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

		this.answers = [];
		for (var index2 = 0; index2 < everliveQuestion.Answers.length; index2++) {
			var tempAnswer = new AnswerViewModel(everliveQuestion.Answers[index2]);
			this.answers.push(tempAnswer);
		}

		if (this.type !== "repeater") {
			console.log("not repeater " + this.question + " type " + this.type);
			this.set("chosenAnswer", this.answers[0]);
		} 
		
		// TODO: do this only for list picker questions
		if (this.type === "listpicker") {
			var listAnswers = this.answers;
			this.listPickerItems = {};
			this.listPickerItems.length = listAnswers.length;
			this.listPickerItems.getItem = function(index) {
				return listAnswers[index].answer;
			}
		}

		this.switchProperty = true;
		if(this.type === "slider"){
			this.sliderPropertyAnswer=0;
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
	private _currentQuestion: QuestionViewModel;
	private _canGoToNext: boolean;
	private _canGoToPrevious: boolean;

	private _questions: QuestionViewModel[] = [];
	private _sum: number = 0;
	private _currentQuestionIndex: number = 0;
	private _progress: number = 1;
	private _loadingCounter: LoadingCounter = new LoadingCounter();
	private answeredQuestions = {};

	public jokesViewModel = new JokesViewModel();

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
				answer.set("isTheAnswer",true);
				console.log("tapped answer is saved")
			}else{
				answer.set("isTheAnswer",false);
			}
		});
	}


	private jokeCategoryFromSum(sum: number): number {
		if (sum >= 4 && sum < 7) {
			return 1;
		} else if (sum >= 7 && sum < 10) {
			return 2;
		} else if (sum >= 10 && sum < 13) {
			return 3;
		} else if (sum >= 13 ) {
			return 4;
		}
	}

	public finishQuiz() {
		console.log("switch "+this.currentQuestion.switchProperty);
		if (!this.currentQuestion.switchProperty) {
			confirm({
				title: "Unbelievable",
				message: "This is statistically highly unlikely answer. Maybe you didn't get the question. Try again: Do you want to take a selfie?",
				okButtonText: "Absolutely",
				cancelButtonText: "Nope"
			}).then(result => {
				console.log("result "+result);
				if (result) {
					console.log("about to take picture dialog");
					var joke = this.jokesViewModel.getRandomJoke(this.jokeCategoryFromSum(this.sum));
					this.makePicture(joke);
				}
				else {
					//generate randon picture with a joke		
					console.log("generate random picture");
					console.log("sum "+this.sum);
					var joke = this.jokesViewModel.getRandomJoke(this.jokeCategoryFromSum(this.sum));

					var img = fromFile("~/images/frame.jpg");
					
					var navigationEntry = {
						moduleName: "./views/showPicture/showPicWithJoke",
						context: { src : img,
									joke : joke },
						animated: false
					};
					frameModule.topmost().navigate(navigationEntry);
					

					var file = {
						"Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
						"ContentType": "image/jpeg",
						"base64": img.toBase64String(ImageFormat.jpeg, 100),
						"joke": joke
					};

					el.Files.create(file,
						function(data) {
							console.log("picture uploaded ");
						},
						function(error) { console.log("picture not uploaded ");
					 });
				}
			});

		} else {
			console.log("about to take picture");
			var joke = this.jokesViewModel.getRandomJoke(this.jokeCategoryFromSum(this.sum));
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
			
			var navigationEntry = {
						moduleName: "./views/showPicture/showPicWithJoke",
						context: { src : picture,
									joke : joke },
						animated: false
					};
			frameModule.topmost().navigate(navigationEntry);

			el.Files.create(file,
				function(data) { console.log("picture uploaded "); },
				function(error) { console.log("picture not uploaded "); });
		}, error => {
			console.log("cannot take picture " + error);
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



