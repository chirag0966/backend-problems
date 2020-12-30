import { getRelativesFromStore } from '../services/StoreService.js';
import * as RESPONSES from '../constants/responses.js';

const getRelatives = (name, relation) => {
  if (!(name && relation)) {
    // eslint-disable-next-line no-console
    console.log(RESPONSES.CHILD_ADDITION_FAILED);
    return;
  }
  // eslint-disable-next-line no-console
  console.log(getRelativesFromStore(name, relation).join(' '));
};

export default getRelatives;
