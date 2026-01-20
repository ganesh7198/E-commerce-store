import User from "../models/user.models";

export const addtocartcontroller = async (req, res) => {
  try {
    const { productid } = req.body;
    const userId = req.user.id; // from auth middleware

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = user.cartiteams.find(
      item => item.product.toString() === productid
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartiteams.push({
        product: productid,
        quantity: 1,
      });
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      cartiteams: user.cartiteams,
    });

  } catch (error) {
    console.error("Error in addToCartController", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const removefromcart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cartiteams = user.cartiteams.filter(
      item => item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      message: "Item removed from cart",
      cartItems: user.cartiteams,
    });

  } catch (error) {
    console.error("Error removing item from cart", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateproductqunatity=async (req,res)=>{
	const userId=req.user.id;
	const {productId,newQuantity}=req.body;
	   if (newQuantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be at least 1" });
    }
	try{
		const user = await User.findById(userId);

const item = user.cartiteams.find(
  i => i.product.toString() === productId
);

if (item) {
  item.quantity = newQuantity;
}

await user.save();
    res.status(200).json({
      message: "Quantity updated successfully",
      quantity: item.quantity,
    });
	}catch(error){
          console.log('error in the updateproduct qunatity',error.message)
		  res.status(500).json({message:"intranl server error"})
	}
}
export const getallcartproducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("  cartiteams.product"); // optional but useful

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      cartItems: user.cartiteams,
    });

  } catch (error) {
    console.error(
      "Error in getAllCartProducts controller",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
