import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../services/productService.ts";
import { downloadAndSaveImage } from "../services/imageService.ts";
import { adminMiddleware } from "../middleware/authMiddleware.ts";

const productRouter = Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// GET /product - Retrieve all products
productRouter.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    const host = req.get("host");
    const protocol = req.protocol;

    const mappedProducts = products.map((p) => {
      const obj = p.toObject();
      if (obj.image && obj.image.startsWith("/")) {
        obj.image = `${protocol}://${host}${obj.image}`;
      }
      obj.id = obj._id;
      return obj;
    });

    res.send(mappedProducts);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

// POST /product - Create a new product
productRouter.post("/", adminMiddleware, upload.single("imageFile"), async (req, res) => {
  try {
    let { title, image, price, stock, category, description } = req.body;

    price = Number(price);
    stock = Number(stock);

    if (isNaN(price) || price < 0) {
      throw new Error("Price must be a positive number.");
    }
    if (isNaN(stock) || stock < 0) {
      throw new Error("Stock must be a non-negative number.");
    }

    if (req.file) {
      // 1. Image uploaded as a file
      image = `/uploads/${req.file.filename}`;
    } else if (image && (image.startsWith("http://") || image.startsWith("https://"))) {
      // 2. Image provided as an external URL (verify and download)
      image = await downloadAndSaveImage(image);
    } else if (!image) {
      throw new Error("Product image is required. Please upload an image or provide an image URL.");
    }

    const newProduct = await createProduct({
      title,
      image,
      price,
      stock,
      category: category || "Uncategorized",
      description: description || "",
    });

    const obj = newProduct.toObject();
    if (obj.image && obj.image.startsWith("/")) {
      obj.image = `${req.protocol}://${req.get("host")}${obj.image}`;
    }
    obj.id = obj._id;

    res.status(201).send(obj);
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

// PUT /product/:id - Update an existing product
productRouter.put("/:id", adminMiddleware, upload.single("imageFile"), async (req, res) => {
  try {
    const { id } = req.params;
    let { title, image, price, stock, category, description } = req.body;

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;

    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        throw new Error("Price must be a positive number.");
      }
      updates.price = numPrice;
    }

    if (stock !== undefined) {
      const numStock = Number(stock);
      if (isNaN(numStock) || numStock < 0) {
        throw new Error("Stock must be a non-negative number.");
      }
      updates.stock = numStock;
    }

    if (req.file) {
      // New image uploaded
      updates.image = `/uploads/${req.file.filename}`;
    } else if (image && (image.startsWith("http://") || image.startsWith("https://"))) {
      // New URL specified, verify and download
      updates.image = await downloadAndSaveImage(image);
    } else if (image !== undefined) {
      // Extract relative path if image is absolute URL pointing to this backend
      const serverPrefix = `${req.protocol}://${req.get("host")}`;
      if (image.startsWith(serverPrefix)) {
        updates.image = image.substring(serverPrefix.length);
      } else {
        updates.image = image;
      }
    }

    const updatedProduct = await updateProduct(id, updates);

    const obj = updatedProduct.toObject();
    if (obj.image && obj.image.startsWith("/")) {
      obj.image = `${req.protocol}://${req.get("host")}${obj.image}`;
    }
    obj.id = obj._id;

    res.send(obj);
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

// DELETE /product/:id - Delete a product
productRouter.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.send({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

export default productRouter;