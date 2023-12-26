const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User operations
 * 
 * /delete/visitor/{visitorname}:
 *   delete:
 *     summary: Delete a visitor for the authenticated user
 *     description: Delete a visitor for the user with a valid token.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorname
 *         required: true
 *         description: Visitor's name to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitor deleted successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing security token.
 *       404:
 *         description: Visitor not found or unauthorized.
 *       500:
 *         description: Internal Server Error. Failed to delete the visitor.
 */


router.get('/delete/visitor/{visitorname}', (req, res) => {
    res.send('/delete/visitor/{visitorname}');
  });
  
  module.exports = router;