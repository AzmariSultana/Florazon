// Loads the Florazon catalogue (seed/products.json + seed/images) into MongoDB,
// uploading each product photo to Cloudinary.
//
//   npm run seed            add products that are not in the database yet
//   npm run seed -- --update  also refresh existing products (matched by name)
//
// Nothing is ever deleted. The run ends with a report of duplicate products and
// products in the database that are not part of this catalogue.
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import connectDB from '../config/mongodb.js'
import connectCloudinary from '../config/cloudinary.js'
import productModel from '../models/productModel.js'

const dir = path.dirname(fileURLToPath(import.meta.url))
const update = process.argv.includes('--update')

const required = ['MONGODB_URI', 'CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_SECRET_KEY']
const missing = required.filter((key) => !process.env[key])
if (missing.length > 0) {
    console.error(`Missing environment variables in backend/.env: ${missing.join(', ')}`)
    process.exit(1)
}

const catalogue = JSON.parse(fs.readFileSync(path.join(dir, 'products.json'), 'utf8'))

const uploadImage = async (file) => {
    const result = await cloudinary.uploader.upload(path.join(dir, 'images', file), {
        folder: 'florazon/products',
        public_id: path.parse(file).name,
        overwrite: true,
        resource_type: 'image'
    })
    return result.secure_url
}

const run = async () => {
    await connectDB()
    connectCloudinary()

    let added = 0, updated = 0, skipped = 0
    for (const [index, item] of catalogue.entries()) {
        const existing = await productModel.findOne({ name: item.name })
        if (existing && !update) {
            skipped++
            continue
        }

        const { image, ...fields } = item
        const data = { ...fields, image: [await uploadImage(image)] }

        if (existing) {
            await productModel.updateOne({ _id: existing._id }, { $set: data })
            updated++
            console.log(`Updated  ${item.name}`)
        } else {
            // Spread dates so "Latest" ordering follows the catalogue order
            await productModel.create({ ...data, date: Date.now() - index * 1000 })
            added++
            console.log(`Added    ${item.name}`)
        }
    }
    console.log(`\nDone: ${added} added, ${updated} updated, ${skipped} already present.`)

    // Read-only report on the state of the collection
    const all = await productModel.find({}, 'name image').lean()
    const names = new Set(catalogue.map((item) => item.name))
    const counts = all.reduce((acc, p) => ({ ...acc, [p.name]: (acc[p.name] || 0) + 1 }), {})
    const duplicates = Object.entries(counts).filter(([, count]) => count > 1)
    const unknown = all.filter((p) => !names.has(p.name))
    const noImage = all.filter((p) => !Array.isArray(p.image) || p.image.length === 0)

    console.log(`\nProducts in database: ${all.length}`)
    if (duplicates.length) console.log('Duplicate names:', duplicates.map(([name, count]) => `${name} (x${count})`).join(', '))
    if (unknown.length) console.log('Not in the catalogue (review or remove in the admin panel):', unknown.map((p) => p.name).join(', '))
    if (noImage.length) console.log('Products without an image:', noImage.map((p) => p.name).join(', '))
    if (!duplicates.length && !unknown.length && !noImage.length) console.log('No duplicates, unknown products or missing images found.')
}

run()
    .catch((error) => {
        console.error('Seeding failed:', error.message)
        process.exitCode = 1
    })
    .finally(() => mongoose.disconnect())
