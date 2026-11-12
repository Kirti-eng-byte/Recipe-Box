 const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

let recipes = [
  { id: 1, title: "Paneer Butter Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800", time: 30, difficulty: "Medium", tags: ["Veg", "Indian"], ingredients: [{ name: "Paneer", quantity: "200", unit: "gm" }, { name: "Tomato", quantity: "3", unit: "pc" }], steps: ["Paneer ko fry karo", "Masala banao", "Butter daal ke serve karo"], ratings: [5, 4, 5], comments: [{ user: "Priya", text: "Bahut tasty bana!" }], author: "Priya Sharma", followers: [] },
  { id: 2, title: "Chicken Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", time: 45, difficulty: "Hard", tags: ["Non-Veg", "Indian"], ingredients: [{ name: "Chicken", quantity: "500", unit: "gm" }, { name: "Rice", quantity: "2", unit: "cup" }], steps: ["Chicken ko marinate karo", "Rice ubalo", "Dum pe pakao"], ratings: [5, 4, 5], comments: [], author: "Aarav", followers: [] },
  { id: 3, title: "Veg Hakka Noodles", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800", time: 20, difficulty: "Easy", tags: ["Vegan", "Chinese"], ingredients: [{ name: "Noodles", quantity: "1", unit: "packet" }, { name: "Veg", quantity: "1", unit: "cup" }], steps: ["Noodles ubalo", "Veg fry karo", "Mix karo"], ratings: [4, 4], comments: [], author: "Sneha Verma", followers: [] },
  { id: 4, title: "Chicken Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800", time: 25, difficulty: "Easy", tags: ["Non-Veg", "Chinese"], ingredients: [{ name: "Rice", quantity: "2", unit: "cup" }, { name: "Chicken", quantity: "200", unit: "gm" }], steps: ["Rice banao", "Chicken fry karo", "Mix karo"], ratings: [5, 3], comments: [], author: "Sam", followers: [] },
  { id: 5, title: "Mango Smoothie", image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800", time: 10, difficulty: "Easy", tags: ["Vegan", "Gluten-Free", "Drink"], ingredients: [{ name: "Mango", quantity: "2", unit: "pc" }, { name: "Milk", quantity: "1", unit: "cup" }], steps: ["Mango kaato", "Mixer me daalo", "Thanda serve karo"], ratings: [5, 5], comments: [], author: "Disha", followers: [] },
  { id: 6, title: "Chole Bhature", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800", time: 40, difficulty: "Medium", tags: ["Veg", "Indian"], ingredients: [{ name: "Chole", quantity: "1", unit: "cup" }, { name: "Maida", quantity: "2", unit: "cup" }], steps: ["Chole ubalo", "Masala banao", "Bhature talo"], ratings: [5, 5, 4], comments: [], author: "Rahul Gupta", followers: [] }
]

let following = []

function withAvg(r) {
  return { ...r, avgRating: r.ratings.length ? (r.ratings.reduce((a, b) => a + b, 0) / r.ratings.length).toFixed(1) : "4.5" }
}

app.get('/api/recipes', (req, res) => {
  let out = recipes.map(withAvg)
  const { search, include, exclude, time, tag } = req.query
  if (search) out = out.filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
  if (include) out = out.filter(r => r.ingredients.some(i => i.name.toLowerCase().includes(include.toLowerCase())))
  if (exclude) out = out.filter(r => !r.ingredients.some(i => i.name.toLowerCase().includes(exclude.toLowerCase())))
  if (time) out = out.filter(r => r.time <= Number(time))
  if (tag) out = out.filter(r => r.tags.includes(tag))
  res.json(out)
})

app.get('/api/feed', (req, res) => {
  res.json(recipes.filter(r => following.includes(r.author)).map(withAvg))
})

app.post('/api/recipes', (req, res) => {
  const r = { id: Date.now(), ratings: [5], comments: [], followers: [], ...req.body }
  recipes.unshift(r)
  res.json(withAvg(r))
})

app.post('/api/recipes/:id/rate', (req, res) => {
  const r = recipes.find(x => x.id == req.params.id)
  if (r) r.ratings.push(Number(req.body.rating))
  res.json(withAvg(r))
})

app.post('/api/recipes/:id/comment', (req, res) => {
  const r = recipes.find(x => x.id == req.params.id)
  if (r) r.comments.push({ user: req.body.user || "Kirti", text: req.body.text })
  res.json(withAvg(r))
})

app.post('/api/follow/:author', (req, res) => {
  const a = req.params.author
  if (following.includes(a)) following = following.filter(x => x !== a)
  else following.push(a)
  res.json({ following })
})

app.listen(5000, () => console.log('Server chal raha hai 5000 pe'))