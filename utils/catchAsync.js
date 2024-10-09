function catchAsync(fn) {
  return function(req, res, next) {
      Promise.resolve(fn(req, res, next)).catch((err) => {
          console.log(err)
          res.status(err.statusCode || 500).send({"message": err.message || "Server Error"})
          return
      });
  };
}


export default catchAsync;