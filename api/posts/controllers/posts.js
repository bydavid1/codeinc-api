'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  /*
  * Home page posts (recents, editors pick and more)
  */

  async home(ctx){

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

    const recents = await strapi.query('posts')
      .model.find({},  requiredData)
      .sort({'date': 'descending'})
      .populate(populateData)

    const editorsPick = await strapi.query('posts')
      .model.find({ editorsPick: true },  requiredData)
      .sort({'date': 'descending'})
      .populate(populateData)

    let data = {
      ids: {
        'recents': [],
        'editorsPick': []
      },
      posts: []
    }

    recents.map(item => {
        data.ids.recents.push(`${item._id}`)
        data.posts.push(item)
    })

    editorsPick.map(item => {
      data.ids.editorsPick.push(`${item._id}`)

      if (data.ids.recents.indexOf(`${item._id}`) === -1) {
        data.posts.push(item)
      }
    })

    ctx.send(data)
  },

  async slug(ctx){
    let entity = await strapi.query('posts').model.findOne({ slug: ctx.params.slug }).populate('category', [ 'title', 'slug']).populate('admin_user', ['firstname', 'lastname'])
    return sanitizeEntity(entity, { model: strapi.models.posts })
  },

  async getByCategory(ctx) {
    let category, results;
    category = await strapi.query('categories').model.findOne({slug: ctx.params.slug}).select({
      _id: 1,
      title: 1,
      description: 1,
      cover: 1,
      slug: 1
    })

    if (category) {
      results = await strapi.query('posts').model.find({category: category._id}).select({
        title: 1,
        slug: 1,
        date: 1,
        cover: 1,
      }).populate('cover', 'url')
      ctx.send({
        category: category,
        posts: results
      })
    } else {
      ctx.status = 404
    }
  }
};
