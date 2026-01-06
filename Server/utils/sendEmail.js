// Email sending is disabled in this build — calling this will throw so the app doesn't silently fail to notify
const sendEmail = async function () {
  throw new Error('Email sending is disabled on this server. Remove calls to sendEmail or re-enable SMTP settings if needed.');
};

export default sendEmail;
