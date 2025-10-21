const { readDB, writeDB, logAction, sanitize } = require('../utils');

// GET /api/tasks - Fetch paginated and filtered tasks [cite: 161]
exports.getTasks = (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query; // [cite: 109, 110]
    const db = readDB();
    
    let filteredTasks = db.tasks;

    // Apply search filter [cite: 109]
    if (search) {
      filteredTasks = db.tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    res.status(200).json({
      tasks: paginatedTasks,
      totalItems: filteredTasks.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredTasks.length / limit),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

// POST /api/tasks - Create a new task [cite: 164]
exports.createTask = (req, res) => {
  const { title, description } = req.body;

  // Backend Validation [cite: 212, 213]
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required.' });
  }
  if (title.length > 100 || description.length > 500) {
    return res.status(400).json({ error: 'Input exceeds max length.' });
  }

  // Sanitize inputs [cite: 214]
  const saneTitle = sanitize(title);
  const saneDescription = sanitize(description);

  const db = readDB();
  const newId = db.tasks.length > 0 ? Math.max(...db.tasks.map(t => t.id)) + 1 : 1020; // Start ID high for demo
  
  const newTask = {
    id: newId,
    title: saneTitle,
    description: saneDescription,
    createdAt: new Date().toISOString().split('T')[0], // [cite: 178]
  };

  db.tasks.push(newTask);
  writeDB(db);

  // Log the 'Create' action [cite: 195, 208]
  logAction('Create Task', newTask.id, { 
    title: newTask.title, 
    description: newTask.description 
  });

  res.status(201).json(newTask);
};

// PUT /api/tasks/:id - Update an existing task [cite: 166]
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  // Backend Validation [cite: 212, 213]
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required.' });
  }
   if (title.length > 100 || description.length > 500) {
    return res.status(400).json({ error: 'Input exceeds max length.' });
  }

  // Sanitize inputs [cite: 214]
  const saneTitle = sanitize(title);
  const saneDescription = sanitize(description);

  const db = readDB();
  const taskIndex = db.tasks.findIndex((t) => t.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const oldTask = db.tasks[taskIndex];
  const updatedContent = {};

  // Check what changed for the audit log [cite: 207]
  if (oldTask.title !== saneTitle) updatedContent.title = saneTitle;
  if (oldTask.description !== saneDescription) updatedContent.description = saneDescription;

  // Update the task
  const updatedTask = { ...oldTask, title: saneTitle, description: saneDescription };
  db.tasks[taskIndex] = updatedTask;
  writeDB(db);

  // Log the 'Update' action only if something changed
  if (Object.keys(updatedContent).length > 0) {
    logAction('Update Task', updatedTask.id, updatedContent);
  }

  res.status(200).json(updatedTask);
};

// DELETE /api/tasks/:id - Delete a task [cite: 167]
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  const taskIndex = db.tasks.findIndex((t) => t.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  // Remove the task
  const [deletedTask] = db.tasks.splice(taskIndex, 1);
  writeDB(db);

  // Log the 'Delete' action [cite: 195, 209]
  logAction('Delete Task', deletedTask.id, null);

  res.status(200).json({ message: 'Task deleted successfully.' });
};