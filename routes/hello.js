const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Returns a greeting
 *     description: Returns a simple greeting message.
 *     responses:
 *       200:
 *         description: A greeting message
 */
router.get('/hello', (req, res) => {
  res.send('Hello from the route!');
});

module.exports = router;
