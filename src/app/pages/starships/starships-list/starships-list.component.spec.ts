import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { StarwarsService } from '../../../services/starwars.service';
import { StarshipsListResult } from '../starship.model';
import { StarshipsListComponent } from './starships-list.component';

describe('StarshipsListComponent', () => {
  const mockResult: StarshipsListResult = {
    starships: [
      {
        id: '1',
        name: 'X-wing',
        model: 'T-65',
        manufacturer: 'Incom',
        cost_in_credits: 'unknown',
        length: '12.5',
        max_atmosphering_speed: '1050',
        crew: '1',
        passengers: '0',
        cargo_capacity: '110',
        consumables: '1 week',
        hyperdrive_rating: '1.0',
        mglt: '100',
        starship_class: 'Starfighter',
        pilots: [],
        films: []
      }
    ],
    page: 1,
    limit: 10,
    total_records: 1,
    total_pages: 1
  };

  function setup(service: Partial<StarwarsService>) {
    TestBed.configureTestingModule({
      imports: [StarshipsListComponent],
      providers: [provideZonelessChangeDetection(), { provide: StarwarsService, useValue: service }]
    });

    const fixture = TestBed.createComponent(StarshipsListComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('creates and loads the first page on init', () => {
    const listStarships = jasmine.createSpy('listStarships').and.returnValue(of(mockResult));
    const fixture = setup({ listStarships });

    expect(fixture.componentInstance).toBeTruthy();
    expect(listStarships).toHaveBeenCalledWith(1, 10);
    expect(fixture.componentInstance.starships()).toEqual(mockResult.starships);
    expect(fixture.componentInstance.totalRecords()).toBe(1);
  });

  it('requests the next page on paginator page change', () => {
    const listStarships = jasmine.createSpy('listStarships').and.returnValue(of(mockResult));
    const fixture = setup({ listStarships });

    fixture.componentInstance.onPageChange({ pageIndex: 1, pageSize: 25, previousPageIndex: 0, length: 1 });

    expect(listStarships).toHaveBeenCalledWith(2, 25);
  });

  it('sets an error message when the request fails', () => {
    const listStarships = jasmine.createSpy('listStarships').and.returnValue(throwError(() => new Error('boom')));
    const fixture = setup({ listStarships });

    expect(fixture.componentInstance.error()).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
  });
});
