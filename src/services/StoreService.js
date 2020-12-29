import sqlite3 from "sqlite3";

import * as DB_CONSTANTS from "../constants/db.js";
import * as RESPONSES from "../constants/responses.js";
import { GENDER, RELATION } from "../constants/enums.js";

// Mocked family members data
import { familyMembers } from "../mockedData/familyMembers.js";

// Initialise In-Memory DB
const db = new sqlite3.Database(":memory:");

// Function to create the table schema
const createTable = () => {
  const createQuery = `CREATE TABLE ${DB_CONSTANTS.NAME}
  (
    ${DB_CONSTANTS.COLUMN_NAME} TEXT PRIMARY KEY,
    ${DB_CONSTANTS.COLUMN_GENDER} TEXT NOT NULL,
    ${DB_CONSTANTS.COLUMN_PARENT_ID} TEXT,
    ${DB_CONSTANTS.COLUMN_SPOUSE_ID} TEXT,
    CONSTRAINT ${DB_CONSTANTS.COLUMN_PARENT_ID}_fk
      FOREIGN KEY (${DB_CONSTANTS.COLUMN_PARENT_ID})
      REFERENCES ${DB_CONSTANTS.NAME}(${DB_CONSTANTS.COLUMN_NAME}),
    CONSTRAINT ${DB_CONSTANTS.COLUMN_SPOUSE_ID}_fk
      FOREIGN KEY (${DB_CONSTANTS.COLUMN_SPOUSE_ID})
      REFERENCES ${DB_CONSTANTS.NAME}(${DB_CONSTANTS.COLUMN_NAME})
  )`;

  db.run(createQuery);
};

const insertInitialValues = () => {
  const insertQuery = db.prepare(
    `INSERT INTO ${DB_CONSTANTS.NAME} VALUES (?, ?, ?, ?)`
  );

  familyMembers.forEach((fm) => {
    insertQuery.run(fm.name, fm.gender, fm.parentId, fm.spouseId);
  });

  insertQuery.finalize();
};

const getFamilyTree = (completion) => {
  const selectQuery = `SELECT * FROM ${DB_CONSTANTS.NAME}`;

  db.all(selectQuery, (err, records) => {
    if (err) {
      throw err;
    }
    completion(records);
  });
};

const addChild = (motherName, childName, gender) => {
  getFamilyTree((familyMembers) => {
    const mother = familyMembers.find((fm) => fm.name === motherName);
    if (mother) {
      if (mother.gender === GENDER.FEMALE) {
        const insertQuery = db.prepare(
          `INSERT INTO ${DB_CONSTANTS.NAME} VALUES (?, ?, ?, ?)`
        );
        insertQuery.run(childName, gender, motherName, null, (error) => {
          if (error) {
            console.error(error);
          } else {
            console.info(RESPONSES.CHILD_ADDITION_SUCCEEDED);
          }
        });
        insertQuery.finalize();
      } else {
        console.error(RESPONSES.CHILD_ADDITION_FAILED);
      }
    } else {
      console.error(RESPONSES.PERSON_NOT_FOUND);
    }
  });
};

const getRelatives = (name, relation, completion) => {
  getFamilyTree((familyMembers) => {
    const member = familyMembers.find((fm) => fm.name === name);

    if (member === undefined || member === null) {
      completion([]);
      return;
    }

    switch (relation) {
      case RELATION.SON:
        completion(getChildren(familyMembers, member, GENDER.MALE));
        break;

      case RELATION.DAUGHTER:
        completion(getChildren(familyMembers, member, GENDER.FEMALE));
        break;

      case RELATION.SIBLINGS:
        completion(getSiblings(familyMembers, member).map((mem) => mem.name));
        break;

      case RELATION.SISTER_IN_LAW:
        completion(getInLaws(familyMembers, member, GENDER.FEMALE));
        break;

      case RELATION.BROTHER_IN_LAW:
        completion(getInLaws(familyMembers, member, GENDER.MALE));
        break;

      case RELATION.PATERNAL_UNCLE:
        completion(getPaternal(familyMembers, member, GENDER.MALE));
        break;

      case RELATION.PATERNAL_AUNT:
        completion(getPaternal(familyMembers, member, GENDER.FEMALE));
        break;

      case RELATION.MATERNAL_UNCLE:
        completion(getMaternal(familyMembers, member, GENDER.MALE));
        break;

      case RELATION.MATERNAL_AUNT:
        completion(getMaternal(familyMembers, member, GENDER.FEMALE));
        break;
    }
  });
};

const getPaternal = (familyMembers, member, gender) => {
  if (member.parentId == null) {
    return [];
  }
  // get mother for the member
  const mother = familyMembers.find((fm) => fm.name === member.parentId);
  // get father for the member
  const father = familyMembers.find((fm) => fm.name === mother.spouseId);
  const siblingsOfFather = getSiblings(familyMembers, father, gender).map(
    (fm) => fm.name
  );
  return siblingsOfFather;
};

const getMaternal = (familyMembers, member, gender) => {
  if (member.parentId == null) {
    return [];
  }
  // get mother for the member
  const mother = familyMembers.find((fm) => fm.name === member.parentId);
  const siblingsOfMother = getSiblings(familyMembers, mother, gender).map(
    (fm) => fm.name
  );
  return siblingsOfMother;
};

const getSiblings = (familyMembers, member, gender = null) => {
  if (member.parentId === null) {
    return [];
  }

  const siblings = familyMembers.filter(
    (fm) => fm.parentId === member.parentId && fm.name !== member.name
  );

  if (siblings.length === 0) {
    return [];
  }

  if (gender) {
    return siblings.filter((member) => member.gender === gender);
  }

  return siblings;
};

const getChildren = (familyMembers, member, gender) => {
  if (member.gender === GENDER.FEMALE) {
    const children = familyMembers
      .filter((fm) => fm.parentId === member.name && fm.gender === gender)
      .map((fm) => fm.name);
    return children.length === 0 ? [] : children;
  } else {
    return [];
  }
};

const getInLaws = (familyMembers, member, gender) => {
  let inLaws = [];

  const spouseOfSiblings = getSiblings(
    familyMembers,
    member,
    gender === GENDER.MALE ? GENDER.FEMALE : GENDER.MALE
  );

  if (spouseOfSiblings && spouseOfSiblings.length !== 0) {
    inLaws.push(...spouseOfSiblings.map((member) => member.spouseId));
  }

  if (member.spouseId !== null) {
    const spouse = familyMembers.find((fm) => fm.name === member.spouseId);
    const siblingsOfSpouse = getSiblings(familyMembers, spouse, gender);

    if (siblingsOfSpouse && siblingsOfSpouse.length !== 0) {
      inLaws.push(...siblingsOfSpouse.map((fm) => fm.name));
    }
  }

  return inLaws;
};

db.serialize(() => {
  createTable();
  insertInitialValues();
});

export { addChild, getRelatives };
