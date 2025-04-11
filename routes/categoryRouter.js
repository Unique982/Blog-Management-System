const express = require('express');
const CategoryController = require('../controllers/backend/categoryController');
const categoryRouter = express.Router();

categoryRouter.get('/category/add',CategoryController.getCategoryFrom);
categoryRouter.post('/category/add',CategoryController.AddCategory);

// lsit get 
categoryRouter.get('/category/list',CategoryController.getCategoryDataList);

// edit category Handle 
categoryRouter.get('/category/edit/:id',CategoryController.getEditfrom);
categoryRouter.post('/category/edit',CategoryController.postEditFromhandle);

// delete category 
categoryRouter.post("/category/delete/:id",CategoryController.deleteCategory);



module.exports = categoryRouter;