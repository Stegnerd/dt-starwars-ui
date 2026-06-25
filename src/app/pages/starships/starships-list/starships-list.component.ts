import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { StarwarsService } from '../../../services/starwars.service';
import { Starship } from '../starship.model';

@Component({
  selector: 'app-starships-list',
  imports: [MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './starships-list.component.html',
  styleUrl: './starships-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarshipsListComponent implements OnInit {
  private readonly starwarsService = inject(StarwarsService);

  readonly displayedColumns = ['name', 'model', 'manufacturer', 'starship_class', 'crew', 'passengers'];

  readonly starships = signal<Starship[]>([]);
  readonly totalRecords = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchPage();
  }

  fetchPage(): void {
    this.loading.set(true);
    this.error.set(null);

    this.starwarsService.listStarships(this.pageIndex() + 1, this.pageSize()).subscribe({
      next: (result) => {
        this.starships.set(result.starships);
        this.totalRecords.set(result.total_records);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load starships. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.fetchPage();
  }
}
