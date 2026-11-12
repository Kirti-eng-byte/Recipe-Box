 import { useState, useEffect } from 'react'

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [include, setInclude] = useState('')
  const [exclude, setExclude] = useState('')
  const [time, setTime] = useState('')
  const [tag, setTag] = useState('')
  const [page, setPage] = useState('home')
  const [cookbook, setCookbook] = useState([])
  const [following, setFollowing] = useState([])
  const [detail, setDetail] = useState(null)
  const [title, setTitle] = useState('')
  const [img, setImg] = useState('')
  const [mins, setMins] = useState('')
  const [ingText, setIngText] = useState("")
const [stepText, setStepText] = useState("")
const [newComment, setNewComment] = useState("")

  const load = (feedOnly = false) => {
    if (feedOnly) {
      fetch('http://localhost:5000/api/feed').then(r => r.json()).then(setRecipes)
      return
    }
    const q = new URLSearchParams({ search, include, exclude, time, tag }).toString()
    fetch(`http://localhost:5000/api/recipes?${q}`).then(r => r.json()).then(setRecipes)
  }
  useEffect(() => { load() }, [])

  const goRecipes = () => { setPage('recipes'); load() }
  const goFeed = () => { setPage('feed'); load(true) }

  const rate = (id, rating) => {
    fetch(`http://localhost:5000/api/recipes/${id}/rate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating }) }).then(() => load())
  }
  const follow = (author) => {
    fetch(`http://localhost:5000/api/follow/${author}`, { method: 'POST' }).then(r => r.json()).then(d => setFollowing(d.following))
  }
  const addRecipe = () => {
    if (!title) return alert('Title likho')
    fetch('http://localhost:5000/api/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, image: img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', time: Number(mins) || 20, difficulty: 'Easy', tags: ['Veg'], ingredients: ingText ? ingText.split(",").map(x=>({name:x.trim(), quantity:"1", unit:""})) : [{ name: 'salt', quantity: '1', unit: 'tsp' }], steps: stepText ? stepText.split(",").map(x=>x.trim()) : ['Banao aur khao'], author: 'Kirti' }) }).then(() => { setTitle(''); setImg(''); setMins(''); setIngText(''); setStepText('');alert('Recipe add ho gayi! All Recipes me dekho'); goRecipes() })
  }
const addComment = async () => {
  if(!newComment) return
  const res = await fetch(`http://localhost:5000/api/recipes/${detail.id}/comment`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({user:"Kirti", text:newComment})})
  const data = await res.json()
  setDetail(data)
  setNewComment("")
}
  const btn = { padding: '10px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 'bold' }
  const card = (r) => (
    <div key={r.id} style={{ background: 'white', borderRadius: 15, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <img src={r.image} onClick={() => { setDetail(r); setPage('detail') }} style={{ width: '100%', height: 170, objectFit: 'cover', cursor: 'pointer' }} />
      <div style={{ padding: 15 }}>
        <h3 onClick={() => { setDetail(r); setPage('detail') }} style={{ cursor: 'pointer' }}>{r.title}</h3>
        <p>⭐ {r.avgRating || '4.5'} | ⏱️ {r.time} min | By {r.author}</p>
        <p>{r.tags.join(', ')}</p>
        <button onClick={() => { setDetail(r); setPage('detail') }} style={{ ...btn, background: '#ea580c', color: 'white', marginRight: 6 }}>View Recipe</button>
        <button onClick={() => setCookbook([...cookbook, r])} style={{ ...btn, background: '#fef3c7' }}>Save 📚</button>
        <button onClick={() => follow(r.author)} style={{ ...btn, background: following.includes(r.author) ? '#16a34a' : '#eee', color: following.includes(r.author) ? 'white' : 'black', marginLeft: 6 }}>{following.includes(r.author) ? 'Following ✓' : 'Follow ' + r.author}</button>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Arial', background: '#fff7ed', minHeight: '100vh' }}>
      {/* UPAR WALA MENU - Ye har page pe dikhega */}
      <div style={{ background: '#ea580c', padding: 15, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', position: 'sticky', top: 0 }}>
        <b style={{ color: 'white', fontSize: 24, marginRight: 15, cursor: 'pointer' }} onClick={() => setPage('home')}>🍳 RecipeBox</b>
        <button onClick={() => setPage('home')} style={{ ...btn, background: page === 'home' ? 'white' : '#ffedd5' }}>Home</button>
        <button onClick={goRecipes} style={{ ...btn, background: page === 'recipes' ? 'white' : '#ffedd5' }}>All Recipes</button>
        <button onClick={goFeed} style={{ ...btn, background: page === 'feed' ? 'white' : '#ffedd5' }}>My Feed ❤️</button>
        <button onClick={() => setPage('cookbook')} style={{ ...btn, background: page === 'cookbook' ? 'white' : '#ffedd5' }}>Cookbook ({cookbook.length})</button>
        <button onClick={() => setPage('add')} style={{ ...btn, background: page === 'add' ? 'white' : '#ffedd5' }}>+ Add Recipe</button>
      </div>

      <div style={{ padding: 20, maxWidth: 1100, margin: 'auto' }}>

        {/* PAGE 1: HOME */}
        {page === 'home' && <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 48, color: '#ea580c' }}>Welcome to RecipeBox 🍳</h1>
          <p style={{ fontSize: 18 }}>Search your recepie, make it, share it. Follow your favourite recepians..!.</p>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900" style={{ width: '100%', maxWidth: 800, height: 300, objectFit: 'cover', borderRadius: 20 }} />
          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={goRecipes} style={{ ...btn, background: '#ea580c', color: 'white', fontSize: 16 }}>See all recips here..!→</button>
            <button onClick={() => setPage('add')} style={{ ...btn, background: 'white', border: '1px solid #ea580c' }}>Add Recipe</button>
          </div>
          <h2 style={{ marginTop: 30 }}>Today's Top 3 Recipes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 15, textAlign: 'left' }}>{recipes.slice(0, 3).map(card)}</div>
        </div>}

        {/* PAGE 2: ALL RECIPES */}
        {page === 'recipes' && <div>
          <h1>All Recipes</h1>
          <div style={{ background: 'white', padding: 15, borderRadius: 15 }}>
            <input placeholder="🔍 Search Recipe - jaise Biryani" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 10, borderRadius: 10, border: '1px solid #ddd' }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input placeholder="Include: Paneer" value={include} onChange={e => setInclude(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
              <input placeholder="Exclude: Onion" value={exclude} onChange={e => setExclude(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
              <input placeholder="Max Time" value={time} onChange={e => setTime(e.target.value)} style={{ width: 100, padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
              <button onClick={() => load()} style={{ ...btn, background: '#ea580c', color: 'white' }}>Search</button>
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['All', 'Veg', 'Non-Veg', 'Vegan', 'Indian', 'Chinese', 'Gluten-Free'].map(t => <button key={t} onClick={() => { setTag(t === 'All' ? '' : t); setTimeout(() => load(), 100) }} style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid #ea580c', background: 'white' }}>{t}</button>)}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 15, marginTop: 20 }}>{recipes.map(card)}</div>
        </div>}

        {/* PAGE 3: MY FEED */}
        {page === 'feed' && <div>
          <h1>My Feed ❤️</h1>
          <p>Show only those recpies whom you have followed. Go and first follow them then enjoy recipes..!</p>
          {recipes.length === 0 ? <p style={{ background: 'white', padding: 20, borderRadius: 15 }}>Abhi khaali hai. All Recipes me jao aur kisi ko Follow karo.</p> :
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 15 }}>{recipes.map(card)}</div>}
        </div>}

        {/* PAGE 4: COOKBOOK */}
        {page === 'cookbook' && <div>
          <h1>📚 Meri Cookbook</h1>
          {cookbook.length === 0 ? <p>Not save anything right now. First go and save it.</p> :
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 15 }}>{cookbook.map(card)}</div>}
        </div>}

        {/* PAGE 5: ADD RECIPE */}
        {page === 'add' && <div style={{ background: 'white', padding: 25, borderRadius: 15, maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
          <h1>➕ Add new recepie</h1>
          <input placeholder="Recipe Name - jaise Maggi" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 10, borderRadius: 10, border: '1px solid #ddd' }} />
          <input placeholder="Photo Link" value={img} onChange={e => setImg(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 10, borderRadius: 10, border: '1px solid #ddd' }} />
          <input placeholder="Time in minutes - jaise 10" value={mins} onChange={e => setMins(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 10, borderRadius: 10, border: '1px solid #ddd' }} />
          <input placeholder="Write ingredients - jaise Paneer, Tomato, Butter" value={ingText} onChange={e=>setIngText(e.target.value)} style={{width:'100%',padding:10,marginTop:10}} />
<input placeholder=" Write Steps - jaise Fry karo, Masala banao" value={stepText} onChange={e=>setStepText(e.target.value)} style={{width:'100%',padding:10,marginTop:10}} />
          <button onClick={addRecipe} style={{ ...btn, background: '#ea580c', color: 'white', fontSize: 16 }}>Add Recipe</button>
        </div>}

        {/* PAGE 6: RECIPE DETAIL - Alag Page */}
        {page === 'detail' && detail && <div style={{ background: 'white', borderRadius: 15, overflow: 'hidden', maxWidth: 700, margin: 'auto' }}>
          <button onClick={goRecipes} style={{ ...btn, margin: 15 }}>← Wapas Jao</button>
          <img src={detail.image} style={{ width: '100%', height: 300, objectFit: 'cover' }} />
          <div style={{ padding: 20 }}>
            <h1>{detail.title}</h1>
            <p>⭐ {detail.avgRating || '4.5'} | ⏱️ {detail.time} min | {detail.difficulty} | By {detail.author} | {detail.tags.join(', ')}</p>
            <button onClick={() => follow(detail.author)} style={{ ...btn, background: following.includes(detail.author) ? '#16a34a' : '#eee', color: following.includes(detail.author) ? 'white' : 'black' }}>{following.includes(detail.author) ? 'Following ✓' : 'Follow ' + detail.author}</button>
            <h3>Ingredients:</h3>
            <ul>{detail.ingredients.map((i, idx) => <li key={idx}>{i.name} - {i.quantity} {i.unit}</li>)}</ul>
            <h3>Steps:</h3>
            <ol>{detail.steps.map((s, idx) => <li key={idx}>{s}</li>)}</ol>
            <h3>Rating Do:</h3>
            <div>{[1, 2, 3, 4, 5].map(n => <span key={n} onClick={() => rate(detail.id, n)} style={{ cursor: 'pointer', fontSize: 28 }}>⭐</span>)}</div>
            <h3>Comments:</h3>
            {detail.comments.map((c, idx) => <p key={idx}>💬 {c.user}: {c.text}</p>)}
            <div style={{marginTop:15}}>
<input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Apna comment likho..." style={{width:'70%',padding:10}} />
<button onClick={addComment} style={{padding:10,marginLeft:5,background:'red',color:'white',border:'none',borderRadius:5}}>Comment Karo</button>
</div>
          </div>
        </div>}

      </div>
    </div>
  )
}