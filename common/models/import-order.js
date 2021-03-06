let to = require('await-to-js').to;
app = require('../../server/server')
'use_strict';

module.exports = function(ImportOrder) {
    const Promise = require('bluebird')

    ImportOrder.ListBySupplier = async function(reqData) {
        try {
            const [data, total] = await Promise.all([
                ImportOrder.find({
                    where: {supplierId : reqData.supplierId}, 
                    fields: {
                        id: true,
                        supplierId: true,
                        subtotal: true,
                        createdAt: true,
                        status: true
                    },
                    include: ['belongsToSupplier']    
                }),
                ImportOrder.count({supplierId : reqData.supplierId})
            ])
            return {
                rows: data,
                page: page,
                pageSize: pageSize,
                total: total
            }
        } catch (err) {
            console.log('list ImportOrder of Supplier', err)
            return [400, err]
        }
    }

    ImportOrder.ListByStatus = async function(reqData) {
        try {
            const [data, total] = await Promise.all([
                ImportOrder.find({
                    where: {status : reqData.status}, 
                    fields: {
                        id: true,
                        supplierId: true,
                        subtotal: true, 
                        createdAt: true, 
                        status: true
                    }}),
                ImportOrder.count({status : reqData.status})
            ])
            return {
                rows: data,
                page: page,
                pageSize: pageSize,
                total: total
            }
        } catch (err) {
            console.log('list ImportOrder By Status', err)
            return [400, err]
        }
    }

    ImportOrder.UpdateStatus = async function(reqData) {
        try {
            const data = await ImportOrder.upsertWithWhere({id: reqData.id}, {status: reqData.status})
            return data
        } catch (err) {
            console.log('update ImportOrder Status', err)
            return [400, err]
        }
    }

    ImportOrder.createIO = async function(reqData){
        let Book = app.models.Book
        let i
        let orderDetailList = {}
        for (i = 0; i < reqData.bookList.length(); i++){
            let bookData = {
                bookId: reqData.bookList[i].bookId,
                quantity: reqData.bookList[i].quantity,
                price: reqData.bookList[i].price
            }
            orderDetailList.push(bookData)
        }
        let data = {
            supplierId: reqData.supplierId,
            status: reqData.status,
            subtotal: reqData.subtotal,
            bookList: orderDetailList,
            createdAt: Date()
        }
        try{
            let importOrder = await ImportOrder.create(data)
            for (i = 0; i < orderDetailList.length; i++){
                try{
                    let book = await Book.findById(reqData.bookList[i].bookId)
                    let newQuantity = book.quantity + reqData.bookList[i].quantity
                    let bookUpdate = await Book.upsertWithWhere(book.id, {quantity: newQuantity})
                } catch (error) {
                    console.log('update Book quantity', error)
                    return [400, error]
                }
            }
            return "success"
        } catch (err){
            console.log('create ImportOrder', err)
            return []
        }
    }

    ImportOrder.deleteIO = async function(id) {
        let [err, importOrder] = await to(ImportOrder.findOne({where: {id: id}}))
        if (importOrder == null) {
            return [200, 'can not find import order']
        }
        ImportOrder.destroyById(importOrder.id)
        return [200, 'success']
    }

    ImportOrder.listIO = async function() {
        let data = await to(ImportOrder.find())
        return data
    }

    ImportOrder.remoteMethod(
        'ListBySupplier', {
            http: {path: '/listBySupplier', verb: 'post' },
            accepts: {arg: 'reqData', type: 'Object', http: {source: 'body'}},
            returns: { arg: 'data',type: 'object'}
      }
    )

    ImportOrder.remoteMethod(
        'ListByStatus', {
            http: {path: '/listByStatus', verb: 'post' },
            accepts: {arg: 'reqData', type: 'Object', http: {source: 'body'}},
            returns: { arg: 'data',type: 'object'}
      }
    )

    ImportOrder.remoteMethod(
        'UpdateStatus', {
            http: {path: '/updateStatus', verb: 'post' },
            accepts: {arg: 'reqData', type: 'Object', http: {source: 'body'}},
            returns: { arg: 'data',type: 'object'}
      }
    )

    ImportOrder.remoteMethod(
        'createIO', {
            http: {path: '/create', verb: 'post' },
            accepts: {arg: 'reqData', type: 'Object', http: {source: 'body'}},
            returns: { arg: 'data',type: 'object'}
      }
    )
    
    ImportOrder.remoteMethod(
        'deleteIO', {
            http: {path: '/delete', verb: 'delete'},
            accepts: [
                {arg: 'id', type: 'string', required: true}
            ],
            returns: [
                {arg: 'status', type: 'number'},
                {arg: 'message', type: 'string'}],
        },
    )

    ImportOrder.remoteMethod(
        'listIO', {
            http: {path: '/list', verb: 'get'},
            returns: [
                {arg: 'status', type: 'number'},
                {arg: 'message', type: 'string'}],
        },
    )

    ImportOrder.observe('after save', async function(ctx){
        let data = ctx.instance
        let dataBookList = data.bookList
        let Book = app.models.Book
        for (var i=0; i< dataBookList.length; i++) {
            let book = await Book.findById(dataBookList[i].bookId)
            let newQuantity = book.quantity + parseInt(dataBookList[i].quantity)
            let bookData = {
                id: book.id,
                quantity: newQuantity
            }
            await Book.upsert(bookData)
        }
    })
}
