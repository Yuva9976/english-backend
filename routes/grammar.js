const express = require('express');
const router = express.Router();
const {
  PartOfSpeech,
  GrammarType,
  GrammarRule,
  GrammarExample,
  GrammarExercise,
  GrammarQuizQuestion,
  GrammarResource
} = require('../models/grammar');

// GET all parts of speech
router.get('/', async (req, res) => {
  try {
    const parts = await PartOfSpeech.findAll({
      attributes: ['id', 'name', 'definition', 'importance', 'icon']
    });
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET details for one part of speech (with all related data)
router.get('/:id', async (req, res) => {
  try {
    const part = await PartOfSpeech.findByPk(req.params.id, {
      include: [
        { association: 'types', attributes: ['id', 'name', 'description', 'icon', 'examples', 'sample_words', 'color'] },
        { association: 'rules', attributes: ['id', 'rule_type', 'title', 'points', 'color', 'icon'] },
        { association: 'examples', attributes: ['id', 'sentence', 'usage_pattern', 'category'] },
        { association: 'exercises', attributes: ['id', 'exercise_type', 'title', 'prompt', 'passage', 'sample_answer'] },
        { association: 'quiz', attributes: ['id', 'emoji', 'question', 'question_type', 'hint', 'options', 'correct_answer', 'explanation'] },
        { association: 'resources', attributes: ['id', 'title', 'url', 'description', 'resource_type', 'video_embed_id'] }
      ]
    });

    if (!part) {
      return res.status(404).json({ error: 'Part of speech not found' });
    }

    res.json(part);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET types for a specific part
router.get('/:id/types', async (req, res) => {
  try {
    const types = await GrammarType.findAll({
      where: { part_id: req.params.id },
      attributes: ['id', 'name', 'description', 'icon', 'examples', 'sample_words', 'color']
    });
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET rules for a specific part
router.get('/:id/rules', async (req, res) => {
  try {
    const rules = await GrammarRule.findAll({
      where: { part_id: req.params.id },
      attributes: ['id', 'rule_type', 'title', 'points', 'color', 'icon']
    });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET examples for a specific part
router.get('/:id/examples', async (req, res) => {
  try {
    const examples = await GrammarExample.findAll({
      where: { part_id: req.params.id },
      attributes: ['id', 'sentence', 'usage_pattern', 'category']
    });
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET exercises for a specific part
router.get('/:id/exercises', async (req, res) => {
  try {
    const exercises = await GrammarExercise.findAll({
      where: { part_id: req.params.id },
      attributes: ['id', 'exercise_type', 'title', 'prompt', 'passage', 'sample_answer']
    });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET quiz questions for a specific part
router.get('/:id/quiz', async (req, res) => {
  try {
    const quiz = await GrammarQuizQuestion.findAll({
      where: { part_id: req.params.id },
      attributes: ['id', 'emoji', 'question', 'question_type', 'hint', 'options', 'correct_answer', 'explanation']
    });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET resources for a specific part
router.get('/:id/resources', async (req, res) => {
  try {
    const resources = await GrammarResource.findAll({
      where: { part_id: req.params.id },
      attributes: ['id', 'title', 'url', 'description', 'resource_type', 'video_embed_id']
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Learn More content for a specific type
router.get('/types/:typeId/learn-more', async (req, res) => {
  try {
    const type = await GrammarType.findByPk(req.params.typeId, {
      attributes: ['id', 'name', 'learn_more_content']
    });

    if (!type) {
      return res.status(404).json({ error: 'Grammar type not found' });
    }

    if (!type.learn_more_content) {
      return res.status(404).json({ error: 'Learn More content not available for this type' });
    }

    res.json({
      id: type.id,
      name: type.name,
      content: type.learn_more_content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
