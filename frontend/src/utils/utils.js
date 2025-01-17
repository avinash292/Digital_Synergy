// import * as moment from 'moment';
const convertStringToObject = (userString, number) => {
  const [first_name, last_name, id] = userString.split(",");
  switch (number) {
    case 1:
      return first_name;
    case 2:
      return last_name;
    case 3:
      return id;
    default:
      return { id: parseInt(id), first_name, last_name };
  }
};
const formatMessageDate = (createdAt) => {
  const messageDate = new Date(createdAt);
  const today = new Date();

  const isToday =
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear();

  if (isToday) {
    // Display time only for messages sent today
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    // Display full date and time for messages older than one day
    return messageDate.toLocaleString();
  }
};
export { convertStringToObject, formatMessageDate };
