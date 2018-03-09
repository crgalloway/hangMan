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
var wordBank = ["test", "frogger", "dandelion"]
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
	return letterDict
}

var randWord = getRandomWord(wordBank)
var count = 5

var server = app.listen(8000,function(){
	console.log("listening on port 8000");
});
var io = require('socket.io').listen(server)

io.sockets.on('connection', function(socket){
	socket.emit('display_word', {word: randWord,tries:count})
	socket.on('guess_made',function(guess){
		if (count==0){
			randWord = getRandomWord(wordBank)
			console.log(randWord)
			count = 5
			io.emit('display_word', {word: randWord,tries:count})
		}
		var result = wordSearch(guess,randWord);
		if (Object.keys(result).length == 0){
			count--;
			io.emit('display_word', {word: randWord,tries:count})
		}
		else{
			io.emit('correct_guess',result)
		}
	})
	
});