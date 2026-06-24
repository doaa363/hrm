const express    = require('express');
const router     = express.Router();
const { getLogs } = require('../controllers/auditController');
const { protect, managerOrAdmin } = require('../middlewares/authMiddleware');

router.get('/', protect, managerOrAdmin, getLogs);

module.exports = router;
