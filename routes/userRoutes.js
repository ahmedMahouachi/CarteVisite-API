const express = require('express');

const router = express.Router();
const { createUser,
    login,
    deleteProfile,
    updateProfile,
    getProfile,
    getProfileById    } = require('../controllers/userController');


router.post('/createUser/', createUser);
router.post('/login/', login);
router.delete('/deleteProfile/', deleteProfile);
router.put('/updateProfile/', updateProfile);
router.get('/getProfile/', getProfile);
router.get('/getProfileById/:userId', getProfileById);

module.exports = router;
