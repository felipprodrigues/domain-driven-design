function fetchData(callback) {
  setTimeout(() => {
    callback('Data fetched');
  }, 1000);
}

function fetchDataPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data fetched');
    }, 1000);
  });
}

export { fetchData, fetchDataPromise };
