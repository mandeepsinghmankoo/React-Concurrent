import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const outputDir = path.join(__dirname, '..', 'src', 'data')

fs.mkdirSync(outputDir, { recursive: true })

const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Google', 'Microsoft', 'Amazon', 'Facebook', 'Tesla']
const productTypes = ['Phone', 'Laptop', 'Tablet', 'Watch', 'Headphones', 'Speaker', 'Monitor', 'Keyboard', 'Mouse', 'Camera']
const models = ['Pro', 'Max', 'Air', 'Plus', 'Ultra', 'Mini', 'Lite', 'Studio', 'Elite', 'Prime']
const categories = ['Electronics', 'Fashion', 'Home', 'Gaming', 'Audio', 'Accessories']

const sizes = [1000, 5000, 10000, 25000, 50000, 100000]

for (const count of sizes) {
  const items = Array.from({ length: count }, (_, index) => {
    const brand = brands[index % brands.length]
    const productType = productTypes[(index * 3) % productTypes.length]
    const model = models[(index * 5) % models.length]
    const category = categories[(index * 2) % categories.length]

    return {
      id: index + 1,
      name: `${brand} ${productType} ${model}`,
      category,
      price: 100 + ((index * 37) % 901),
      rating: 3 + (index % 3),
      inStock: index % 5 !== 0,
    }
  })

  const outputPath = path.join(outputDir, `data_${count}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2))
}

console.log('Generated datasets at', outputDir)
