'use strict';

const requiredData = {
  title: 1,
  slug: 1,
  date: 1,
}

const populateData = [
  {
    path: 'category',
    select: ['title', 'slug']
  },
  {
    path: 'created_by',
    select: ['firstname', 'lastname']
  }
]

module.exports = {

  /*
  * Get tags for menu UI
  */


  async menu(ctx) {
     let entities = await strapi.query('tags').model.find({}, {_id:1,name:1,slug:1,logo:0}).limit(4)

    ctx.send(entities)
  },

  /*
  * Find posts by tag
  */

  async slug(ctx) {
    let tag, results;
    tag = await strapi.query('tags').model.findOne({slug: ctx.params.slug}).select({
      _id: 1,
      name: 1,
      slug: 1,
    }).populate('SEO')

    if (tag) {
      results = await strapi.query('posts')
      .model.find({tags: tag._id}, requiredData)
      .populate(populateData)
      ctx.send({
        tag: tag,
        posts: results
      })
    } else {
      ctx.status = 404
    }
 },
};
