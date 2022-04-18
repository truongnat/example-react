function isObjectEmpty(obj = {}) {
  return !Object.keys(obj).length;
}

function rejectObjEmpty(obj = {}) {
  return isObjectEmpty(obj) ? null : obj;
}

module.exports = {
  isObjectEmpty,
  rejectObjEmpty,
};
