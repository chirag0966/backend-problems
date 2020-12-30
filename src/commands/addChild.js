import { addChildToStore } from "../services/StoreService.js";

const addChild = (motherName, childName, gender) => {
  if (!(motherName && childName && gender)) {
    console.log(RESPONSES.CHILD_ADDITION_FAILED);
    return;
  }
  addChildToStore(motherName, childName, gender);
};

export default addChild;
