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
        manufacturer: ['Incom'],
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

  const mockManufacturersResult = { manufacturers: ['Incom', 'Kuat Drive Yards'] };

  function setup(service: Partial<StarwarsService>) {
    const listManufacturers = service.listManufacturers ?? jest.fn().mockReturnValue(of(mockManufacturersResult));

    TestBed.configureTestingModule({
      imports: [StarshipsListComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: StarwarsService, useValue: { ...service, listManufacturers } }
      ]
    });

    const fixture = TestBed.createComponent(StarshipsListComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('loads manufacturers before the first page on init', () => {
    const listStarships = jest.fn().mockReturnValue(of(mockResult));
    const fixture = setup({ listStarships });

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.manufacturers()).toEqual(mockManufacturersResult.manufacturers);
    expect(listStarships).toHaveBeenCalledWith(1, 10, undefined);
    expect(fixture.componentInstance.starships()).toEqual(mockResult.starships);
    expect(fixture.componentInstance.totalRecords()).toBe(1);
  });

  it('requests the next page on paginator page change', () => {
    const listStarships = jest.fn().mockReturnValue(of(mockResult));
    const fixture = setup({ listStarships });

    fixture.componentInstance.onPageChange({ pageIndex: 1, pageSize: 25, previousPageIndex: 0, length: 1 });

    expect(listStarships).toHaveBeenCalledWith(2, 25, undefined);
  });

  it('requests the first page filtered by manufacturer when selected', () => {
    const listStarships = jest.fn().mockReturnValue(of(mockResult));
    const fixture = setup({ listStarships });

    fixture.componentInstance.onPageChange({ pageIndex: 1, pageSize: 25, previousPageIndex: 0, length: 1 });
    fixture.componentInstance.onManufacturerChange('Incom');

    expect(listStarships).toHaveBeenLastCalledWith(1, 25, 'Incom');
    expect(fixture.componentInstance.pageIndex()).toBe(0);
  });

  it('sets an error message when the starships request fails', () => {
    const listStarships = jest.fn().mockReturnValue(throwError(() => new Error('boom')));
    const fixture = setup({ listStarships });

    expect(fixture.componentInstance.error()).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('sets an error message when the manufacturers request fails', () => {
    const listManufacturers = jest.fn().mockReturnValue(throwError(() => new Error('boom')));
    const listStarships = jest.fn().mockReturnValue(of(mockResult));
    const fixture = setup({ listStarships, listManufacturers });

    expect(fixture.componentInstance.manufacturersError()).toBeTruthy();
    expect(fixture.componentInstance.manufacturersLoading()).toBe(false);
    expect(listStarships).not.toHaveBeenCalled();
  });
});
