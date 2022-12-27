const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Masukan judul'],
        minLength: 1
    },
    page: {
        type: Number,
        required: [true, 'Masukan jumlah halaman']
    },
    status: {
        type: String,
        required: [true, 'Masukan status'],
        enum: ['sudah', 'belum'],
        default: 'belum'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Tolong masukan User']
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Book', BookSchema)