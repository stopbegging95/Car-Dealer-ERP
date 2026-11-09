import mongoose, { Document, Schema } from "mongoose";

export interface ICMSContent extends Document {
  contentType:
    | "Hero Slide"
    | "Brand Partner"
    | "Announcement Ticker"
    | "Featured Collection"
    | "Customer Review"
    | "Showroom Showcase";

  title: string;
  subtitle?: string;
  badgeText?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;

  imageUrl: string;
  secondaryImageUrl?: string;
  orderIndex: number;
  isActive: boolean;

  metadata: Record<string, any>;
  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const cmsContentSchema = new Schema<ICMSContent>(
  {
    contentType: {
      type: String,
      required: true,
      enum: [
        "Hero Slide",
        "Brand Partner",
        "Announcement Ticker",
        "Featured Collection",
        "Customer Review",
        "Showroom Showcase",
      ],
      default: "Hero Slide",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    badgeText: {
      type: String,
      default: "",
    },
    ctaText: {
      type: String,
      default: "Explore Inventory",
    },
    ctaLink: {
      type: String,
      default: "/inventory",
    },
    secondaryCtaText: {
      type: String,
      default: "",
    },
    secondaryCtaLink: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    secondaryImageUrl: {
      type: String,
      default: "",
    },
    orderIndex: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const CMSContent = mongoose.model<ICMSContent>("CMSContent", cmsContentSchema);

