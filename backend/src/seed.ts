import mongoose from "mongoose";
import { productModel } from "./models/productModel.ts";
import { userModel } from "./models/userModel.ts";
import bcrypt from "bcrypt";

const MONGODB_URI = "mongodb://localhost:27017/ecommerce";

const seedProducts = [
  {
    title: "Ceramic Tea Cup",
    image: "/uploads/ceramic_tea_cup.png",
    price: 24.00,
    stock: 15,
    category: "Home",
    description: "Minimalist ceramic tea cup, hand-glazed with a satin matte finish. Dishwasher and microwave safe.",
  },
  {
    title: "Minimalist Leather Wallet",
    image: "/uploads/leather_wallet.png",
    price: 48.00,
    stock: 8,
    category: "Accessories",
    description: "Full-grain vegetable-tanned leather wallet. Holds up to 6 cards and folded cash. Slim profile.",
  },
  {
    title: "Hand-Poured Soy Candle",
    image: "/uploads/soy_candle.png",
    price: 18.00,
    stock: 20,
    category: "Home",
    description: "Scented soy candle with notes of sandalwood, amber, and moss. Hand-poured in a reusable amber glass jar.",
  },
  {
    title: "Merino Wool Beanie",
    image: "/uploads/merino_beanie.png",
    price: 32.00,
    stock: 12,
    category: "Apparel",
    description: "Extra-fine merino wool beanie. Soft, warm, and breathable. Rib-knit construction.",
  },
  {
    title: "Brass Key Holder",
    image: "/uploads/brass_keyholder.png",
    price: 28.00,
    stock: 5,
    category: "Accessories",
    description: "Solid brass key ring with secure screw lock closure. Patinas beautifully with age.",
  },
  {
    title: "Linen Loungewear Set",
    image: "/uploads/linen_loungewear.png",
    price: 110.00,
    stock: 3,
    category: "Apparel",
    description: "Unisex organic linen loungewear set. Includes a breathable button-down shirt and relaxed trousers.",
  },
  {
    title: "Stoneware Flower Vase",
    image: "/uploads/stoneware_vase.png",
    price: 45.00,
    stock: 7,
    category: "Home",
    description: "Earth-toned stoneware vase, ideal for dry or fresh floral arrangements. Individually thrown on the wheel.",
  },
  {
    title: "Organic Cotton Tote",
    image: "/uploads/canvas_tote.png",
    price: 22.00,
    stock: 25,
    category: "Accessories",
    description: "Heavyweight organic cotton canvas tote bag. Reinforced handles and interior pocket.",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    await productModel.deleteMany({});
    console.log("Deleted all products.");

    const created = await productModel.insertMany(seedProducts);
    console.log(`Successfully seeded ${created.length} products!`);

    await userModel.deleteMany({});
    console.log("Deleted all users.");

    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new userModel({
      firstName: "Admin",
      lastName: "User",
      email: "admin@luxe.com",
      password: hashedAdminPassword,
      role: "admin",
    });
    await adminUser.save();
    console.log("Successfully seeded admin user (admin@luxe.com / admin123)!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDB();
