const express = require('express');
const router = express.Router();

const {
  createUser,
  login,
  deleteProfile,
  updateProfile,
  getProfile,
  getProfileById,
  generateCv,
  getAllProfiles,
  deleteProfileById
} = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /user/createUser:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - societe
 *               - phoneNumber
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               fullName:
 *                 type: string
 *                 example: Ahmed Mahouachi
 *               societe:
 *                 type: string
 *                 example: ToReal&Co
 *               phoneNumber:
 *                 type: string
 *                 example: "22123456"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/createUser/', createUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Connexion réussie avec token JWT
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login/', login);

/**
 * @swagger
 * /user/deleteProfile:
 *   delete:
 *     summary: Supprimer son propre profil
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 */
router.delete('/deleteProfile/', deleteProfile);

/**
 * @swagger
 * /user/updateProfile:
 *   put:
 *     summary: Mettre à jour son profil
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               societe:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       401:
 *         description: Token invalide
 */
router.put('/updateProfile/', updateProfile);

/**
 * @swagger
 * /user/getProfile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *       401:
 *         description: Token manquant
 */
router.get('/getProfile/', getProfile);

/**
 * @swagger
 * /user/getProfileById/{userId}:
 *   get:
 *     summary: Récupérer un profil par ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/getProfileById/:userId', getProfileById);

/**
 * @swagger
 * tags:
 *   name: CV
 *   description: Génération de CV
 */

/**
 * @swagger
 * /user/generatecv:
 *   post:
 *     summary: Générer un CV en PDF
 *     tags: [CV]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personalInfo:
 *                 type: object
 *               experiences:
 *                 type: array
 *                 items:
 *                   type: object
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: CV généré avec succès
 */
router.post('/generatecv/', generateCv);

/**
 * @swagger
 * /user/getallprofiles:
 *   get:
 *     summary: Récupérer tous les profils utilisateurs
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/getallprofiles/', getAllProfiles);

/**
 * @swagger
 * /user/deletebyid/{userId}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID (admin)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/deletebyid/:userId', deleteProfileById);

module.exports = router;
