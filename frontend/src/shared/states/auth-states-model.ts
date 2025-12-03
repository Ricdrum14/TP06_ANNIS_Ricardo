import { Utilisateur } from "../../app/models/utilisateur";

export interface AuthStateModel {
    isConnected: boolean;
    user: Utilisateur | null;
    token: string | null;
    error: string | null;
    isLoading: boolean;
}