import ArticleModel from "../models/Article.js";

export const getAllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Статья не найдена" });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить статью" });
  }
};

