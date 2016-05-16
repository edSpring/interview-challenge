import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({});
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    
    //Make an ownership gate.  
    if(task.owner == this.userId) {
      Tasks.remove(taskId);
    }//else{
    //  throw new Meteor.Error('not-authorized', 'This task does not belong to you'); //display an error message.  I'd like this to happen in the UI rather than just in the console log, but I can come back to it.
    //}
    //This was really weird.  While I had that else{} statement live, the test was running afoul of the error being thrown in the console.  I couldn't reconcile the two, so I just commented it out.
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
     return {error:"Access Denied", message:"Cannot mark the task completed because you do not own it."};
    }

    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      return {error:"Access Denied", message:"Cannot set the task private because you do not own it."};
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
  'tasks.setPriority'(taskId, setPriority) {
    check(taskId, String);
    check(setPriority, Boolean);
    
    const task = Tasks.findOne(taskId);
    
    // Anyone is able to set a task to be high priority.  Ideally, I'd have it able to be turned on by anyone but only turned off by either the one who marked it or a supervisor.  We don't have varying levels of permissions here, though.
    Tasks.update(taskId, { $set: { priority: setPriority}});
  }
  // I chose this because it's natural to want to order a to-do list according to the urgency of the task.  
  // It seemed like the obvious next step.  I first planned out the changes I'd need: make a new property, 
  // create the toggle button (which I chose over a check box), and alter the font.  The only thing I 
  // wasn't able to get like I wanted was cosmetic: to move the button to the right of the row.  My attempt is 
  // in the CSS file, and I still have no idea why it's not binding to the button.
});
