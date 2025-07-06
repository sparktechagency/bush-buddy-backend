import { ISos } from "./sos.interface";
import { Sos } from "./sos.model";

const createSos = async (payload: ISos) => {
  return await Sos.create(payload);
};

export const sos_service = {
  createSos,
};
