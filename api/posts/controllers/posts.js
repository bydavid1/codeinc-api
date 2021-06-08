'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async test(ctx){
    let entities;
    entities = await strapi.query('posts').model.find({ editorsPick: true}).select({
      title: 1,
      slug: 1,
      date: 1,
      cover: 1,
      category: 1
    }).populate('cover', 'url').populate('category', 'title') //Fix this problem (just needed data)

    ctx.send(entities)
  },

  async recent(ctx){
    let entities = await strapi.query('posts').model.find({}).sort({'date': 'descending'}).select({
      title: 1,
      slug: 1,
      date: 1,
      cover: 1,
      category: 1
    }).populate('cover', 'url').populate('category', 'title') //Fix this problem (just needed data)

    ctx.send(entities)
  },

  async slug(ctx){
    let entity = await strapi.query('posts').model.findOne({ slug: ctx.params.slug }).populate('category', 'title').populate('admin_user', ['firstname', 'lastname'])
    return sanitizeEntity(entity, { model: strapi.models.posts })
  }
};
