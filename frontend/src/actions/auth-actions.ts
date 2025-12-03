import { Utilisateur } from "../app/models/utilisateur";

// 🔹 ACTION : Lancer une connexion
export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string; password: string }) {}
}

// 🔹 ACTION : Connexion réussie
export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public payload: { user: Utilisateur; token: string }) {}
}

// 🔹 ACTION : Connexion échouée
export class LoginFailure {
  static readonly type = '[Auth] Login Failure';
  constructor(public payload: { error: string }) {}
}

// 🔹 ACTION : Déconnexion
export class Logout {
  static readonly type = '[Auth] Logout';
}

// 🔹 ACTION : Charger l'auth depuis le localStorage au démarrage
export class LoadAuthFromStorage {
  static readonly type = '[Auth] Load From Storage';
}