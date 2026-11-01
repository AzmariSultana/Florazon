import React, { useEffect, useMemo, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl, CATEGORIES, SUB_CATEGORIES, SOLD_AS } from '../config'
import { toast } from 'react-toastify'

const IMAGE_SLOTS = 4
const emptyImages = () => Array(IMAGE_SLOTS).fill(null)

const Add = ({ token }) => {
  const [images, setImages] = useState(emptyImages)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [subCategory, setSubCategory] = useState(SUB_CATEGORIES[0])
  const [bestseller, setBestseller] = useState(false)
  // Single stems or a bouquet in sizes; every option of the chosen set is on by default
  const [soldAs, setSoldAs] = useState('bouquet')
  const [sizes, setSizes] = useState(SOLD_AS.bouquet.options)
  const [submitting, setSubmitting] = useState(false)

  // Build preview URLs once per file and release them when the files change
  const previews = useMemo(() => images.map((img) => (img ? URL.createObjectURL(img) : null)), [images])
  useEffect(() => () => previews.forEach((url) => url && URL.revokeObjectURL(url)), [previews])

  const setImageAt = (index, file) => setImages((prev) => prev.map((img, i) => (i === index ? file || null : img)))
  const toggleSize = (size) => setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setImages(emptyImages())
    setSizes(SOLD_AS[soldAs].options)
    setBestseller(false)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (images.every((img) => !img)) {
      toast.error('Please upload at least one image')
      return
    }
    if (sizes.length === 0) {
      toast.error('Please select at least one option')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))
      images.forEach((img, i) => img && formData.append(`image${i + 1}`, img))

      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        resetForm()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      // 401s are handled globally in App (auto-logout)
      if (error.response?.status !== 401) toast.error(error.response?.data?.message || error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='card flex flex-col w-full max-w-3xl items-start gap-5 p-6 sm:p-8'>
      <div>
        <p className='eyebrow'>Catalogue</p>
        <h1 className='text-lg font-medium text-ink mt-1'>Add a product</h1>
      </div>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex flex-wrap gap-2'>
          {previews.map((preview, i) => (
            <label key={i} htmlFor={`image${i + 1}`} className='cursor-pointer transition-opacity hover:opacity-80'>
              <img className='w-20 h-20 object-cover rounded-md border border-dashed border-line bg-cream' src={preview || assets.upload_area} alt={`Upload image ${i + 1}`} />
              <input onChange={(e) => setImageAt(i, e.target.files[0])} type='file' accept='image/*' id={`image${i + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <label htmlFor='product-name' className='block mb-2'>Product name</label>
        <input id='product-name' onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <label htmlFor='product-description' className='block mb-2'>Product description</label>
        <textarea id='product-description' onChange={(e) => setDescription(e.target.value)} value={description} rows={4} className='w-full max-w-[500px] px-3 py-2' placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <label htmlFor='product-category' className='block mb-2'>Product category</label>
          <select id='product-category' value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            {CATEGORIES.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor='product-subcategory' className='block mb-2'>Sub category</label>
          <select id='product-subcategory' value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            {SUB_CATEGORIES.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor='product-price' className='block mb-2'>Base price</label>
          <input id='product-price' onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type='number' min='1' placeholder='25' required />
        </div>
      </div>

      <div>
        <p className='mb-2' id='sold-as-label'>Sold as</p>
        <div className='flex flex-wrap gap-3 mb-4' role='radiogroup' aria-labelledby='sold-as-label'>
          {Object.entries(SOLD_AS).map(([key, value]) => (
            <button
              type='button'
              role='radio'
              key={key}
              aria-checked={soldAs === key}
              onClick={() => { setSoldAs(key); setSizes(value.options) }}
              className={`px-4 py-1.5 rounded-md border text-sm transition-all ${soldAs === key ? 'bg-ink border-ink text-white' : 'bg-cream border-line hover:border-gray-400'}`}
            >
              {value.label}
            </button>
          ))}
        </div>
        <p className='mb-1' id='sizes-label'>{soldAs === 'stems' ? 'Stem options' : 'Bouquet sizes'}</p>
        <p className='mb-3 text-xs text-gray-500'>The first option sells at the base price; larger options are priced automatically.</p>
        <div className='flex flex-wrap gap-3' role='group' aria-labelledby='sizes-label'>
          {SOLD_AS[soldAs].options.map((size) => (
            <button
              type='button'
              key={size}
              aria-pressed={sizes.includes(size)}
              onClick={() => toggleSize(size)}
              className={`px-4 py-1.5 rounded-md border text-sm transition-all ${sizes.includes(size) ? 'bg-brand-soft border-brand text-ink' : 'bg-cream border-line hover:border-gray-400'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-2 mt-2'>
        <input onChange={() => setBestseller((prev) => !prev)} checked={bestseller} type='checkbox' id='bestseller' className='accent-black' />
        <label className='cursor-pointer' htmlFor='bestseller'>Add to bestseller</label>
      </div>

      <button type='submit' disabled={submitting} className='btn-primary w-32 mt-2'>
        {submitting ? 'ADDING...' : 'ADD'}
      </button>
    </form>
  )
}

export default Add
