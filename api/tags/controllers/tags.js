'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async menu(ctx) {
     let entities = await strapi.query('tags').model.find({}, {_id:1,name:1,slug:1,logo:0}).limit(4)

    ctx.send(entities)
  },

  async slug(ctx) {
    let tag, results;
    tag = await strapi.query('tags').model.findOne({slug: ctx.params.slug}).select({
      _id: 1,
      name: 1,
      extract:1,
      slug: 1,
      logo: 1,
    })

    if (tag) {
      results = await strapi.query('posts').model.find({tags: tag._id}, 'title slug date category cover')
        .populate('category', {title: 1, slug: 1, cover: 0})
      ctx.send({
        tag: tag,
        posts: results
      })
    } else {
      ctx.status = 404
    }
 },
};
