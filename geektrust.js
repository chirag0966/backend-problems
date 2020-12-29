import { addChild, getRelatives } from "./src/services/StoreService.js";

setTimeout(() => {
  addChild("Satya", "Ketu", "Male");
}, 100);

setTimeout(() => {
  getRelatives("Kriya", "Paternal-Uncle", (members) => console.log(members));
  getRelatives("Satvy", "Brother-In-Law", (members) => console.log(members));
}, 500);

setTimeout(() => {
  getRelatives("Satvy", "Sister-In-Law", (members) => console.log(members));
  getRelatives("Ish", "Son", (members) => console.log(members));
  getRelatives("Misha", "Daughter", (members) => console.log(members));
}, 1000);
