import Product from "../models/product.models.js";
import cloudinary from "../utils/cloudinary.js";
import { redis } from "../utils/redis.js";

// Get all products
export const getallproduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      message: "All the products",
      data: products
    });

  } catch (error) {
    console.log("Error in get all products controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get products by category 
export const getproductsbycategory = async (req, res) => {
  try {
    const { category } = req.params;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const categoryProducts = await Product.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (categoryProducts.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json({
      message: "Category products",
      category,
      page,
      limit,
      data: categoryProducts
    });

  } catch (error) {
    console.log("Error in getProductsByCategory:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// featured product 
export const getfeaturedproduct=async(req,res)=>{
     try{
		const featuredproductredis= await redis.get("featured_products");
		if(featuredproductredis){
			return res.json(JSON.parse(featuredproductredis));
		}
        const featuredproduct= await Product.find({isFeatured:true}).sort({createdAt:-1});
		if(featuredproduct.length ===0){
			res.status(404).json({message:"no featured product found "});
		}
		await redis.set("featured_products", JSON.stringify(featuredproduct), "EX", 3600);
		res.status(200).json({message:" featured product ",data:featuredproduct})
	 }
	 catch(error){
		console.log('error in the get featured products controllers',error.message)
		res.status(500).json({message:"intrnal server error"})
	 }
}

// create product controller
export const createProduct = async (req, res) => {
  try {
    // 🔐 role check
    if (!["admin", "provider"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized to create product" });
    }

    const { name, description, price, image, category } = req.body;

    // required fields
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // validations
    if (typeof name !== "string" || name.length < 3 || name.length > 100) {
      return res.status(400).json({ message: "Invalid product name" });
    }

    if (typeof description !== "string" || description.length < 10) {
      return res.status(400).json({ message: "Description too short" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const allowedCategories = ["electronics", "fashion", "books"];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // upload image
    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "products"
    });

    if (!cloudinaryResponse?.secure_url) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    // create product
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse.secure_url,
      category,
      providername: req.user._id
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.log("error in create product:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
