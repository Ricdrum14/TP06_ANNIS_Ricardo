import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AuthStateModel } from "./auth-states-model";
import {
  Login,
  LoginSuccess,
  LoginFailure,
  Logout,
  LoadAuthFromStorage
} from "../../actions/auth-actions";
import { UtilisateurService } from "../../app/services/utilisateur.service";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { ClearFavorites } from "../../actions/favorite-actions";

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    isConnected: false,
    user: null,
    token: null,
    error: null,
    isLoading: false
  }
})
@Injectable()
export class AuthState {

  constructor(private utilisateurService: UtilisateurService) {}

  // =======================
  // SELECTORS
  // =======================
  @Selector()
  static isConnected(state: AuthStateModel) {
    return state.isConnected;
  }

  @Selector()
  static currentUser(state: AuthStateModel) {
    return state.user;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  @Selector()
  static isLoading(state: AuthStateModel) {
    return state.isLoading;
  }

  @Selector()
  static error(state: AuthStateModel) {
    return state.error;
  }

  // =======================
  // LOGIN
  // =======================
  @Action(Login)
  login({ patchState }: StateContext<AuthStateModel>, { payload }: Login) {

    patchState({ isLoading: true, error: null });

    return this.utilisateurService.login(payload.email, payload.password).pipe(
      tap((user) => {
        const token = `token_${user.id}_${Date.now()}`;

        patchState({
          isConnected: true,
          user,
          token,
          isLoading: false,
          error: null
        });

        // Stocker auth_user & token
        localStorage.setItem("auth_user", JSON.stringify(user));
        localStorage.setItem("auth_token", token);
      }),
      catchError(err => {
        patchState({
          isConnected: false,
          user: null,
          token: null,
          isLoading: false,
          error: err.message || 'Erreur de connexion'
        });
        return of(null);
      })
    );
  }

  // =======================
  // LOGOUT
  // =======================
  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {

    // Nettoyer favoris du user courant
    ctx.dispatch(new ClearFavorites());

    // Nettoyer auth
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');

    ctx.patchState({
      isConnected: false,
      user: null,
      token: null,
      error: null,
      isLoading: false
    });
  }

  // =======================
  // LOAD AUTH FROM STORAGE
  // =======================
  @Action(LoadAuthFromStorage)
  loadAuth({ patchState }: StateContext<AuthStateModel>) {

    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        patchState({
          isConnected: true,
          user,
          token,
          isLoading: false,
          error: null
        });
      } catch {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }
  }
}
