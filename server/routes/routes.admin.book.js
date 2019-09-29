const passport = require('passport')
const bookModel = app.models.Book

module.exports = function (app) {
    var router = app.loopback.Router()

    router.get('/book', passport.authenticate('', { session: false }), async function (req, res){
        listBook = await bookModel.find()
        return res.json(listBook.rows)
    })

    router.get('/book/:bookId', passport.authenticate('', { session: false }), function (req, res){
        book = await bookModel.findById(req.body.bookId)
        return res.json(book)
    })

    router.post('/book/:bookId/update', passport.authenticate('', { session: false }), function (req, res){
        const bookData = {}
        bookData.uid = req.body.uid
        bookData.name = req.body.name
        bookData.categoryId = req.body.categoryId
        bookData.description = req.body.description
        bookData.imgURL = req.body.imgURL
        bookData.publisher = req.body.publisher
        bookData.author = req.body.author
        bookData.quantity = req.body.quantity
        bookData.sellPrice = req.body.sellPrice
        bookData.publishedAt = req.body.publishedAt
        try{
            book = await bookModel.findByIdAndUpdate({id: req.body.bookId}, bookData)
            return res.json(book)
        } catch (error) {
            return res.status(400).json(error)
        }
    })

    router.post('/book/:bookId/deltete', passport.authenticate('', { session: false }), function (req, res){
        try{
            book = await bookModel.destroyById({id: req.body.bookId})
            return res.json(book)
        } catch (error) {
            return res.status(400).json(error)
        }
    })

    app.use(router)
}
