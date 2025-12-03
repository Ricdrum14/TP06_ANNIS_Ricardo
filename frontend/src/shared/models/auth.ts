import { Utilisateur } from "../../app/models/utilisateur";

export interface Auth {
    isConnected: boolean;
    user: Utilisateur | null;
    token?: string;
    error?: string | null;
    isLoading?: boolean;
}