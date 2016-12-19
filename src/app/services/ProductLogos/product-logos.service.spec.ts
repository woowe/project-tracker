/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductLogosService } from './product-logos.service';

describe('ProductLogosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductLogosService]
    });
  });

  it('should ...', inject([ProductLogosService], (service: ProductLogosService) => {
    expect(service).toBeTruthy();
  }));
});
