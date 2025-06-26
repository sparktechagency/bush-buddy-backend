import { ObjectId } from "mongoose";
import { IPat } from "./pat.interface";
import { PrivacyAboutTerms } from "./pat.model";

const createPrivacy = async (currentUser: ObjectId, payload: Partial<IPat>) => {
  payload.modifiedBy = currentUser;
  payload.type = "privacy-policy";

  const result = await PrivacyAboutTerms.findByIdAndUpdate(
    "679f2d9e4b1d18dc5879cecf",
    payload,
    {
      new: true,
      upsert: true,
    }
  );

  return result;
};
const createAbout = async (currentUser: ObjectId, payload: Partial<IPat>) => {
  payload.modifiedBy = currentUser;
  payload.type = "about-us";

  const result = await PrivacyAboutTerms.findByIdAndUpdate(
    "679f3183ef82a9d3f838adcc",
    payload,
    {
      new: true,
      upsert: true,
    }
  );

  return result;
};
const createTerms = async (currentUser: ObjectId, payload: Partial<IPat>) => {
  payload.modifiedBy = currentUser;
  payload.type = "terms-condition";

  const result = await PrivacyAboutTerms.findByIdAndUpdate(
    "679f31fe189e813590f3df6e",
    payload,
    {
      new: true,
      upsert: true,
    }
  );

  return result;
};

const getPrivacy = async () => {
  return await PrivacyAboutTerms.findByIdAndUpdate("679f2d9e4b1d18dc5879cecf");
};
const getAbout = async () => {
  return await PrivacyAboutTerms.findByIdAndUpdate("679f3183ef82a9d3f838adcc");
};
const getTerms = async () => {
  return await PrivacyAboutTerms.findByIdAndUpdate("679f31fe189e813590f3df6e");
};

export const patService = {
  createPrivacy,
  createAbout,
  createTerms,
  getPrivacy,
  getAbout,
  getTerms,
};
