const requestLogger = (req, res, next) => {
  console.log(new Date().toLocaleString('fi-EN'), req.method, req.url);
  next();
};

export default requestLogger;
