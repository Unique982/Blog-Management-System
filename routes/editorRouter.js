const express = require('express');

const EditorController = require('../controllers/backend/editorController');
const editorRouter = express.Router();

editorRouter.get('/editor/list',EditorController.getEditorlist);

module.exports = editorRouter;