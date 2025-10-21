const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router.get('/', getTasks); // [cite: 160]
router.post('/', createTask); // [cite: 163]
router.put('/:id', updateTask); // [cite: 166]
router.delete('/:id', deleteTask); // [cite: 167]

module.exports = router;