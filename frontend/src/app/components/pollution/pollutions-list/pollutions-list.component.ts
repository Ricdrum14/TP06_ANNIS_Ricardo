import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../../../services/pollution.service';
import { Pollution } from '../../../models/pollution';
import { Observable, map, Subject} from 'rxjs';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { PollutionsDetailsComponent } from '../../pollutions-details/pollutions-details.component';
import { AddFavorite, RemoveFavorite } from '../../../../actions/favorite-actions';
import { FavoriteState } from '../../../../shared/states/favorite-states';

@Component({
  selector: 'app-pollutions-list',
  standalone: true,
  imports: [CommonModule, PollutionsDetailsComponent],
  templateUrl: './pollutions-list.component.html',
  styleUrls: ['./pollutions-list.component.css']
})
export class PollutionsListComponent implements OnInit, OnChanges, OnDestroy {
  /** 👇 Ajout essentiel pour la liaison parent → enfant */
  @Input() refreshTrigger = 0;
  @Input() filterText = '';

  pollutions$!: Observable<Pollution[]>;
  loading = true;
  selectedPollution?: Pollution;

  showAll = false; // contrôle du bouton voir plus / moins
  maxVisible = 4; // limite par défaut

  private destroy$ = new Subject<void>();
  private store = inject(Store);

  // 🔴 Signal pour les favoris
  favorites: Signal<Pollution[]> = toSignal(
    this.store.select(FavoriteState.getFavorites),
    { initialValue: [] }
  );

  constructor(private pollutionService: PollutionService) {}

  ngOnInit(): void {
    this.loadPollutions();
  }

  /** 🔁 Quand refreshTrigger change → recharge les pollutions */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.loadPollutions();
    }
  }

  /** 🧩 Fonction centralisée pour charger les pollutions */
  private loadPollutions(): void {
    this.pollutions$ = this.pollutionService.pollutions$;
    this.pollutionService.getPollutions().subscribe(() => {
      this.loading = false;
    });
  }

  viewDetails(pollution: Pollution) {
    console.log('ID de la pollution:', pollution.id); // Debug
    this.loading = true;
    this.pollutionService.getPollutionById(pollution.id).subscribe({
      next: (detailedPollution) => {
        console.log('Détails reçus:', detailedPollution); // Debug
        this.selectedPollution = detailedPollution;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.loading = false;
        // Afficher un message à l'utilisateur
        alert('Impossible de charger les détails de la pollution. ' + error.message);
      }
    });
  }

  closeDetails() {
    this.selectedPollution = undefined;
  }

  deletePollution(id: string) {
    if (confirm('❌ Voulez-vous vraiment supprimer cette pollution ?')) {
      this.pollutionService.deletePollution(id).subscribe(() => {
        this.loadPollutions(); // recharge après suppression
      });
    }
  }

  toggleView() {
    this.showAll = !this.showAll;
  }

  // 🔴 Vérifier si une pollution est en favori
  isFavorite(pollutionId: string): boolean {
    try {
      const favs = this.favorites();
      if (!Array.isArray(favs)) {
        console.warn('⚠️ favorites is not an array');
        return false;
      }
      return favs.some(p => p.id === pollutionId);
    } catch (error) {
      console.error('❌ Erreur dans isFavorite:', error);
      return false;
    }
  }

  // ❤️ Ajouter/Retirer un favori
  toggleFavorite(pollution: Pollution, event: Event) {
    event.stopPropagation(); // Empêcher la propagation du clic
    console.log('Toggle favori pour:', pollution.id);
    
    if (this.isFavorite(pollution.id)) {
      console.log('Retirer des favoris');
      this.store.dispatch(new RemoveFavorite({ pollutionId: pollution.id }));
    } else {
      console.log('Ajouter aux favoris');
      this.store.dispatch(new AddFavorite(pollution));
    }
  }


get filteredPollutions$(): Observable<Pollution[]> {
  return this.pollutions$.pipe(
    map(pollutions =>
      pollutions.filter(p =>
        p.titre.toLowerCase().includes(this.filterText) ||
        p.lieu.toLowerCase().includes(this.filterText) ||
        p.description.toLowerCase().includes(this.filterText)
      )
    )
  );
}

/** 🧹 Nettoyage automatique quand le composant est détruit */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
