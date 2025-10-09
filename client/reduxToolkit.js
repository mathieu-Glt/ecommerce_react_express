// ============================================
// 📁 src/store/slices/authSlice.js
// ============================================
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authAPI from '../../api/authAPI'

// Actions asynchrones
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout()
  localStorage.removeItem('token')
})

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token')
      const response = await authAPI.verifyToken(token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Échec de la connexion'
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer


// ============================================
// 📁 src/store/slices/todoSlice.js
// ============================================
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import todoAPI from '../../api/todoAPI'

// Actions asynchrones
export const fetchTodos = createAsyncThunk(
  'todos/fetchAll',
  async () => {
    const response = await todoAPI.getAll()
    return response.data
  }
)

export const createTodo = createAsyncThunk(
  'todos/create',
  async (todoText) => {
    const response = await todoAPI.create({ text: todoText })
    return response.data
  }
)

export const deleteTodoAsync = createAsyncThunk(
  'todos/delete',
  async (todoId) => {
    await todoAPI.delete(todoId)
    return todoId
  }
)

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all',
    loading: false,
    error: null,
  },
  reducers: {
    // Actions synchrones
    addTodoLocal: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      })
    },
    removeTodoLocal: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload)
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload)
      if (todo) todo.completed = !todo.completed
    },
    editTodo: (state, action) => {
      const { id, text } = action.payload
      const todo = state.items.find(t => t.id === id)
      if (todo) todo.text = text
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(t => !t.completed)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
  },
})

export const {
  addTodoLocal,
  removeTodoLocal,
  toggleTodo,
  editTodo,
  setFilter,
  clearCompleted,
} = todoSlice.actions

export default todoSlice.reducer


// ============================================
// 📁 src/store/index.js (ou store.js)
// ============================================
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import todoReducer from './slices/todoSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  },
})

export default store


// ============================================
// 📁 src/index.js (ou main.jsx)
// ============================================
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)


// ============================================
// 📁 src/App.jsx - UTILISATION
// ============================================
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, checkAuth } from './store/slices/authSlice'
import {
  fetchTodos,
  addTodoLocal,
  toggleTodo,
  createTodo,
} from './store/slices/todoSlice'

function App() {
  const dispatch = useDispatch()
  
  // Sélecteurs Auth
  const { isAuthenticated, user, loading: authLoading } = useSelector(
    (state) => state.auth
  )
  
  // Sélecteurs Todos
  const { items: todos, filter, loading: todosLoading } = useSelector(
    (state) => state.todos
  )

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // Charger les todos si authentifié
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTodos())
    }
  }, [isAuthenticated, dispatch])

  const handleLogin = () => {
    dispatch(login({ email: 'user@test.com', password: '123456' }))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleAddTodo = (text) => {
    // Option 1 : Local seulement
    dispatch(addTodoLocal(text))
    // Option 2 : Avec API
    // dispatch(createTodo(text))
  }

  const handleToggle = (id) => {
    dispatch(toggleTodo(id))
  }

  if (authLoading) return <div>Chargement...</div>

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Connexion</h1>
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Bienvenue {user?.name}</h1>
      <button onClick={handleLogout}>Déconnexion</button>
      
      <h2>Mes Todos</h2>
      {todosLoading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
              />
              {todo.text}
            </li>
          ))}
        </ul>
      )}
      
      <button onClick={() => handleAddTodo('Nouvelle tâche')}>
        Ajouter
      </button>
    </div>
  )
}

export default App