import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicOnlyRoute from '../components/PublicOnlyRoute'
import CreatePokemon from '../pages/CreatePokemon'
import Dashboard from '../pages/Dashboard'
import EditPokemon from '../pages/EditPokemon'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import PokemonDetails from '../pages/PokemonDetails'
import PokemonList from '../pages/PokemonList'
import Profile from '../pages/Profile'
import Register from '../pages/Register'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes: signed-in users are redirected to the dashboard. */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes: unauthenticated visitors are redirected to /login. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pokemon" element={<PokemonList />} />
          <Route path="/pokemon/create" element={<CreatePokemon />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
          <Route path="/pokemon/edit/:id" element={<EditPokemon />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
