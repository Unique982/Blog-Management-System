const express = require('express');

const EditorController = require('../controllers/backend/editorController');
const editorRouter = express.Router();

editorRouter.get('/editor/list',EditorController.getEditorlist);
editorRouter.get('/editor/add',EditorController.getAddEditorFrom);
editorRouter.post('/editor/add',EditorController.postEditorFrom);
// delete 
editorRouter.post('/editor/delete/:id',EditorController.deleteEditor);

// edit rout
editorRouter.get('/editor/edit/:id',EditorController.getEditorEditForm);
editorRouter.post('/editor/edit',EditorController.postEditorEditForm);
module.exports = editorRouter;