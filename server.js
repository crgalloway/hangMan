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
console.log(randWord)
var server = app.listen(8000,function(){
	console.log("listening on port 8000");
});
var io = require('socket.io').listen(server)
var randWord = getRandomWord(wordBank)
io.sockets.on('connection', function(socket){
	socket.emit('display_word', randWord)
});