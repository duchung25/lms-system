import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 50
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

categorySchema.pre("validate", function () {
    if (this.name && !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
});

categorySchema.plugin(mongooseDelete, { 
    deletedAt: true, 
    overrideMethods: "all"
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
