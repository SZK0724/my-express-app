const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User operations
 * 
 * /update/visitor/{visitorname}:
 *   put:
 *     summary: Update visitor information for the authenticated user
 *     description: Update information for a visitor created by the user with a valid token.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorname
 *         required: true
 *         description: Visitor's name to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkintime:
 *                 type: string
 *                 description: Updated check-in time.
 *               checkouttime:
 *                 type: string
 *                 description: Updated check-out time.
 *               temperature:
 *                 type: number
 *                 description: Updated visitor's temperature.
 *               gender:
 *                 type: string
 *                 description: Updated visitor's gender.
 *               ethnicity:
 *                 type: string
 *                 description: Updated visitor's ethnicity.
 *               age:
 *                 type: integer
 *                 description: Updated visitor's age.
 *               phonenumber:
 *                 type: string
 *                 description: Updated visitor's phone number.
 *     responses:
 *       200:
 *         description: Visitor updated successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing security token.
 *       404:
 *         description: Visitor not found or unauthorized.
 *       500:
 *         description: Internal Server Error. Failed to update the visitor.
 */


router.get('/view/visitor/:visitorName', (req, res) => {
    res.send('/view/visitor/:visitorName');
  });
  
  module.exports = router;