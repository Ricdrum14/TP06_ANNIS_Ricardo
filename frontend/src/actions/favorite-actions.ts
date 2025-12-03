import { Pollution } from "../app/models/pollution";

// 🔹 ACTION : Ajouter une pollution en favori
export class AddFavorite {
  static readonly type = '[Favorite] Add Favorite';
  constructor(public payload: Pollution) {}
}

// 🔹 ACTION : Retirer une pollution des favoris
export class RemoveFavorite {
  static readonly type = '[Favorite] Remove Favorite';
  constructor(public payload: { pollutionId: string }) {}
}

// 🔹 ACTION : Vider tous les favoris
export class ClearFavorites {
  static readonly type = '[Favorite] Clear Favorites';
}

// 🔹 ACTION : Charger les favoris depuis le localStorage
export class LoadFavoritesFromStorage {
  static readonly type = '[Favorite] Load From Storage';
}
