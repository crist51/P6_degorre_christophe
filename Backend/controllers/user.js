const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const MaskData = require('maskdata');

const passwordSchema = new passwordValidator();

passwordSchema
  .is().min(4)                                    // Minimum length 4
  .is().max(15)                                  // Maximum length 15
  //.has().uppercase()                              // Must have uppercase letters
  //.has().lowercase()                              // Must have lowercase letters
  //.has().digits()                                // Must have at least 1 digit
  //.has().not().symbols();                         // Has no symbols
  //.has().not().spaces()                           // Should not have spaces is a wrong rule to apply


//---------------------------------- signup user ----------------------------------

exports.signup = (req, res, next) => {
  if (!emailValidator.validate(req.body.email) || !passwordSchema.validate(req.body.password)) { // si l'email et le mot de passe ne ne corespond pas au Shema
    return res.status(400).json({ error });
    
  } else if (emailValidator.validate(req.body.email) || passwordSchema.validate(req.body.password)) { //sinon on creer
    const maskedMail = MaskData.maskEmail2(req.body.email);// mask Mail
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: maskedMail ,
        password: hash
      });
      user.save()
      .then(hash => res.status(201).json({ message: 'User created' }))
      .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
  };
  
}

//=======================================================================================
//------------------------------------- login user -------------------------------------- 

exports.login = (req, res, next) => { // login user
  const maskedMail = MaskData.maskEmail2(req.body.email);
  User.findOne({ email: maskedMail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Incorrect password' });
          }
          res.status(200).json({ // delivery TOKEN
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '12h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//=======================================================================================
