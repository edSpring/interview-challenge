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
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
     return {error:"Access Denied", message:"Cannot delete the task because you do not own it."};
    }

    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
     return {error:"Access Denied", message:"Cannot mark completed the task because you do not own it."};
    }

    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      return {error:"Access Denied", message:"Cannot set private the task because you do not own it."};
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});
