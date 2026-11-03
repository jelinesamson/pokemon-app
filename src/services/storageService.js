import { deleteObject, ref } from 'firebase/storage'
import { storage } from '../firebase/firebaseConfig'

/**
 * Reads the object path back out of a Firebase Storage download URL.
 * Returns null for image URLs that are not hosted by Firebase Storage.
 */
export function storagePathFromDownloadUrl(imageUrl) {
  if (!imageUrl) return null

  try {
    const url = new URL(imageUrl)
    if (url.hostname !== 'firebasestorage.googleapis.com') return null

    const marker = '/o/'
    const markerIndex = url.pathname.indexOf(marker)
    if (markerIndex === -1) return null

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length))
  } catch {
    return null
  }
}

/**
 * Best-effort cleanup for replaced artwork. If the URL does not point at
 * Firebase Storage, or the caller is not allowed to delete it, nothing happens.
 */
export async function deletePokemonImage(imageUrl) {
  const path = storagePathFromDownloadUrl(imageUrl)
  if (!storage || !path) return false

  try {
    await deleteObject(ref(storage, path))
    return true
  } catch {
    return false
  }
}
