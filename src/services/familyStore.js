// Mocked family members data
import family from '../stores/family.js';

import * as RESPONSES from '../constants/responses.js';
import { GENDER, RELATION } from '../constants/enums.js';

const getSiblings = (member, gender = null) => {
  if (member.parentId === null) {
    return [];
  }

  const siblings = family.filter(
    (fm) => fm.parentId === member.parentId && fm.name !== member.name,
  );

  if (gender) {
    return siblings.filter((fm) => fm.gender === gender);
  }

  return siblings;
};

const getPaternal = (member, gender) => {
  if (member.parentId == null) {
    return [];
  }
  // get mother for the member
  const mother = family.find((fm) => fm.name === member.parentId);
  // get father for the member
  const father = family.find((fm) => fm.name === mother.spouseId);
  const siblingsOfFather = getSiblings(father, gender).map(
    (fm) => fm.name,
  );
  return siblingsOfFather;
};

const getMaternal = (member, gender) => {
  if (member.parentId == null) {
    return [];
  }
  // get mother for the member
  const mother = family.find((fm) => fm.name === member.parentId);
  const siblingsOfMother = getSiblings(mother, gender).map(
    (fm) => fm.name,
  );

  return siblingsOfMother;
};

const getChildren = (member, gender) => {
  if (member.gender === GENDER.FEMALE) {
    const children = family
      .filter((fm) => fm.parentId === member.name && fm.gender === gender)
      .map((fm) => fm.name);
    return children;
  }
  if (member.spouseId) {
    const children = family
      .filter((fm) => fm.parentId === member.spouseId && fm.gender === gender)
      .map((fm) => fm.name);
    return children;
  }
  return [];
};

const getInLaws = (member, gender) => {
  const inLaws = [];

  const spouseOfSiblings = getSiblings(
    member,
    gender === GENDER.MALE ? GENDER.FEMALE : GENDER.MALE,
  );

  if (spouseOfSiblings && spouseOfSiblings.length !== 0) {
    inLaws.push(...spouseOfSiblings.map((fm) => fm.spouseId));
  }

  if (member.spouseId !== null) {
    const spouse = family.find((fm) => fm.name === member.spouseId);
    const siblingsOfSpouse = getSiblings(spouse, gender);

    if (siblingsOfSpouse && siblingsOfSpouse.length !== 0) {
      inLaws.push(...siblingsOfSpouse.map((fm) => fm.name));
    }
  }

  return inLaws;
};

const addChildToStore = (motherName, childName, gender) => {
  const memberAlreadyExists = family.filter(
    (fm) => fm.name === childName,
  ).length;

  if (memberAlreadyExists) {
    // eslint-disable-next-line no-console
    console.log(RESPONSES.CHILD_ADDITION_FAILED);
    return;
  }

  const mother = family.find((fm) => fm.name === motherName);
  if (mother) {
    if (mother.gender === GENDER.FEMALE) {
      family.push({
        name: childName,
        gender,
        parentId: motherName,
        spouseId: null,
      });
      // eslint-disable-next-line no-console
      console.log(RESPONSES.CHILD_ADDITION_SUCCEEDED);
    } else {
      // eslint-disable-next-line no-console
      console.log(RESPONSES.CHILD_ADDITION_FAILED);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(RESPONSES.PERSON_NOT_FOUND);
  }
};

const getRelativesFromStore = (name, relation) => {
  const member = family.find((fm) => fm.name === name);

  if (member === undefined || member === null) {
    return [RESPONSES.PERSON_NOT_FOUND];
  }

  let relatives = [];

  switch (relation) {
    case RELATION.SON:
      relatives = getChildren(member, GENDER.MALE);
      break;

    case RELATION.DAUGHTER:
      relatives = getChildren(member, GENDER.FEMALE);
      break;

    case RELATION.SIBLINGS:
      relatives = getSiblings(member).map((mem) => mem.name);
      break;

    case RELATION.SISTER_IN_LAW:
      relatives = getInLaws(member, GENDER.FEMALE);
      break;

    case RELATION.BROTHER_IN_LAW:
      relatives = getInLaws(member, GENDER.MALE);
      break;

    case RELATION.PATERNAL_UNCLE:
      relatives = getPaternal(member, GENDER.MALE);
      break;

    case RELATION.PATERNAL_AUNT:
      relatives = getPaternal(member, GENDER.FEMALE);
      break;

    case RELATION.MATERNAL_UNCLE:
      relatives = getMaternal(member, GENDER.MALE);
      break;

    case RELATION.MATERNAL_AUNT:
      relatives = getMaternal(member, GENDER.FEMALE);
      break;

    default:
      relatives = [];
      break;
  }

  return relatives.length ? relatives : [RESPONSES.NONE];
};

export { addChildToStore, getRelativesFromStore };
