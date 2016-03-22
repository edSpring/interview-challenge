/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskIdPublic,
          taskIdPrivate;

      beforeEach(() => {
        Tasks.remove({});
        // insert a public task
        taskIdPublic = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          private:false,
          username: 'tmeasday',
        });
        // insert a private task
        taskIdPrivate = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId+"NotMe",
          private:true,
          username: 'tmeasday',
        });
        //create Meteor.userId() stub
        stubs.create('userId', Meteor, 'userId');
        stubs.userId.func = ()=>{
            return userId;
        }
      });

      it('can delete owned task', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskIdPublic]);

        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 1);
      });

      it('it cannot delete non-owned private task', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        const expectedError= deleteTask.apply(invocation, [taskIdPrivate]);
        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 2);
      });
    });
  });
}
