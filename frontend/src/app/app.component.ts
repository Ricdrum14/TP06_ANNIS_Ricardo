import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadAuthFromStorage } from '../actions/auth-actions';
import { LoadFavoritesFromStorage } from '../actions/favorite-actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Pollution';

  private store = inject(Store);

  ngOnInit() {
    // 📦 Au démarrage de l'app, charger l'authentification depuis le localStorage
    this.store.dispatch(new LoadAuthFromStorage());
    // ❤️ Charger les favoris depuis le localStorage
    this.store.dispatch(new LoadFavoritesFromStorage());
  }
}
