const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User operations
 * 
 * /view/visitor/user:
 *   get:
 *     summary: View visitors created by the authenticated user
 *     description: Retrieve a list of visitors created by the user with a valid token.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved visitors.
 *         content:
 *           application/json:
 *             example:
 *               - visitorData1
 *               - visitorData2
 *       401:
 *         description: Unauthorized. Invalid or missing security token.
 *       500:
 *         description: Internal Server Error. Failed to retrieve visitors.
 */

router.get('/view/visitor/user', (req, res) => {
    res.send('/view/visitor/user');
  });
  
  module.exports = router;