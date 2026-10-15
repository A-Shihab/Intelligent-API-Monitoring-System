const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Get all alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error.message);
    res.status(500).json({ error: 'Failed to fetch alerts.' });
  }
});

// Toggle resolved status
router.patch('/alerts/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    alert.resolved = !alert.resolved;
    await alert.save();
    res.status(200).json(alert);
  } catch (error) {
    console.error('Error toggling alert resolution:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an alert
router.delete('/alerts/:id', async (req, res) => {
  try {
    const deletedAlert = await Alert.findByIdAndDelete(req.params.id);
    if (!deletedAlert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error.message);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;