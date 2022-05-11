const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauce');
const likeCtrl = require('../controllers/like');

router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);

router.post('/:id/like', auth, likeCtrl.likeSauce);

module.exports = router;



