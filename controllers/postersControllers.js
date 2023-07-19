const { log } = require('handlebars');
const Poster = require('../models/posterModel');
const User = require('../models/userModel');
const { response } = require('express');
const filtering = require('../utils/filtering')

// @route  get /
// @desc  get poster page
// @access public
let getPosterPage = async(req, res) => {

    
    const pagelimit = 10
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const total = await Poster.countDocuments() 
    
    if(req.url === '/'){
        return res.redirect(`?page=1&limit=${pagelimit}` );
    }
    if(req.query.search){
        const {search} = req.query
        const posters = await Poster.searchPartial(search).lean()

        return res.status(200).render('poster/searchResults', {
            title:'searchResults',
            posters:posters.reverse(),
            url:process.env.URL,
            querySearch: req.query.search,
            user:req.session.user
        })
        
    }
    
    if(!req.query.page || !req.query.limit){
        const {category, from, to, region} = req.query
        //$gte $lte 
        const filterings = filtering(category, from, to, region)
        const posters = await Poster.find(filterings).lean()

        return res.status(200).render('poster/searchResults', {
            title:'fiter Results',
            posters:posters.reverse(),
            url:process.env.URL,
            querySearch: req.query.search,
            user:req.session.user
        })
        
    }
   const posters = await Poster
   .find()
   .skip((page * limit) - limit)
   .limit(limit)
   .lean()
    res.render('poster/posters',{
        title:'poster page',
        posters:posters.reverse(),
        pagination:{
            limit,
            page,
            pageCount:Math.ceil(total/limit)
        },
        url:process.env.URL
      })
}
let addNewPosterPage = (req, res) => {
    res.render('poster/add-poster', {
        title:"Yangi elon qo'shish",
        url:process.env.URL,
        user:req.session.user
    })
}
let addNewPoster = async (req, res) => {
    const newPoster = new Poster({
        title: req.body.title,
        amount:req.body.amount,
        region:req.body.region,
        image:'uploads/' + req.file.filename,
        description:req.body.description,
        author:req.session.user._id,
        category:req.body.category
    })
    await User.findByIdAndUpdate(req.session.user._id,
        {$push:{posters:newPoster._id}}, 
        {new:true, upsert:true}
        )
        const posterSaved = await newPoster.save()
        const posterId = posterSaved._id
        res.redirect('/posters/' + posterId)

   
}
const getOnePoster = async (req, res) =>{
    const poster = await Poster
    .findByIdAndUpdate(req.params.id, {$inc: {visits: 1}}, {new:true})
    .populate('author')
    .lean()

    // let isMe = false
    //     if(req.session.user){
    //       isMe = poster.author._id == req.session.user._id.toString(); 
    //     }
      
    
    
        res.render('poster/one-poster',{
            title:poster.title,
            poster,
            author: poster.author,
            user:req.session.user,
            url:process.env.URL,
            // isMe
        })
}
const getEditPosterPage =  async (req, res) => {
    const poster = await Poster.findById(req.params.id).lean();
    res.render('poster/edit-poster',{
        title:"edit-poster",
        url:process.env.URL,
        user:req.session.user,
        poster,
    
    })
}

const updatePoster = async (req, res) => {  
    const editedPoster = {
        title: req.body.title,
        amount:req.body.amount,
        region:req.body.region,
        image:req.body.image,
        category:req.body.category,
        description:req.body.description
    }
    await Poster.findByIdAndUpdate(req.params.id, editedPoster).lean();
    res.redirect('/posters')
}
 
const deletePoster = async (req, res) => {
    await Poster.findByIdAndRemove(req.params.id).lean();
    res.redirect('/posters')
}



module.exports ={ 
    getPosterPage,
    addNewPosterPage,
    addNewPoster,
    getOnePoster, 
    getEditPosterPage,

    updatePoster,
    deletePoster
}