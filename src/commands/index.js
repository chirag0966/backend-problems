import addChild from "./addChild.js";
import getRelationship from "./getRelatives.js";
import * as actions from "../constants/actions.js";

const execute = (statement) => {
  // First word to be the action and rest the params
  let [action, ...params] = statement.split(" ");

  switch (action) {
    case actions.ADD_CHILD:
      addChild(...params);
      break;
    case actions.GET_RELATIONSHIP:
      getRelationship(...params);
      break;
    default:
      console.log("UNKNOWN COMMAND");
  }
};

export default execute;
