const express = require('express');
const router = express.Router();

/**
 * @swagger
 * DELETE USER:
 *   delete:
 *     summary: Delete a user account with security token
 *     description: Allows administrators to delete a user account.
 *     tags: [Security]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user to be deleted.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       401:
 *         description: Unauthorized.
 */

router.get('/delete/user/:username', (req, res) => {
    res.send('/delete/user/:username');
  });
  
  module.exports = router;