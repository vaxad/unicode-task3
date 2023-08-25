const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')
const Word = require('./models/Words')

router.post('/', [body('word', 'enter a word with minimum length 2').isLength({ min: 2 }),
body('meaning', 'enter a descriptive meaning').isLength({ min: 2 })
], async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        res.send({ success: false, errors: err.array() }).status(400)
    } else {
        try {
            const word = req.body.word
            const meaning = req.body.meaning
            const inputWord = await Word.findOne({ word: word })
            if (inputWord) {
                res.send({ success: false, error: 'word already exists' }).status(400)
            } else {
                const savedWord = await Word.create({
                    word: word, meaning: meaning
                })
                res.send({ success: true, word: savedWord })
            }
        } catch (error) {
            res.send({ success: false, errors: error }).status(400)
        }
    }
})

router.put('/synonym/:id', [body('synonym', 'enter a valid word').isLength({ min: 2 })],
    async (req, res) => {
        try {
            const err = validationResult(req)
            if (!err.isEmpty()) {
                res.status(400).send({ success: false, errors: err.array() })
            } else {
                const id = req.params.id
                const word = await Word.findById(id)
                if (!word.synonyms.includes(req.body.synonym)) {
                    word.synonyms.push(req.body.synonym)
                }
                const savedWord = await word.save()
                res.status(200).send({ success: true, word: savedWord })
            }
        } catch (error) {
            res.status(400).send({ success: false, errors: error })
        }
    })

router.put('/antonym/:id', [body('antonym', 'enter a valid word').isLength({ min: 2 })],
    async (req, res) => {
        try {
            const err = validationResult(req)
            if (!err.isEmpty()) {
                res.status(400).send({ success: false, errors: err.array() })
            } else {
                const id = req.params.id
                const word = await Word.findById(id)
                if (!word.antonyms.includes(req.body.antonym)) {
                    word.antonyms.push(req.body.antonym)
                }
                const savedWord = await word.save()
                res.status(200).send({ success: true, word: savedWord })
            }
        } catch (error) {
            res.status(400).send({ success: false, errors: error })
        }
    })

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const word = await Word.findById(id)
        res.send({ success: true, word: word }).status(200)
    } catch (error) {
        res.status(400).send({ success: false, errors: error })
    }
})

router.get('/', async (req, res) => {
    try {
        const words = await Word.find()
        res.send({ success: true, words: words })
    } catch (error) {
        res.status(400).send({ success: false, errors: error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const word = await Word.findByIdAndDelete(id)
        res.send({ success: true, deleted: word }).status(200)
    } catch (error) {
        res.status(400).send({ success: false, errors: error })

    }
})

router.put('/:id', [body('meaning', 'enter a valid meaning').isLength({ min: 2 })], async (req, res) => {
    try {
        const id = req.params.id
        const err = validationResult(req)
        if (!err.isEmpty()) {
            res.status(400).send({ success: false, errors: err.array() })
        } else {
            const word = await Word.findById(id)
            word.meaning = req.body.meaning
            const updatedWord = await word.save()
            res.status(200).send({ success: true, updated: updatedWord })
        }
    } catch (error) {
        res.status(400).send({ success: false, errors: error })
    }
})

router.get('/find/:searchTerm', async (req, res) => {
    try {
        const search = req.params.searchTerm
        const words = await Word.find()
        const searchedWords = words.filter((el) => {
            return el.word.includes(search)
        })
        res.send({ success: true, suggestions: searchedWords }).status(200)

    } catch (error) {
        res.status(400).send({ success: false, errors: error })
    }
})


module.exports = router