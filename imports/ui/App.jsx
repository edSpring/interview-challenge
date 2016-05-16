import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);//syntax: function(argument(s) => instructions);
    }
    
    // Attempt 1: Can't find task
    // if (Tasks.owner !== this.userId) {
    //   filteredTasks = filteredTasks.filter(task => !task.private);
    // }
    
    // Attempt 2: Can't find Tasks
    // filteredTasks.filter(Tasks.private && Tasks.task.owner !== this.userId);
    
    // Attempt 4: Why am I still trying this?
    // filteredTasks = filteredTasks.filter(Tasks.task.private && Tasks.task.owner !== this.props.currentUser);
    
    // Attempt 6: How is METEOR undefined!?
    // filteredTasks = filteredTasks.filter(Meteor.props.task.private);
    
    // Attempt the 7th and final: Hardwiring the fix.  My gut tells me that splice() is not the way to go here, because it changes the original array, but it appears to work, and logging in and out of the To-Do list with two different logins seems to have no adverse effects or permanent alterations to the task list.
    //console.log(this.props.tasks);
    for(var i = 0; i < filteredTasks.length; i++) {
      console.log(filteredTasks[i].owner);
      console.log(filteredTasks[i].private);
      if(filteredTasks[i].owner !== this.props.currentUser._id && filteredTasks[i].private){
        console.log("Yes");
        filteredTasks.splice(i, 1);
      }
    }
    // At first I had the construction of if(!( === ) && ) in line 64 which did not disallow displaying tasks to someone not logged in at all.  But then I hit on this solution.
    // I left the console.logs in so you could see how I was narrowing down on the solution.
    
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      
      // Attempt 3: Returned empty list. Why?
      // {filteredTasks = filteredTasks.filter(task.private && task.owner !== this.props.currentUser)}
      
      // Attempt 5: List empty again, error in the debug.js file!?
      // {filteredTasks = filteredTasks.filter(!(task.private && task.owner !== currentUserId))}
      
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
