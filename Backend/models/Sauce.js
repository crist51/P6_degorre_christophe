const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    name: { type: String,  require: true },
    manufacturer: { type: String,  require: true },
    description: { type: String,  require: true },
    mainPepper: { type: String,  require: true },
    imageUrl: { type: String,  require: true },
    heat: { type: Number,  require: true },
    userId: { type: String},
    //--------Systeme likes & dislikes--------
    likes: { type: Number, default: 0},
    dislikes:{ type: Number, default: 0},
    usersLiked: { type:[ String ]},
    usersDisliked: { type:[ String ]}
    //----------------------------------------
});

module.exports = mongoose.model('Sauce', sauceSchema);