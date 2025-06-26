import { sendEmail } from "../../../common/utils/sendEmail/sendEmail";
import { CONFIG } from "../../../core/config";
import { User } from "../user/user.model";
import { ISupport } from "./support.interface";
import Support from "./support.model";

const createSupport = async (payload: ISupport) => {
  await User.isUserExistById(payload.user);

  await sendEmail(
    CONFIG.CORE.supper_admin_email as string,
    payload.subject,
    payload.description
  );
  console.log(
    "🚀 ~ createSupport ~ CONFIG.CORE.supper_admin_email:",
    CONFIG.CORE.supper_admin_email
  );

  const result = await Support.create(payload);
  return result;
};

export const support_service = {
  createSupport,
};
