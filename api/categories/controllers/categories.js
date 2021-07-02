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
  * Find posts by categories
  */

  async slug(ctx) {
    let category, results;
    category = await strapi.query('categories')
      .model.findOne({slug: ctx.params.slug})
      .select({
        _id: 1,
        title: 1,
        slug: 1
      }).populate('SEO')

    if (category) {
      results = await strapi.query('posts')
      .model.find({category: category._id}, requiredData)
      .populate(populateData)

      ctx.send({
        category: category,
        posts: results
      })
    } else {
      ctx.status = 404
    }
  }
};
