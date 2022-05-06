function isObjectEmpty(obj = {}) {
  return !Object.keys(obj).length;
}

function rejectObjEmpty(obj = {}) {
  return isObjectEmpty(obj) ? null : obj;
}

function generateOTP(otp_length) {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

function getSecondBetween2Date(d1, d2) {
  return (new Date(d2).getTime() - new Date(d1).getTime()) / 1000;
}

function randomPassword(_length) {
  let chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let pw = "";

  for (let i = 0; i <= _length; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    pw += chars.substring(randomNumber, randomNumber + 1);
  }

  return pw;
}

module.exports = {
  isObjectEmpty,
  rejectObjEmpty,
  generateOTP,
  getSecondBetween2Date,
  randomPassword,
};
