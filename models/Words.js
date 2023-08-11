const mongoose=require('mongoose')

const wordSchema=new mongoose.Schema({
    word: {
        type:String,
        required:true
    },
    meaning:{
        type:String,
        required:true
    },
    synonyms:[{
        type:String
    }],
    antonyms:[{
        type:String
    }]
})

const Word = mongoose.model('word', wordSchema)

module.exports=Word