import frameModule = require ("ui/frame");

export function startQuiz(){
	frameModule.topmost().navigate("./views/quiz/questions");
}

export function openGallery(){
	frameModule.topmost().navigate("./views/gallery/gallery");
}