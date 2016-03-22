/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import React, { Component, PropTypes} from 'react';
import TestUtils from 'react-addons-test-utils';

import Task from './Task.jsx';

if (Meteor.isClient) {
  describe('Tasks UI', () => {
    describe('methods', () => {
      const userId = Random.id();
      let myTask,
          theirTask,
          myTaskComponent,
          theirTaskComponent;

      beforeEach(() => {
        // insert a public task
        myTask = {
          _id : Random.id(),
          text: 'my test task',
          createdAt: new Date(),
          owner: userId,
          private:false,
          username: 'tmeasday',
        };
        // insert a private task
        theirTask = {
          _id : Random.id(),
          text: 'their task',
          createdAt: new Date(),
          owner: userId+"NotMine",
          private:false,
          username: 'tmeasday',
        };
        //create Meteor.userId() stub
        stubs.create('userId', Meteor, 'userId');
        stubs.userId.func = ()=>{
            return userId;
        }

        myTaskComponent = TestUtils.renderIntoDocument(
          <Task
            key={myTask._id}
            task={myTask}
            showPrivateButton={myTask.owner === userId}/>
        );

        theirTaskComponent = TestUtils.renderIntoDocument(
          <Task
            key={theirTask._id}
            task={theirTask}
            showPrivateButton={theirTask.owner === userId}/>
        );
      });

      it('my task has a private button', () => {
        // Verify that the method does what we expected
        assert.isDefined(myTaskComponent.refs.privateToggleButton,'button did not exist');
      });
      it('their task does not have a private button', () => {
        // Verify that the method does what we expected
        assert.isUndefined(theirTaskComponent.refs.privateToggleButton,'button exists');
      });
    });
  });
}
