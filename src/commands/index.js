import addChild from './addChild.js';
import getRelationship from './getRelatives.js';
import * as ACTIONS from '../constants/actions.js';
import * as RESPONSES from '../constants/responses.js';

const execute = (statement) => {
  // First word to be the action and rest the params
  const [action, ...params] = statement.split(' ');

  switch (action) {
    case ACTIONS.ADD_CHILD:
      addChild(...params);
      break;
    case ACTIONS.GET_RELATIONSHIP:
      getRelationship(...params);
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(RESPONSES.UNKNOWN_ACTION);
  }
};

export default execute;
