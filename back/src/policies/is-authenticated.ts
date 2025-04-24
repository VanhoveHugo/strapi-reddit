export default (ctx, next) => {
  if (!ctx.state.user) {
    return ctx.unauthorized("Vous devez être connecté.");
  }
  return next();
};
