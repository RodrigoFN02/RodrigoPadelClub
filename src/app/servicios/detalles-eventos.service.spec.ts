import { TestBed } from '@angular/core/testing';

import { DetallesEventosService } from './detalles-eventos.service';

describe('DetallesEventosService', () => {
  let service: DetallesEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
