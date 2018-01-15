import express from 'express'
import mongoose from 'mongoose'
var app = express();
mongoose.connect('mongodb://localhost/todos');

let todoModel = mongoose.model('todo', {
	todo: String,
	date: {
		type: Date,
		default: Date.now
	},
	completed: {
		type: Boolean,
		default: false
	}

});


var logError = (err) => {
	if(err)
		throw err;
};
/*
  Here is where we're going put most of the serve logic
*/
var server = () => {
    // We do this can send our html and js static files to the browser through the server
    app.use(express.static('client/public'))


    app.get('/get/all', (req, res) => {
    	todoModel.find((err, todos) => {
  			logError(err);
     		res.send(todos);
    	});

    });

    app.get('/save/:todo', (req, res) => {
    	let {todo} = req.params;
    	new todoModel({todo}).save((err, savedTodo) => {
    		logError(err);
    		res.send(savedTodo);
    	})

    });


    app.get('/remove/:date', (req, res) => {
    	let {date} = req.params;
    	
    	todoModel.remove({date}, (err, deletedTodo) => {
    		logError(err);
    		res.send(deletedTodo);
    	})

    });



    app.get('/update/:date/:completed/:todo', (req, res) => {
    	let {date, completed, todo} = req.params;
    	
    	todoModel.findOneAndUpdate({date}, {completed, todo}, {new: true}, (err, updatedTodo) => {
    		logError(err);
    		res.send(updatedTodo);
    	})

    });

    // 3000 is the port number, this could be any number from  0 to 9999
    app.listen(3000, () => {
        console.log('App listening on port 3000!')
    })
}

export default server;
