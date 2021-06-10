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
      logo:0
    })
    console.log(tag)

    if (tag) {
      results = await strapi.query('posts').model.find({tags: tag._id}).select({
        title: 1,
        slug: 1,
        date: 1,
        cover: 1,
        category: 1
      }).populate('category', 'url')
      ctx.send({
        posts: results
      })
    } else {
      ctx.send({
        results: 0
      })
    }
 },
};
