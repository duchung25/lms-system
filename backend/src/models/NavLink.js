import mongoose from 'mongoose';

const navLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActiveOnly: { type: Boolean, default: false }
}, { timestamps: true });

const NavLink = mongoose.model('NavLink', navLinkSchema);

export default NavLink;
