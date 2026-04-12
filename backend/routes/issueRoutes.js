const express = require('express');
const router = express.Router();
const auth = require('../middlewares/Auth');
const adminOnly = require('../middlewares/adminOnly');
const {
  issueBook,
  returnBook,
  issueValidators,
  returnValidators,
  requestValidators,
  requestBook,
  listRequests,
  listMyRequests,
  listActiveIssues,
  approveRequestValidators,
  approveRequest,
  rejectRequest,
  sendAlert,
} = require('../controllers/issueController');

router.get('/requests', auth, adminOnly, listRequests);
router.get('/requests/me', auth, listMyRequests);
router.get('/active', auth, adminOnly, listActiveIssues);

router.post('/request', auth, requestValidators, requestBook);
router.post('/issue', auth, adminOnly, issueValidators, issueBook);
router.post('/return', auth, adminOnly, returnValidators, returnBook);
router.post('/requests/:id/approve', auth, adminOnly, approveRequestValidators, approveRequest);
router.post('/requests/:id/reject', auth, adminOnly, rejectRequest);
router.post('/active/:id/alert', auth, adminOnly, sendAlert);

module.exports = router;
