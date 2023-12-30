const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /approve/visitor/{visitorname}:
 *   put:
 *     summary: Approve a visitor
 *     description: This endpoint allows security personnel to approve a visitor. The visitor's approval status is updated to 'approved'.
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorname
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the visitor to be approved
 *     responses:
 *       200:
 *         description: Visitor approved successfully
 *       404:
 *         description: Visitor not found or unauthorized
 *       500:
 *         description: Internal Server Error
 */

 router.get('/approve/visitor/:visitorname', (req, res) => {
    res.send('/approve/visitor/:visitorname');
  });
  
  module.exports = router;