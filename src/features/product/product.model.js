import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";


export default class ProductModel {
    constructor(name, desc, price, imageURL, category, sizes, id) {
        this._id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageURL = imageURL;
        this.category = category;
        this.sizes = sizes;
    }

    static add(product) {
        product.id = products.length + 1;
        products.push(product);
        return product;
    }

    static get(id) {
        const product = products.find((i) => i.id == id);
        return product;
    }

    static getAll() {
        return products;
    }

    static filter(minPrice, maxPrice, category) {
        const result = products.filter((product) => {
            return (
                (!minPrice || product.price >= minPrice) &&
                (!maxPrice || product.price <= maxPrice) &&
                (!category || product.category == category)
            );
        });
        return result;
    }

    static rateProduct(userID, productID, rating) {

        // 1. Vaildate user and product
        const user = UserModel.getAll().find((u) => u.id == userID);
        if (!user) {
            throw new ApplicationError('User not found', 404);
        }
        const product = products.find((p) => p.id == productID);
        if (!product) {
            throw new ApplicationError('Product not found', 400);
        }
        // 2. Check if there are any ratings and if not then add rating array.
        if (!product.rating) {
            product.ratings = [];
            product.ratings.push({ userID: userID, rating: rating });
        }
        else {
            // check if user rating is already available
            const existingRatingIndex = product.ratings.findIndex((r) => r.userID == userID);
            if (existingRatingIndex >= 0) {
                product.ratings[existingRatingIndex] = { userID: userID, rating: rating };
            }
            else {
                // if no existing rating, then add new rating.
                product.ratings.push({ userID: userID, rating: rating });
            }
        }

    }

}

var products = [
    new ProductModel(
        1,
        'Product 1',
        'Description for Product 1',
        19.99,
        'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
        'Category1',
    ),
    new ProductModel(
        2,
        'Product 2',
        'Description for Product 2',
        29.99,
        'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
        'Category2',
        ['M', 'XL']
    ),
    new ProductModel(
        3,
        'Product 3',
        'Description for Product 3',
        39.99,
        'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
        'Category3',
        ['M', 'XL', 'S']
    ),
]