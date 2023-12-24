const express = require('express');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User operations
 * 
 * components:
 *   schemas:
 *     CreateVisitorRequest:
 *       type: object
 *       required:
 *         - visitorname
 *         - checkintime
 *         - checkouttime
 *         - temperature
 *         - gender
 *         - ethnicity
 *         - age
 *         - phonenumber
 *       properties:
 *         visitorname:
 *           type: string
 *           description: Visitor's name.
 *         checkintime:
 *           type: string
 *           description: Check-in time.
 *         checkouttime:
 *           type: string
 *           description: Check-out time.
 *         temperature:
 *           type: number
 *           description: Visitor's temperature.
 *         gender:
 *           type: string
 *           description: Visitor's gender.
 *         ethnicity:
 *           type: string
 *           description: Visitor's ethnicity.
 *         age:
 *           type: integer
 *           description: Visitor's age.
 *         phonenumber:
 *           type: string
 *           description: Visitor's phone number.
 * 
 * /create/visitor/user:
 *   post:
 *     summary: Create a visitor for the authenticated user
 *     description: Create a new visitor for the user with a valid token.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVisitorRequest'
 *     responses:
 *       200:
 *         description: Visitor created successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing security token.
 *       500:
 *         description: Internal Server Error. Failed to create the visitor.
 */


router.get('/create/visitor/user', (req, res) => {
    res.send('/create/visitor/user');
  });
  
  module.exports = router;