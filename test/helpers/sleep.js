export default sec =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, sec)
  })
