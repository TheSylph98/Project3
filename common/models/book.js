let to = require('await-to-js').to
let FD = require('../formatDate')
'use_strict';

module.exports = function(Book) {
    const Promise = require('bluebird')

    // Admin
    Book.addBook = async function(reqData){
        let i
        // let categoryList = []
        // for (i = 0; i < reqData.categoryList.length ; i++){
        //     categoryList.push(reqData.categoryList[i])
        // }
        const bookData = {
            uid: reqData.uid,
            name : reqData.name,
            authorId : reqData.authorId,
            description : reqData.description,
            imgURL : reqData.imgURL,
            categoryId: reqData.categoryId,
            publisherId : reqData.publisherId,
            quantity : reqData.quantity,
            sellPrice : reqData.sellPrice,
            publishedAt : FD.formatDate(reqData.publishedAt)
        }
        try {
            let [err, book] = await to(Book.findOne({where: {uid: reqData.uid}}))
            if (book != null) {
                return "Da ton tai cuon sach nay"
            }
            bookCreate = await Book.create(bookData)
            return bookCreate
        } catch (error) {
            console.log('create Book', error)
            throw error
        }
    }

    Book.updateBook = async function(reqData){
        let i
        // let categoryList = []
        // for (i = 0; i < reqData.categoryList.length ; i++){
        //     categoryList.push(reqData.categoryList[i])
        // }
        const bookData = {
            uid: reqData.uid,
            name : reqData.name,
            authorId : reqData.authorId,
            description : reqData.description,
            imgURL : reqData.imgURL,
            categoryId: reqData.categoryId,
            publisherId : reqData.publisherId,
            quantity : reqData.quantity,
            sellPrice : reqData.sellPrice,
            publishedAt : FD.formatDate(reqData.publishedAt)
        }
        try{
            book = await Book.upsertWithWhere({id: reqData.id}, bookData)
            return book
        } catch (error) {
            throw error
        }
    }

    // Customer
    Book.showBook = async function(id) {
        try {
            const data1 = await Book.findById(id);
            let Category = app.models.Category
            let Author = app.models.Author
            let Publisher = app.models.Publisher
            let author = await Author.findById(data1.authorId,{fields: {name: true}})
            let category =  await Category.findById(data1.categoryId,{fields: {name: true}})
            let publisher = await Publisher.findById(data1.publisherId,{fields: {name: true}})
            let data = {  
                id: data1.id,
                uid: data1.uid,
                title: data1.name,
                imgUrl: data1.imgURL,
                author: author.name,
                price: data1.sellPrice,
                genres: category.name,
                publisher: publisher.name,
                description: data1.description,
                enable: data1.enable
            }
            return data
        } catch (err) {
            console.log('show Book', err)
            return []
        }
    }

    Book.listBook = async function(queryData) {
        try {
            const [data1] = await Promise.all([
                Book.find({
                    where: queryData,
                    fields: {
                        id: true,
                        uid: true,
                        name: true, 
                        authorId: true, 
                        imgURL: true, 
                        sellPrice: true
                    }
                })
            ])
            let i
            let data = []
            let Author = app.models.Author
            for (i = 0; i < data1.length; i++){
                let temp = {}
                temp.id = data1[i].id
                temp.uid = data1[i].uid
                temp.title = data1[i].name
                temp.imgUrl = data1[i].imgURL
                temp.price = data1[i].sellPrice
                author = await Author.findById(data1[i].authorId)
                temp.author = author.name
                data.push(temp)
            }
            return data
        } catch (err) {
            console.log('list Book', err)
            return []
        }
    }

    Book.addToCart = async function(bookId, quantity, currentQuantity){
        let quan = quantity + currentQuantity
        let book = await Book.findById(bookId)
        if (book.enable != true || book.quantity == 0 || quan > book.quantity){
            return []
        }
        let data ={
            id: book.id,
            title: book.name,
            imgUrl: book.imgURL,
            price:book.sellPrice,
        }
        if (quantity == 0){
            return [data]
        }
        else return [data]         
    }

    Book.updateCart = async function(dataList) {
        let i;
        let productIdList = Object.keys(dataList);
        for (i =0; i < productIdList.length; i++){
            let book = await Book.findById(productIdList[i])
            if (book.enable != 1 || book.quantity < dataList[productIdList[i]]){
                return [productIdList[i]]
            }
        }
        return "success"

    }

    Book.searchAutoCompleted = async function(){
        let Category = app.models.Category
        let Author = app.models.Author
        try {
            let listBook = await Promise.all([Book.find({fields: {name: true}})])
            let listAuthor = await Promise.all([Author.find({fields: {name: true}})])
            let listCategory = await Promise.all([Category.find({fields: {name: true}})])
            let i
            let book = []
            for (i=0; i< listBook[0].length; i++){
                book.push(listBook[0][i].name)
            }
            let author = []
            for (i=0; i< listAuthor[0].length; i++){
                author.push(listAuthor[0][i].name)
            }
            let category = []
            for (i=0; i< listCategory[0].length; i++){
                category.push(listCategory[0][i].name)
            }
            let data = {
                book: book,
                category: category,
                author: author
            }
            return data
        } catch (err) {
            console.log('list Book', err)
            return []
        }
    }

    Book.search3  = async function(reqData){
        
        let Category = app.models.Category
        let Author = app.models.Author
        queryField = {}
        if (reqData.author != ''){
            let author = await Author.findOne({where: {name: reqData.author},fields: {id: true}})
            queryField.authorId = author.id
        }
        if (reqData.category != ''){
            let category = await Category.findOne({where: {name: reqData.category},fields: {id: true}})
            queryField.categoryId = category.id
        }
        if (reqData.book != ''){
            queryField.name = reqData.book
        }
        let book = await Book.listBook(queryField)
        return book
    }

    Book.listWishList = async function(userId){
        let Customer = app.models.Customer
        let customer = await Customer.findById(userId)
        let bookList = []
        for (let i = 0; i < customer.wishList.length; i++){
            let book = await Book.findById(customer.wishList[i])
            let data = {
                id: book.id,
                title: book.name,
                imgUrl : book.imgURL,
                price : book.sellPrice
            }
            if (book.enable == false){
                data.status = "Ngừng kinh doanh"
            } else {
                if (book.quantity > 0){
                    data.status = "Còn hàng"
                } else{
                    data.status = "Hết hàng"
                }
            }
            bookList.push(data)
        }
        return bookList
    }
    
    Book.addToWishList = async function(userId, bookId, action){
        let Customer = app.models.Customer
        try {
            let customer = await Customer.findById(userId)
            let wL = customer.wishList
            if (action == 'add' & !wL.includes(bookId)){
                wL.push(bookId)
            } else if (action == 'remove' & wL.includes(bookId)){
                wL.splice( wL.indexOf(bookId), 1 )
            }
            await Customer.upsertWithWhere({id: userId}, {wishList: wL})
            return await Book.listWishList(userId)
        } catch (err){
            console.log("add to wishList", err)
            return []
        }
    } 

    //
    Book.remoteMethod('addBook', 
    {
        http: {path: '/addBook', verb: 'post'},
        accepts: {arg: 'reqData', type: 'Object', http: { source: 'body' }},
        returns: { arg: 'data',type: 'object'}
    })

    Book.remoteMethod('updateBook', 
    {
        http: {path: '/updateBook', verb: 'post'},
        accepts: {arg: 'reqData', type: 'Object', http: {source: 'body'}},
        returns: { arg: 'data',type: 'object'}
    })
    
    Book.remoteMethod(
        'showBook', {
            http: {path: '/show', verb: 'post'},
            accepts: {arg: 'id', type: 'string'},
            returns: { arg: 'data',type: 'object'}
        }
    )

    Book.remoteMethod(
        'listBook', {
            http: {path: '/list', verb: 'get' },
            accepts: {arg: 'queryData', type: 'object'},
            returns: { arg: 'data',type: 'object'}
      }
    )

    Book.remoteMethod('addToCart', 
    {
        http: {verb: 'post', path: '/addToCart' },
        accepts: [
            {arg: 'bookId', type: 'string'},
            {arg: 'quantity', type: 'number'},
            {arg: 'currentQuantity', type: 'number'}
        ],
        returns: { arg: 'data',type: 'object'}
    })

    Book.remoteMethod('updateCart', 
    {
        http: {verb: 'post', path: '/updateCart' },
        accepts: {arg: 'dataList', type: 'object'},
        returns: { arg: 'data', type: 'object'}
    })

    Book.remoteMethod('searchAutoCompleted', 
    {
        http: {verb: 'get', path: '/autoCompleted' },
        returns: { arg: 'data', type: 'object'}
    })

    Book.remoteMethod('search3', 
    {
        http: {verb: 'post', path: '/search' },
        accepts: {arg: 'reqData', type: 'object'},
        returns: { arg: 'data', type: 'object'}
    })

    Book.remoteMethod('listWishList', 
    {
        http: {verb: 'post', path: '/listWishList' },
        accepts: {arg: 'userId', type: 'string'},
        returns: { arg: 'data', type: 'object'}
    })

    Book.remoteMethod('addToWishList', 
    {
        http: {path: '/addToWishList', verb: 'post'},
        accepts: [
            {arg: 'userId', type: 'string', required: true},
            {arg: 'bookId', type: 'string', required: true},
            {arg: 'action', type: 'string', required: true}
        ],
        returns: { arg: 'data', type: 'object' }
    })
}
