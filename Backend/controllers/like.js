const Sauce = require('../models/sauce');

exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    if (like === 1) { //like & disLike
        Sauce.updateOne({ _id: req.params.id },
            {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
            })
            .then(() => res.status(200).json({ message: 'like + 1' }))
            .catch(error => res.status(400).json({ error }))
    } else if (like === -1) {
        Sauce.updateOne({ _id: req.params.id },
            {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
            })
            .then(() => res.status(200).json({ message: 'dislike + 1' }))
            .catch(error => res.status(400).json({ error }))
    } else { //annulation des likes
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                        })
                        .then(() => res.status(200).json({ message: 'like 0 ' }))
                        .catch(error => res.status(400).json({ error }))
                }
                else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                        })
                        .then(() => res.status(200).json({ message: 'disLike 0' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};