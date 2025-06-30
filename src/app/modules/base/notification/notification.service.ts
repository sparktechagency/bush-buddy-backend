/* eslint-disable @typescript-eslint/no-explicit-any */
import { INotification } from "./notification.inerface";
import Notification from "./notification.model";

const getNotificationFromDb = async (query: Record<string, any>) => {
  const result = await Notification.find(query);
  return result;
};

const updateNotification = async (
  id: string,
  payload: Partial<INotification>
) => {
  const result = await Notification.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const makeMeRead = async (query: { user: any; notId: string }) => {
  const result = await Notification.findOneAndUpdate(
    { _id: query.notId, receiver: query.user },
    { isRead: true },
    {
      new: true,
    }
  );
  return result;
};

export const notificationServices = {
  getNotificationFromDb,
  updateNotification,
  makeMeRead,
};
