import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


class ProductRepository {

    constructor() {
        this.collection = "products";
    }

    async add(newProduct) {
        try {
            // 1 . Get the db.
            const db = getDB();
            const collection = db.collection(this.collection);
            await collection.insertOne(newProduct);
            return newProduct;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getAll() {
        try {
            // 1. Get the database
            const db = getDB();

            // 2. Get the collection
            const collection = db.collection(this.collection);

            // 3. Find all product.
            return await collection.find().toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async get(id) {
        try {
            // 1. Get the database
            const db = getDB();

            // 2. Get the collection
            const collection = db.collection(this.collection);

            // 3. Find all product.
            return await collection.findOne({ _id: new ObjectId(id) });
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async filter(minPrice, maxPrice, category) {
        try {
            // 1. Get the database
            const db = getDB();

            // 2. Get the collection
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if (minPrice) {
                filterExpression.price = { $gte: parseFloat(minPrice) }
            }
            if (maxPrice) {
                filterExpression.price = { ...filterExpression.price, $lte: parseFloat(maxPrice) }
            }
            if (category) {
                filterExpression.price = category;
            }
            return collection.find(filterExpression).toArray();

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // async rate(userID, productID, rating) {
    //     try {
    //         // 1. Get the database
    //         const db = getDB();

    //         // 2. Get the collection
    //         const collection = db.collection(this.collection);
    //         // 1. Find the product
    //         const product = await collection.findOne({_id: new ObjectId(productID)});
    //         // 2. Find the rating
    //         const userRating = product?.rating?.find(r=> r.userID == userID);
    //         if(userRating){
    //             // 3. Update the rating
    //             await collection.updateOne({
    //                 _id : new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //             },{
    //                 $set:{
    //                     "ratings.$.rating":rating
    //                 }
    //             })
    //         }else{
    //             await collection.updateOne({ _id: new ObjectId(productID) }, { $push: { rating: { userID: new ObjectId(userID), rating } } });
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }

    async rate(userID, productID, rating){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            
            // 1. Removes existing entry
            await collection.updateOne({
                _id:new ObjectId(productID)
            },
            {
                $pull:{ratings:{userID: new ObjectId(userID)}}
            })

            // 2. Add new entry
            await collection.updateOne({
                _id:new ObjectId(productID)
            },{
                $push: {ratings: {userID:new ObjectId(userID), rating}}
            })

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async averageProductPricePerCategory(){
        try{
            const db = getDB();
            return await db.collection(this.collection)
                .aggregate([
                    {
                        // Stage 1 : Get average price per category
                        $group:{
                            _id:"$category",
                            averagePrice:{$avg:"$price"}
                        }
                    }
                ]).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

}

export default ProductRepository;