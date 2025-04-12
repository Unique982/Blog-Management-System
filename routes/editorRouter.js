const express = require('express');

const EditorController = require('../controllers/backend/editorController');
const editorRouter = express.Router();

editorRouter.get('/editor/list',EditorController.getEditorlist);
editorRouter.get('/editor/add',EditorController.getAddEditorFrom);
editorRouter.post('/editor/add',EditorController.postEditorFrom);

module.exports = editorRouter;