import mongoose from 'mongoose';

const dbConnect = () => {
    mongoose.connect("mongodb+srv://sachin:Test@fastifyproductionapi.uwzfxaz.mongodb.net/").then(() => console.log('MongoDB connected'))    
}

module.exports = { }