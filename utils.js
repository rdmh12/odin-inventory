export function redirectWithSuccess(req, res, path, message) {
  req.session.message = { isError: false, text: message };
  res.redirect(path);
}

export function redirectWithError(req, res, path, message) {
  req.session.message = { isError: true, text: message };
  res.redirect(path);
}

export function popMessage(req) {
  const message = req.session.message;

  delete req.session.message;

  return message;
}
