const toPromise = (wx) => {
  return (method) => {
    return (option) => {
      return new Promise ((resolve, reject) => {
        wx[method]({
          ...option,
          success: (res) => { resolve(res) },
          fail: (err) => { reject(err) }
        })
      })
    }
  }
}

export default toPromise