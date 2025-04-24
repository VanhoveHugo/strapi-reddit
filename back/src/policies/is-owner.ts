export default async (ctx, next) => {
  const { id } = ctx.params;
  const user = ctx.state.user;

  const entity = (await strapi.entityService.findOne("api::post.post", id, {
    populate: ["author"],
  })) as any;

  if (!entity || entity.author.id !== user.id) {
    return ctx.unauthorized(
      "Vous ne pouvez modifier ou supprimer que vos propres posts."
    );
  }

  return await next();
};
