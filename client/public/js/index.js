import React from 'react'
import ReactDOM from 'react-dom'
import request from 'request-promise'
import moment from 'moment'
/*
  Here is where we're going to put our front-end logic
  Before beginning delete the render function below (After you have already gotten hello world in the browser)
  */

const styles = {
	center: {
		marginLeft: 'auto',
		marginRight: 'auto',
		width: '50%'
	},
	placeholder: {
		borderTop: '1.5px solid black',
		padding: '5px',
		marginBottom: '0.5%',
		width: '100%'
	},
	textRight: {
		textAlign: 'right'
	},
	smallMargin: {
		marginBottom: '0',
		marginTop: '0'
	}
}

class TodoBox extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			completed: props.completed
		}

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event){
		let completed = !this.state.completed;
		console.log({completed});
		this.setState({completed});
		let {date, todo} = this.props;
		request('http://localhost:3000/update/' + date + '/' + completed + '/' + todo).then(response => {
			console.log('updated');
		});
		
	}

	render(){
		let {todo, date} = this.props;
		let now = moment(date).format('MMMM Do YYYY, h:mm:ss a');
		return <div style={styles.placeholder}>
	      <h4><input value={date} checked={this.state.completed} onChange={this.handleChange} type="checkbox" /> {todo} </h4>
	      <hr style={styles.smallMargin} />
	      <h5>Created On: {now}</h5>
		</div>
	}
}

class ListHolder extends React.Component{
  	constructor(props){
  		super(props);
  		this.state = {
  			todos: []
  		}

  		this.loadList = this.loadList.bind(this);
  		this.handleSubmit = this.handleSubmit.bind(this);
  		this.handleButton = this.handleButton.bind(this);
  	}


  	loadList() {
  		request('http://localhost:3000/get/all').then(todos => this.setState({todos: JSON.parse(todos)}));
  	}

  	handleSubmit(event){
  		let todo = this.refs.inputElement.value;
  		if(todo){
  			request('http://localhost:3000/save/' + todo).then(response => { 
  				console.log('saved');
  			});}
  			
		this.loadList();
		this.refs.inputElement.value = "";
		event.preventDefault();
  		
  	}

	handleButton(event) {
	    let deleteTodo = event.target.value;
	    request('http://localhost:3000/remove/' + deleteTodo).then(resp => {
	      console.log('removed');
	    })
	    // loads the list again to update the UI
	    this.loadList();
	    event.preventDefault();
  }


	//React lifecycle fn
	componentDidMount(){
		this.loadList();
	}

	render(){
		let {todos} = this.state;
		let completedtodos = todos.filter(todo => todo.completed);
    	todos = todos.filter(todo => !todo.completed);
		return <div>
		 	<h3 className="text-center">ToDos</h3>
      		<form style={styles.center} className="input-group" onSubmit={this.handleSubmit}>
	        	<span className="input-group-btn">
	          		<button className="btn btn-secondary" type="button" onClick={this.handleSubmit}>Save</button>
	        	</span>
	        	<input className="form-control" type="text" ref="inputElement" placeholder="Enter Reminder" />
			</form>
			{todos.length >= 1 && <h3 className="text-center">Reminders</h3>}
			{todos.map(({todo, completed, date}) => <div key={date} style={styles.center}>
				<TodoBox date={date} completed={completed} todo={todo}/>
			</div>)}
			{completedtodos.length >= 1 && <h3 className="text-center">Completed</h3>}
 		    {completedtodos.map(({todo, completed, date}, index) => <div style={styles.center} key={date}>
	        <div style={styles.placeholder} className="input-group">
	          <h4>{todo}</h4>
	          <hr style={styles.smallMargin} />
	          <h5><button type="button" value={date} className="btn btn-secondary" onClick={this.handleButton}>remove</button> Created On: {moment(date).format('MMMM Do YYYY, h:mm:ss a')}</h5>
	        </div>
      		</div>)}
		</div>
	}
}

ReactDOM.render(
	<ListHolder/>,
	document.getElementById('root')
);
