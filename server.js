// Install express
const express = require('express');
const app = express();
//Install path
var path = require('path');
// Install EJS
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname+'/views'));
app.use(express.static(path.join(__dirname+"/static")));
//Install body-parser
const bp = require('body-parser');
app.use(bp.urlencoded({ extended:true }));
//Install express-session
const session = require('express-session');
app.use(session({ secret:'insecuresecretkey' }))

app.get('/',function(req,res){
	res.render('index');
})
var wordBank = ["test", "frogger", "dandelion", 'lion', 'computer', 'laptop', 'sockets', 'cthulhu', 'space', 'callback', 'tesla']
function getRandomWord(wordBank){
	return wordBank[Math.floor(Math.random()*wordBank.length)]
}

function wordSearch(guess,randWord){
	var letterDict = {}
	for(var i =0; i<randWord.length;i++){
		if (guess == randWord[i]){
			letterDict[i] = guess
		}
	}
	console.log(letterDict)
	return letterDict
}

function reset(){
	count = 5;
	randWord = getRandomWord(wordBank)
}

var randWord = getRandomWord(wordBank)
var count = 5
var placehold = []

var server = app.listen(8000,function(){
	console.log("listening on port 8000");
});
var io = require('socket.io').listen(server)

io.sockets.on('connection', function(socket){
	socket.emit('display_word', {word: randWord,tries:count})
	socket.on('guess_made',function(guess){
		if (count==1){
			io.emit('game_over')
		}
		var result = wordSearch(guess,randWord);
		if (Object.keys(result).length == 0){
			count--;
			io.emit('display_word', {word: randWord,tries:count})
		}
		else{
			for (var i = 0; i < randWord.length; i++){
				for (eachKey in result){
					if (eachKey == i){
						placehold[i] = (result[eachKey]);
					}
				}
				if (!placehold[i]){
					placehold[i] = "_"
				}
			}
			var strPlacehold = placehold.join("")
			io.emit('correct_guess',strPlacehold)
		}
	})
	socket.on('new_game', function(){
		reset()
		io.emit('display_word', {word: randWord,tries:count})
	})
});