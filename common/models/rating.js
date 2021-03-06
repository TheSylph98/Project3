let to = require('await-to-js').to
let FD = require('../formatDate')

module.exports = function(Rating) {
  const Promise = require('bluebird')

  //Rating theo book 
  Rating.rating = async function(bookId) {
        try {
            const [data, total] = await Promise.all([
                Rating.find({where: { bookId: bookId}}),
                Rating.count()
            ])
            let sum = 0

            for (var i = data.length - 1; i >= 0; i--) {
                if (data[i].rate == null){
                    data[i].rate = 5
                } 
                sum += data[i].rate
            }
            let tong = data.length
            let rating = 0
            if (tong > 0) {
                 rating = Number(sum/tong)
            } else if (tong == 0)
                {
                  rating = 5
                }
            return rating
        } catch (err) {
            console.log('Rating', err)
            throw err
        }
    }

    Rating.getRateUser = async function(bookId, userId){
        try {
            let [err,rate] = await to(Rating.findOne({where: {userId: userId, bookId: bookId}}))
            if (rate == null){
                return {"err": "User chua rate book"}
            }
            return rate
        } catch (err) {
            console.log('getRateUser', err)
            throw err
        }
    }
    //tao 1 Rating
    Rating.createRating = async function(bookId, userId, rate) {
    	
    	let dataRating = {
    		bookId: bookId,
    		userId: userId,
    		rate: rate,
    		createdAt: Date()
    	} 
        let Customer = app.models.Customer
    	try {
            //kiem tra user da rate book nay chua 
            let [err, user] = await to(Rating.findOne({where: {userId: userId, bookId: bookId}}))
            if (user != null) {
                dataRating.id = user.id
                let RatingCreate = await Rating.upsert(dataRating)
                return RatingCreate
            } else {
                let RatingCreate = await Rating.create(dataRating)
                return RatingCreate
            }
    	} catch (err) {
    		console.log('createRating', err)
    		throw err
    	}
    }

    //Xoa Rating 
    // Rating.deleteRating = async function(id) {
    	
    // }

    Rating.remoteMethod(
    	'createRating', 
    {
        http: {path: '/create', verb: 'post'},
        accepts: [ 
            {arg: 'bookId', type: 'string', required: true},
            {arg: 'userId', type: 'string', required: true},
            {arg: 'rate', type: 'number', required: true},
        ],
        returns: { arg: 'data',type: 'object'}
    })

    Rating.remoteMethod(
        'getRateUser', {
            http: {path: '/getRateUser', verb: 'post'},
            accepts: [
                {arg: 'bookId', type: 'string', required: true},
                {arg: 'userId', type: 'string', required: true}
                ],
            returns: { arg: 'data',type: 'object'}
        }
    )

    Rating.remoteMethod(
        'rating', {
            http: {path: '/list', verb: 'post'},
            accepts: {arg: 'bookId', type: 'string', required: true},
            returns: { arg: 'data',type: 'number'}
        }
    )

}