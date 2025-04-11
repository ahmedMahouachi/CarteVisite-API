const express = require('express');

const router = express.Router();
const { createUser,
    login,
    deleteProfile,
    updateProfile,
    getProfile,
    getProfileById,
    generateCv,
    getAllProfiles  } = require('../controllers/userController');
 

router.post('/createUser/', createUser);
router.post('/login/', login);
router.delete('/deleteProfile/', deleteProfile);
router.put('/updateProfile/', updateProfile);
router.get('/getProfile/', getProfile);
router.get('/getProfileById/:userId', getProfileById);
router.post('/generatecv/', generateCv);
router.get('/getallprofiles/', getAllProfiles);


module.exports = router;
