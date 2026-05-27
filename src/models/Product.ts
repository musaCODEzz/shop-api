import mongoose, { Schema, Document } from 'mongoose';
export interface IProduct extends Document {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    description: string;
    available: boolean;
    createdAt: Date;
}

const productSchema = new Schema<IProduct>({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Accessories', 'Clothing', 'Books']
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    available: {
        type: Boolean,
        default: function(this: any) {
                return this.stock > 0;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    versionKey: false
}
);
const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;