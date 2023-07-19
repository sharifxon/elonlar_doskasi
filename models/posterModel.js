const {model, Schema} = require('mongoose')
const path = require('path');

const posterSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    region:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isActive:{
        type: Boolean,
        required: true,
        default: true
    },
    visits: {
        type:Number,
        default: 1
    },
    author:
        {type: Schema.Types.ObjectId,
        ref: 'User'
        },
    
    category: {
    type:String,
    required: true,
    enum: ['realty', 'transport', 'electronics', 'jobs']
},
},

{
    timestamps: true,
}
)
// creating  indexes
posterSchema.index({
    title: 'text', 
    description: 'text',
})


posterSchema.statics = {
    searchPartial: function(q){
        return this.find({
            $or: [
                {"title": new RegExp(q, 'gi')},
                {"descripton": new RegExp(q, 'gi')}
            ]
        });
    },
    searchFull: function(q){
        return this.find({
            $text: {$search: q, $caseSensitive: false}
        });
    }
}

module.exports = model('Poster', posterSchema)