const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Visitor
 *     description: Visitor operations
 * 
 * /view/visitor/{visitorName}:
 *   get:
 *     summary: Retrive visitor's PASS
 *     description: Retrieve visitor pass by providing the visitor's name.
 *     tags: [Visitor]
 *     parameters:
 *       - in: path
 *         name: visitorName
 *         required: true
 *         description: Visitor's name to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved visitor pass details.
 *         content:
 *           application/json:
 *             example:
 *               visitorData1
 *       404:
 *         description: Visitor not found.
 *       500:
 *         description: Internal Server Error. Failed to retrieve visitor pass details.
 */

 router.get('/view/visitor/:visitorName', (req, res) => {
    res.send('/view/visitor/:visitorName');
  });
  
  module.exports = router;