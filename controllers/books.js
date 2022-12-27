const Book = require('../models/Book')

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({createdBy: req.user.userId}).sort('createdAt')
        const count = books.length
        
        res.status(200).json({books, count})
    } catch (error) {
        res.status(404).json({msg: error.message})
    }
}

const getBook = async (req, res) => {
    try{
        const {
            user:{userId}, 
            params:{id}
        } = req

        const book = await Book.findOne({
            _id: id,
            createdBy: userId 
        })
        if (!book){
            throw new Error(`Buku dengan id:${id} tidak ditemukan`)
        }

        res.status(200).json({book})
    }catch(error){
        res.status(404).json({msg: error.message})
    }
}

const createBook = async (req, res) => {
    try {   
        req.body.createdBy = req.user.userId
    
        const book = await Book.create(req.body)
        res.status(201).json({book})
    } catch (error){
        res.status(400).json({msg: error.message})
    }
}

const updateBook = async (req, res) => {
    try{
        const {
            body:{title, page},
            user:{userId}, 
            params:{id}
        } = req
        if (title === '' || !page){
            throw new Error('Judul dan halaman tidak boleh kosong')
        }

        const book = await Book.findOneAndUpdate({_id: id,createdBy: userId},req.body,{new: true,runValidators:true})
        if (!book){
            throw new Error(`Buku dengan id:${id} tidak ditemukan`)
        }

        res.status(200).json({book})
    }catch(error){
        res.status(404).json({msg: error.message})
    }
}

const deleteBook = async (req, res) => {
    try{
        const {
            user: {userId},
            params: {id}
        } = req
        
        const book = await Book.findOneAndDelete({
            _id: id,
            createdBy: userId
        })
        if(!book){
            throw new Error(`Buku dengan id:${id} tidak ditemukan`)
        }

        res.status(204).json()
    }catch(error){
        res.status(404).json({msg: error.message})
    }
}

module.exports = {getAllBooks, getBook, createBook, updateBook, deleteBook}
