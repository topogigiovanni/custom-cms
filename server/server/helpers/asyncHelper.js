async function forEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const wrap = promise => (
  promise
    .then(data => ({ data, error: null }))
    .catch(error => ({ error, data: null }))
);

module.exports = {
  forEach,
  wrap
};
