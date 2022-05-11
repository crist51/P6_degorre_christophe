const Sauce = require('../models/sauce');
const fs = require('fs');


//-----------------------------------------create----------------------------------------
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//=======================================================================================
// ---------------------------------------one sauce--------------------------------------

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//=======================================================================================
// -------------------------------------modify sauce-------------------------------------

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {//si image
      ...JSON.parse(req.body.sauce),//recupere tte  les info objet
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//genere la nouvelle image
    } : { 
      ...req.body };//si pas d'iamge
      //-------------rajout
      if(req.file){
        Sauce.findOne({_id:req.params.id})
        .then((s) => {
          const oldImg = s.imageUrl.split('/images/')[1]
          fs.unlink(`images/${oldImg}`,(error) => {
            if(error) console.log(error)
          })
        })
        .catch(error => res.status(400).json({ error }));
      }
      //===================
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//=======================================================================================
// ----------------------------------- delete sauce---------------------------------------

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];//nom image a supprimer
      fs.unlink(`images/${filename}`, () => {//supprimer le fichier
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet delete !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//=======================================================================================
// --------------------------------------all sauces--------------------------------------

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//=======================================================================================