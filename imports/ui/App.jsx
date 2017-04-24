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
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

    // filter out any private tasks not owned by current user
    var currUserId = this.props.currentUser && this.props.currentUser._id;
    filteredTasks = filteredTasks.filter(task => {
      if (currUserId != task.owner) {
        // current user is not the task owner, filter out private tasks
        return !task.private
      } else {
        // current user is the task owner, don't filter any
        return true
      }
    });

    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

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

  // don't include private non-owned tasks in incompleteCount
  var userId = Meteor.userId();
  var incompleteCount = 0
  if (userId == null) {
    // get all non-checked and non-private
    incompleteCount = Tasks.find({
      $and: [
        { checked: {$ne: true} },
        { private: {$ne: true} }
      ]
    }).count();
  } else {
    var tmpTasks = Tasks.find({
        checked: { $ne: true}
    });

    tmpTasks.forEach(function (task) {
      // if the task is private and I'm the owner, count it
      if (task.private) {
        if (task.owner == userId) {
          incompleteCount += 1;
        }
      }
      else {
        incompleteCount += 1;
      }
    });

  }

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: incompleteCount,
    currentUser: Meteor.user(),
  };
}, App);
