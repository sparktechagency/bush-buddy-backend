/* eslint-disable @typescript-eslint/no-explicit-any */
import { INotification } from "./notification.inerface";
import Notification from "./notification.model";

const getNotificationFromDb = async (query: Record<string, any>) => {
  return await Notification.find(query).sort("-createdAt");
};

const updateNotification = async (
  id: string,
  payload: Partial<INotification>
) => {
  return await Notification.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const makeMeRead = async (query: { user: any; notId: string }) => {
  return await Notification.findOneAndUpdate(
    { _id: query.notId, receiver: query.user },
    { isRead: true },
    {
      new: true,
    }
  );
};

const makeAllNotRead = async (query: { user: any; notId: string }) => {
  return await Notification.updateMany(
    { receiver: query.user },
    { isRead: true },
    {
      new: true,
    }
  );
};

export const notificationServices = {
  getNotificationFromDb,
  updateNotification,
  makeMeRead,
  makeAllNotRead,
};
