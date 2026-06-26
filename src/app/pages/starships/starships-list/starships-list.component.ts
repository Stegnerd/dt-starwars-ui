import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { StarwarsService } from '../../../services/starwars.service';
import { Starship } from '../starship.model';

@Component({
  selector: 'app-starships-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule
  ],
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

  readonly manufacturers = signal<string[]>([]);
  readonly manufacturer = signal<string | null>(null);
  readonly manufacturersLoading = signal(false);
  readonly manufacturersError = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchManufacturers();
  }

  fetchManufacturers(): void {
    this.manufacturersLoading.set(true);
    this.manufacturersError.set(null);

    this.starwarsService.listManufacturers().subscribe({
      next: (result) => {
        this.manufacturers.set(result.manufacturers);
        this.manufacturersLoading.set(false);
        this.fetchPage();
      },
      error: () => {
        this.manufacturersError.set('Failed to load manufacturers. Please try again.');
        this.manufacturersLoading.set(false);
      }
    });
  }

  fetchPage(): void {
    this.loading.set(true);
    this.error.set(null);

    this.starwarsService.listStarships(this.pageIndex() + 1, this.pageSize(), this.manufacturer() ?? undefined).subscribe({
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

  onManufacturerChange(manufacturer: string | null): void {
    this.manufacturer.set(manufacturer);
    this.pageIndex.set(0);
    this.fetchPage();
  }
}
