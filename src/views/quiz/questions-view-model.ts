import {Observable} from "data/observable";
import frameModule = require("ui/frame");
import {model} from "../../shared/model";
import {Utility} from "../../shared/util";
import {EventData} from "data/observable";
import {Label} from "ui/label";

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

export class QuestionsViewModel extends Observable {
	private _questions:Question[];
	private _currentQuestion:Question;
	private _currentQuestionIndex: number;
	private _canGoToNext:boolean;
	private _canGoToPrevious:boolean;
	private _sum:number;
	private _util:Utility;
	private answeredQuestions;
	private _progress:number;
	
	constructor(){
		super();
		this.questions=[];
		this.currentQuestionIndex = 0;
		this.util = new Utility();
		this.loadQuestions();
		this.checkGoToNextAndPrevious();
		this.sum = 0;
		this.answeredQuestions = {};
		this.progress = 1;
	}

	public set questions(value:Question[]){
		if(this._questions !== value){
			this._questions = value;
			this.notifyPropertyChange("questions",value);
		}
	}
	
	public get questions():Question[]{
		return this._questions;
	}
	
	public get currentQuestion():Question{
		return this._currentQuestion;
	}
	
	public set currentQuestion(value){
		if(this._currentQuestion!==value){
			this._currentQuestion=value;
			this.notifyPropertyChange("currentQuestion",value);
			this.checkGoToNextAndPrevious();
		}
	}
	
	public get currentQuestionIndex():number{
		return this._currentQuestionIndex;
	}
	
	public set currentQuestionIndex(value:number){
		if(this._currentQuestionIndex!==value){
			this._currentQuestionIndex=value;
			this.notifyPropertyChange("currentQuestionIndex",value);
		}
	}
	
	public get canGoToPrevious():boolean{
		return this._canGoToPrevious;
	}
	
	public set canGoToPrevious(value:boolean){
		if(this._canGoToPrevious!==value){
			this._canGoToPrevious=value;
			this.notifyPropertyChange("canGoToPrevious",value);
		}
	}
	
	public get canGoToNext():boolean{
		return this._canGoToNext;
	}
	
	public set canGoToNext(value:boolean){
		if (this._canGoToNext !== value){
			this._canGoToNext = value;
			this.notifyPropertyChange("canGotToNext",value);
		}
	}
	
	public get util():Utility{
		return this._util;
	}
	
	public set util(value:Utility){
		if (this._util !== value){
			this._util = value;
			this.notifyPropertyChange("util",value);
		}
	}
	
	public get sum():number{
		return this._sum;
	}
	
	public set sum(value:number){
		if (this._sum !== value){
			this._sum = value;
			this.notifyPropertyChange("sum",value);
		}
	}
	
	public get progress():number{
		return this._progress;
	}
	
	public set progress(value:number){
		if (this._progress !== value){
			this._progress = value;
			this.notifyPropertyChange("progress",value);
		}
	}
	
	public loadQuestions(){
		if(!this.util.beginLoading())return;
		model.getQuestions().then (questions => {
			for (var index = 0; index < questions.length; index++) {
				var tempQuestion = {question:<string>questions[index].Question,
									type:<string>questions[index].Type,
									order:<number>questions[index].Order,
									answers:[],
									id: <string>questions[index].Id
						}
				for (var index2 = 0; index2 < questions[index].Answers.length; index2++) {
							
						var tempAnswer = {answer: (index2+1) + ". " + <string>questions[index].Answers[index2].Answer,
										weight : <number>questions[index].Answers[index2].Weight,
										id: <string>questions[index].Answers[index2].Id,
								};
						tempQuestion.answers.push(tempAnswer);
					}
				this._questions.push(tempQuestion);
			}
		this.currentQuestion=this._questions[0];	
		this.util.endLoading();
		}, error => {
			this.util.endLoading();
		});
	}
	
	public previousTap(args: EventData) {
	if (this.currentQuestionIndex) {
		this.currentQuestionIndex--;
		this.progress--;
		console.log("in previous, current index " + this.currentQuestionIndex);
	}
	this.currentQuestion = this.questions[this.currentQuestionIndex];
}

	public nextTap(args: EventData) {
	if (this.currentQuestionIndex < this.questions.length-1) {
		this.currentQuestionIndex++;
		this.progress++;
		console.log("in next, current index " + this.currentQuestionIndex);
	}
	this.currentQuestion = this.questions[this.currentQuestionIndex];
}

	private checkGoToPrevious(){
		if(!this.currentQuestionIndex){
			this.canGoToPrevious = false;
		} else {
			this.canGoToPrevious = true;
		}
	}
	
	private checkGoToNext(){
		if(this.currentQuestionIndex < this.questions.length-1){
			this.canGoToNext = true;
		} else {
			this.canGoToNext = false;
		}
	}
	
	private checkGoToNextAndPrevious(){
		this.checkGoToNext();
		this.checkGoToPrevious();
		console.log("canGoToNext " + this.canGoToNext);
		console.log("canGoToPrevious " + this.canGoToPrevious);
	}
	
	public visibilityConverter(value: boolean){
		if(value){
			return "visible";
		}else{
			return "collapsed";
		}
	}
	
	public saveAnswer(selectedQuestion:Question, selectedAnswer:Answer){
		console.log("sum start:" + this.sum);
		if(this.answeredQuestions[selectedQuestion.id] && this.answeredQuestions[selectedQuestion.id]!==selectedAnswer){
				this.sum-=this.answeredQuestions[selectedQuestion.id].weight;
		} 

		this.sum += selectedAnswer.weight;
		this.answeredQuestions[selectedQuestion.id] = selectedAnswer;
		console.log("sum end:" + this.sum);
	}
}



