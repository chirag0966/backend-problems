import * as RESPONSES from "../constants/responses.js";
import { GENDER, RELATION } from "../constants/enums.js";

// Mocked family members data
import { familyMembers } from "../mockedData/familyMembers.js";

const addChildToStore = (motherName, childName, gender) => {
  const memberAlreadyExists = familyMembers.filter(
    (fm) => fm.name === childName
  ).length;

  if (memberAlreadyExists) {
    console.log(RESPONSES.CHILD_ADDITION_FAILED);
    return;
  }

  const mother = familyMembers.find((fm) => fm.name === motherName);
  if (mother) {
    if (mother.gender === GENDER.FEMALE) {
      familyMembers.push({
        name: childName,
        gender: gender,
        parentId: motherName,
        spouseId: null,
      });
      console.info(RESPONSES.CHILD_ADDITION_SUCCEEDED);
    } else {
      console.log(RESPONSES.CHILD_ADDITION_FAILED);
    }
  } else {
    console.log(RESPONSES.PERSON_NOT_FOUND);
  }
};

const getRelativesFromStore = (name, relation) => {
  const member = familyMembers.find((fm) => fm.name === name);

  if (member === undefined || member === null) {
    return [RESPONSES.PERSON_NOT_FOUND];
  }

  let relatives = [];

  switch (relation) {
    case RELATION.SON:
      relatives = getChildren(familyMembers, member, GENDER.MALE);
      break;

    case RELATION.DAUGHTER:
      relatives = getChildren(familyMembers, member, GENDER.FEMALE);
      break;

    case RELATION.SIBLINGS:
      relatives = getSiblings(familyMembers, member).map((mem) => mem.name);
      break;

    case RELATION.SISTER_IN_LAW:
      relatives = getInLaws(familyMembers, member, GENDER.FEMALE);
      break;

    case RELATION.BROTHER_IN_LAW:
      relatives = getInLaws(familyMembers, member, GENDER.MALE);
      break;

    case RELATION.PATERNAL_UNCLE:
      relatives = getPaternal(familyMembers, member, GENDER.MALE);
      break;

    case RELATION.PATERNAL_AUNT:
      relatives = getPaternal(familyMembers, member, GENDER.FEMALE);
      break;

    case RELATION.MATERNAL_UNCLE:
      relatives = getMaternal(familyMembers, member, GENDER.MALE);
      break;

    case RELATION.MATERNAL_AUNT:
      relatives = getMaternal(familyMembers, member, GENDER.FEMALE);
      break;
  }

  return relatives.length ? relatives : [RESPONSES.NONE];
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
    return children;
  } else if (member.spouseId) {
    const children = familyMembers
      .filter((fm) => fm.parentId === member.spouseId && fm.gender === gender)
      .map((fm) => fm.name);
    return children;
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

export { addChildToStore, getRelativesFromStore };
